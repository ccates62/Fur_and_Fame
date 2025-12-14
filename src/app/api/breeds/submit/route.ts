import { NextRequest, NextResponse } from "next/server";
import { addCustomBreed, getAllCustomBreeds } from "@/lib/breed-storage";
import { validateBreedName } from "@/lib/breed-validator";

/**
 * API route to submit and validate new breeds
 * POST /api/breeds/submit
 * 
 * This endpoint:
 * 1. Validates the breed name format
 * 2. Verifies breed exists via online sources (Wikipedia, etc.)
 * 3. Only stores verified breeds
 * 4. Returns success/error status with validation details
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { petType, breedName } = body;

    // Validate input
    if (!petType || !breedName) {
      return NextResponse.json(
        { error: "Missing required fields: petType and breedName" },
        { status: 400 }
      );
    }

    if (!["dog", "cat", "other"].includes(petType)) {
      return NextResponse.json(
        { error: "Invalid petType. Must be 'dog', 'cat', or 'other'" },
        { status: 400 }
      );
    }

    // Clean breed name
    const cleanedBreed = breedName.trim();

    // Step 1: Validate breed name format
    if (cleanedBreed.length < 2 || cleanedBreed.length > 50) {
      return NextResponse.json(
        { error: "Breed name must be between 2 and 50 characters" },
        { status: 400 }
      );
    }

    // Step 2: Verify breed exists via online sources
    console.log(`🔍 Validating breed: ${petType} - ${cleanedBreed}`);
    const validationResult = await validateBreedName(cleanedBreed, petType);

    if (!validationResult.isValid) {
      console.log(`❌ Breed validation failed: ${validationResult.reason || "Unknown reason"}`);
      
      // If there's a suggested spelling, include it in the response
      const errorMessage = validationResult.suggestedSpelling
        ? `${validationResult.reason || "Could not verify this breed/animal exists."} Did you mean "${validationResult.suggestedSpelling}"?`
        : validationResult.reason || "Could not verify this breed/animal exists. Please check the spelling or try a different name.";
      
      return NextResponse.json(
        {
          error: "Breed validation failed",
          message: errorMessage,
          confidence: validationResult.confidence,
          suggestedSpelling: validationResult.suggestedSpelling,
        },
        { status: 400 }
      );
    }

    console.log(`✅ Breed validated: ${cleanedBreed} (${validationResult.confidence} confidence, source: ${validationResult.source})`);

    // Step 3: Store the verified breed with validation info
    const storedBreed = addCustomBreed(cleanedBreed, petType, {
      verified: true,
      source: validationResult.source,
      confidence: validationResult.confidence,
    });
    
    console.log(`✅ Verified breed stored: ${petType} - ${cleanedBreed} (Usage count: ${storedBreed.usageCount})`);

    // Return success with validation details
    return NextResponse.json({
      success: true,
      message: validationResult.suggestedSpelling 
        ? `Breed validated and submitted successfully. Note: Did you mean "${validationResult.suggestedSpelling}"?`
        : "Breed validated and submitted successfully",
      breed: cleanedBreed,
      petType,
      usageCount: storedBreed.usageCount,
      validation: {
        confidence: validationResult.confidence,
        source: validationResult.source,
      },
      suggestedSpelling: validationResult.suggestedSpelling,
      note: storedBreed.usageCount === 1 
        ? "This breed has been verified and will be added to the list after 3 uses."
        : `This breed has been used ${storedBreed.usageCount} times.`,
    });
  } catch (error: any) {
    console.error("Error submitting breed:", error);
    return NextResponse.json(
      {
        error: "Failed to submit breed",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

