import { NextRequest, NextResponse } from "next/server";
import { generatePortraitVariants, GeneratePortraitParams, isTestMode } from "@/lib/fal-client";
import { getOrCreateSession, updateSession, getClientIP } from "@/lib/generation-tracker";
import { validateUserContent } from "@/lib/content-moderation";

/**
 * API route to generate AI portraits for multiple subjects
 * POST /api/generate-multi-subject
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ipAddress = getClientIP(request);
    
    // Check if API key is missing - if so, use test mode immediately
    const hasApiKey = !!process.env.FAL_API_KEY;
    if (!hasApiKey) {
      console.log("⚠️ FAL_API_KEY not configured - using test mode with placeholder variants");
      
      // Validate required fields
      if (!body.subjects || !Array.isArray(body.subjects) || body.subjects.length === 0) {
        return NextResponse.json(
          {
            error: "Missing required fields",
            message: "subjects array is required",
          },
          { status: 400 }
        );
      }
      
      // Get or create session for tracking
      const session = await getOrCreateSession(ipAddress, body.fingerprint);
      
      const { subjects, backgroundType } = body;
      const placeholderVariants: Record<string, any[]> = {};
      
      for (const subject of subjects) {
        if (subject.type === "pet") {
          const params: GeneratePortraitParams = {
            petName: subject.name || "Pet",
            breed: subject.breed || "Unknown",
            petType: subject.petType || "dog",
            imageUrl: subject.imageUrl,
            backgroundType: backgroundType || "solid",
          };
          const placeholders = await generatePortraitVariants(params);
          placeholderVariants[`${subject.name || "pet"}-${subject.id}`] = placeholders;
        } else {
          const params: GeneratePortraitParams = {
            petName: "person",
            breed: "person",
            petType: "other",
            imageUrl: subject.imageUrl,
            backgroundType: backgroundType || "solid",
            personSex: subject.sex,
            personEthnicity: subject.ethnicity,
            personHairColor: subject.hairColor,
          };
          const placeholders = await generatePortraitVariants(params);
          placeholderVariants[`person-${subject.id}`] = placeholders;
        }
      }
      
      return NextResponse.json({
        success: true,
        variants: placeholderVariants,
        session_id: session?.id,
        testMode: true,
        message: "Portraits generated successfully (TEST MODE - placeholder images)",
        warning: "FAL_API_KEY is not configured. To use real AI generation, set FAL_API_KEY in your environment variables.",
      });
    }
    
    // Get or create session
    const session = await getOrCreateSession(ipAddress, body.fingerprint);
    if (!session) {
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!body.subjects || !Array.isArray(body.subjects) || body.subjects.length === 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "subjects array is required",
        },
        { status: 400 }
      );
    }

    const { subjects, portraitType, themes, layouts, backgroundType } = body;
    const testMode = isTestMode();

    // Validate all subject names and notes for inappropriate content
    for (const subject of subjects) {
      if (subject.name) {
        const nameValidation = validateUserContent(subject.name, "subject name");
        if (!nameValidation.isValid) {
          return NextResponse.json(
            {
              error: "Invalid content",
              message: nameValidation.error || "Subject name contains inappropriate content",
            },
            { status: 400 }
          );
        }
      }
      
      if (subject.notes) {
        const notesValidation = validateUserContent(subject.notes, "notes");
        if (!notesValidation.isValid) {
          return NextResponse.json(
            {
              error: "Invalid content",
              message: notesValidation.error || "Notes contain inappropriate content",
            },
            { status: 400 }
          );
        }
      }
    }

    // For now, generate individual portraits for each subject
    // In the future, this can be enhanced to create composite portraits
    const allVariants: Record<string, any[]> = {};
    
    for (const subject of subjects) {
      if (subject.type === "pet") {
        // Generate pet portraits
        const petName = subject.name || "Pet";
        const breed = subject.breed || "Unknown";
        const petType = subject.petType || "dog";
        
        // Use first theme if styled, otherwise basic
        const style = portraitType === "styled" && themes && themes[0] ? themes[0] : undefined;
        
        const params: GeneratePortraitParams = {
          petName,
          breed,
          petType,
          style,
          imageUrl: subject.imageUrl,
          backgroundType: backgroundType || "solid",
        };

        const variants = await generatePortraitVariants(params);
        allVariants[`${petName}-${subject.id}`] = variants;
      } else {
        // Generate person portraits (basic mode for now)
        const params: GeneratePortraitParams = {
          petName: "person",
          breed: "person",
          petType: "other",
          imageUrl: subject.imageUrl,
          backgroundType: backgroundType || "solid",
          personSex: subject.sex,
          personEthnicity: subject.ethnicity,
          personHairColor: subject.hairColor,
        };

        const variants = await generatePortraitVariants(params);
        allVariants[`person-${subject.id}`] = variants;
      }
    }

    // Update session
    await updateSession(session.id, {
      free_generations_used: session.free_generations_used + subjects.length,
    });

    return NextResponse.json({
      success: true,
      variants: allVariants,
      session_id: session.id,
      testMode,
      message: testMode 
        ? "Portraits generated successfully (TEST MODE)" 
        : "Portraits generated successfully",
    });
  } catch (error: any) {
    console.error("Error generating multi-subject portraits:", error);
    
    let errorMessage = error.message || "Unknown error occurred";
    let statusCode = 500;
    const testMode = isTestMode();
    const hasApiKey = !!process.env.FAL_API_KEY;
    
    // If API key is missing, return helpful error (shouldn't reach here if early check worked)
    if (!hasApiKey || (errorMessage.includes("API key") || errorMessage.includes("FAL_API_KEY"))) {
      console.log("⚠️ FAL_API_KEY not configured - this should have been caught earlier");
      // Can't parse request body again in catch block, so just return helpful message
      statusCode = 200;
      return NextResponse.json({
        success: false,
        variants: {},
        testMode: true,
        message: "FAL_API_KEY is not configured. Please set it in your environment variables to generate portraits.",
        warning: "Test mode is active but generation failed. Check server logs for details.",
      });
    }
    
    if (errorMessage.includes("balance") || errorMessage.includes("credit") || errorMessage.includes("insufficient")) {
      statusCode = 402;
      errorMessage = "Insufficient account balance. Please add funds to your fal.ai account or enable TEST_MODE for free testing.";
    }
    
    return NextResponse.json(
      {
        error: "Failed to generate portraits",
        message: errorMessage,
        testMode,
        suggestion: !testMode 
          ? "To test without costs, set FAL_TEST_MODE=true in your .env.local file"
          : undefined,
      },
      { status: statusCode }
    );
  }
}

