import { NextRequest, NextResponse } from "next/server";
import { generatePortraitVariants, generatePortraitVariantsForProducts, GeneratePortraitParams, isTestMode } from "@/lib/fal-client";
import { getOrCreateSession, updateSession, getClientIP, canGenerateFree } from "@/lib/generation-tracker";
import { validateUserContent } from "@/lib/content-moderation";

/**
 * API route to generate AI portrait variants for multiple styles
 * POST /api/generate
 * 
 * Now accepts an array of styles (up to 3 for free, more require payment)
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

    // Validate: must select exactly 3 styles for initial generation
    const selectedStyles: string[] = body.styles || [];
    if (selectedStyles.length !== 3) {
      return NextResponse.json(
        {
          error: "Invalid selection",
          message: "Please select exactly 3 styles for your free generation",
        },
        { status: 400 }
      );
    }

    // Check if this is initial generation (free) or additional (paid)
    const isInitialGeneration = session.free_generations_used === 0;
    
    if (isInitialGeneration) {
      // Validate they haven't used free generations yet
      if (!canGenerateFree(session)) {
        return NextResponse.json(
          {
            error: "Free generations exhausted",
            message: "You've used all 3 free style generations. Additional styles are $0.50 each.",
            requires_payment: true,
          },
          { status: 402 }
        );
      }
    } else {
      // Additional generation requires payment
      return NextResponse.json(
        {
          error: "Payment required",
          message: "You've already used your 3 free styles. Additional styles are $0.50 each.",
          requires_payment: true,
        },
        { status: 402 }
      );
    }

    // Validate required fields
    if (!body.petName || !body.breed || !body.imageUrl) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "petName, breed, and imageUrl are required",
        },
        { status: 400 }
      );
    }

    // Validate content for inappropriate material
    const nameValidation = validateUserContent(body.petName, "pet name");
    if (!nameValidation.isValid) {
      return NextResponse.json(
        {
          error: "Invalid content",
          message: nameValidation.error || "Pet name contains inappropriate content",
        },
        { status: 400 }
      );
    }

    if (body.extraNotes) {
      const notesValidation = validateUserContent(body.extraNotes, "notes");
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

    // Check if productIds are provided for product-specific generation
    const productIds: string[] | undefined = body.productIds;
    
    // Generate variants for all 3 styles
    const allVariants: Record<string, any[]> = {};
    const productVariantsMap: Record<string, Record<string, any[]>> = {}; // Store full product mapping
    const generatedStyles: string[] = [];

    for (const style of selectedStyles) {
      const params: GeneratePortraitParams = {
        petName: body.petName,
        breed: body.breed,
        petType: body.petType,
        style: style,
        extraNotes: body.extraNotes,
        imageUrl: body.imageUrl,
        productId: productIds, // Pass productIds if provided
      };

      // If productIds provided, generate for each product with correct aspect ratios
      if (productIds && productIds.length > 0) {
        const productVariants = await generatePortraitVariantsForProducts(params, productIds);
        
        // Store full product mapping for checkout page
        productVariantsMap[style] = productVariants;
        
        // Flatten structure for VariantPicker compatibility
        // Merge all product variants into a single array, but keep productId info
        // Structure: { style: [variants with productId] }
        const flattenedVariants: any[] = [];
        for (const [productId, variants] of Object.entries(productVariants)) {
          flattenedVariants.push(...variants);
        }
        allVariants[style] = flattenedVariants;
      } else {
        // Default generation without product context (uses default 3:4 aspect ratio)
        const variants = await generatePortraitVariants(params);
        allVariants[style] = variants;
      }
      
      generatedStyles.push(style);
    }

    // Update session
    await updateSession(session.id, {
      pet_name: body.petName,
      breed: body.breed,
      pet_type: body.petType,
      photo_url: body.imageUrl,
      selected_styles: selectedStyles,
      generated_styles: [...session.generated_styles, ...generatedStyles],
      free_generations_used: isInitialGeneration ? 3 : session.free_generations_used,
    });

    const testMode = isTestMode();

    return NextResponse.json({
      success: true,
      variants: allVariants, // Organized by style (flattened for VariantPicker)
      productVariantsMap: Object.keys(productVariantsMap).length > 0 ? productVariantsMap : undefined, // Full product mapping for checkout
      session_id: session.id,
      testMode,
      free_generations_used: isInitialGeneration ? 3 : session.free_generations_used,
      remaining_free: Math.max(0, 3 - (isInitialGeneration ? 3 : session.free_generations_used)),
      message: testMode 
        ? "Portraits generated successfully (TEST MODE)" 
        : "Portraits generated successfully",
    });
  } catch (error: any) {
    console.error("Error generating portraits:", error);
    
    // Provide more helpful error messages
    let errorMessage = error.message || "Unknown error occurred";
    let statusCode = 500;
    
    if (errorMessage.includes("API key") || errorMessage.includes("FAL_API_KEY")) {
      statusCode = 401;
      errorMessage = "API key not configured. Please set FAL_API_KEY in your environment variables.";
    } else if (errorMessage.includes("balance") || errorMessage.includes("credit") || errorMessage.includes("insufficient")) {
      statusCode = 402;
      errorMessage = "Insufficient account balance. Please add funds to your fal.ai account or enable TEST_MODE for free testing.";
    }
    
    return NextResponse.json(
      {
        error: "Failed to generate portraits",
        message: errorMessage,
        testMode: isTestMode(),
        suggestion: !isTestMode() 
          ? "To test without costs, set FAL_TEST_MODE=true in your .env.local file"
          : undefined,
      },
      { status: statusCode }
    );
  }
}

