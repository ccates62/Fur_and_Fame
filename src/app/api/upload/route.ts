import { NextRequest, NextResponse } from "next/server";
import { validateImageContent, sanitizeFilename } from "@/lib/content-moderation";
import { moderateImageFromDataUrl } from "@/lib/fal-image-moderation";

/**
 * API route to handle pet photo uploads
 * For now, we'll use a simple approach - in production, upload directly to Supabase
 * POST /api/upload
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate image content (file type, size, and check for inappropriate filenames)
    const imageValidation = await validateImageContent(file);
    if (!imageValidation.isValid) {
      return NextResponse.json(
        { error: imageValidation.error || "Invalid image file" },
        { status: 400 }
      );
    }

    // Sanitize filename to prevent inappropriate names
    const sanitizedFilename = sanitizeFilename(file.name);

    // Validate file type (including HEIC/HEIF for iPhone)
    // Note: validateImageContent already checks file type, but we keep this for additional validation
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/heic",
      "image/heif",
    ];
    
    const fileExtension = file.name.toLowerCase().split(".").pop();
    const isValidType = 
      validTypes.includes(file.type.toLowerCase()) ||
      ["jpg", "jpeg", "png", "gif", "webp", "heic", "heif"].includes(fileExtension || "");

    if (!isValidType) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload JPG, PNG, GIF, HEIC, or WebP." },
        { status: 400 }
      );
    }

    // Check file size (max 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 20MB." },
        { status: 400 }
      );
    }

    // Convert to base64 data URL for moderation and processing
    // In production, upload to Supabase storage
    // Note: HEIC files will need conversion on the client side or server-side library
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    
    // Normalize MIME type (HEIC/HEIF to JPEG for compatibility)
    let mimeType = file.type;
    if (mimeType.includes("heic") || mimeType.includes("heif") || fileExtension === "heic" || fileExtension === "heif") {
      mimeType = "image/jpeg"; // Convert HEIC to JPEG for API compatibility
    }
    
    const dataUrl = `data:${mimeType};base64,${base64}`;
    
    // Log file info for debugging
    console.log("📤 Uploading file:", {
      name: file.name,
      type: file.type,
      size: file.size,
      mimeType: mimeType,
      dataUrlLength: dataUrl.length,
    });

    // Moderate image using fal.ai NSFW detection
    console.log("🛡️ Starting image moderation check...");
    const moderationResult = await moderateImageFromDataUrl(dataUrl);
    
    // Only reject if NSFW content is actually detected (not if API fails)
    if (!moderationResult.isSafe && !moderationResult.error) {
      console.warn("❌ Image rejected by moderation:", moderationResult.reason);
      return NextResponse.json(
        {
          error: "Image rejected",
          message: moderationResult.reason || "Image contains inappropriate content",
        },
        { status: 400 }
      );
    }
    
    // If moderation was skipped due to API error, log it but allow image
    if (moderationResult.error) {
      console.warn("⚠️ Moderation check had issues but allowing image:", moderationResult.reason);
    } else {
      console.log("✅ Image moderation check passed:", moderationResult.reason || "Image is safe");
    }

    return NextResponse.json({
      success: true,
      url: dataUrl,
      originalType: file.type,
      originalFilename: file.name,
      sanitizedFilename: sanitizedFilename,
      size: file.size,
      message: "File uploaded successfully",
    });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      {
        error: "Failed to upload file",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

