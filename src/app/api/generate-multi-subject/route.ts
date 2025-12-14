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
    
    // If API key is missing, always use test mode (even if error occurred)
    // This ensures users can still test the flow without API key
    if (!hasApiKey || (errorMessage.includes("API key") || errorMessage.includes("FAL_API_KEY"))) {
      console.log("⚠️ FAL_API_KEY not configured - returning test mode response");
      statusCode = 200;
      return NextResponse.json({
        success: true,
        variants: {},
        testMode: true,
        message: "Test mode is active. Portraits will use placeholder images.",
        warning: "FAL_API_KEY is not configured. To use real AI generation, set FAL_API_KEY in your environment variables.",
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

