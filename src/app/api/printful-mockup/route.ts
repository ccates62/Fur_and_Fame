import { NextRequest, NextResponse } from "next/server";
import { generatePrintfulMockup, getPrintfulMockupUrl, getPrintfulMockupUrlDirect, PRINTFUL_PRODUCT_MAP } from "@/lib/printful-client";

/**
 * Generate Printful mockup for a product with custom image
 * POST /api/printful-mockup
 * 
 * Body: { product_id: string, image_url: string }
 * Returns: { mockup_url: string } or { error: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { product_id, image_url } = await request.json();

    if (!product_id || !image_url) {
      return NextResponse.json(
        { error: "Missing required fields", message: "product_id and image_url are required" },
        { status: 400 }
      );
    }

    // Check if product is mapped
    if (!PRINTFUL_PRODUCT_MAP[product_id]) {
      return NextResponse.json(
        { error: "Invalid product", message: `Product ${product_id} is not configured in Printful` },
        { status: 400 }
      );
    }

    // Mugs use client-side mockup generator (no API call needed)
    if (product_id === "mug") {
      return NextResponse.json({
        success: true,
        mockup_url: image_url, // Client-side generator will handle this
        method: "client-side",
        message: "Mug uses client-side mockup generator",
      });
    }

    // Direct URL method doesn't work reliably - skip it and use API method
    // Always use API method for reliable mockup generation
    
    console.log(`🖼️ Requesting Printful mockup for product: ${product_id}`);
    const result = await generatePrintfulMockup(product_id, image_url);
    
    // Check if result is a sync URL (format: "sync:https://...")
    if (result && result.startsWith("sync:")) {
      const mockupUrl = result.substring(5); // Remove "sync:" prefix
      console.log(`✅ Got mockup via sync method for ${product_id}`);
      return NextResponse.json({
        success: true,
        mockup_url: mockupUrl,
        method: "sync",
        message: "Mockup generated via Printful sync product method",
      });
    }
    
    // Check if result is already a direct URL (from existing product mockup)
    if (result && result.startsWith("http")) {
      console.log(`✅ Got direct mockup URL for ${product_id}`);
      return NextResponse.json({
        success: true,
        mockup_url: result,
        method: "existing",
        message: "Using existing product mockup URL",
      });
    }
    
    if (!result) {
      // If API fails (rate limit, placement error, etc.), return the original image as fallback
      console.warn(`⚠️ Failed to generate Printful mockup for ${product_id}, returning original image`);
      return NextResponse.json({
        success: true,
        mockup_url: image_url, // Fallback to original image
        method: "fallback",
        warning: "Printful mockup generation failed. Showing original image. If rate limited, wait 30-60 seconds and refresh. For new stores, limit is 2 requests/minute.",
      });
    }
    
    console.log(`✅ Mockup task created for ${product_id}, task_key: ${result}`);

    // Poll for mockup URL (Printful tasks are async)
    // In production, you might want to implement proper polling
    // For now, we'll return the task key and let the client poll
    return NextResponse.json({
      success: true,
      task_key: result,
      method: "api",
      message: "Mockup generation started. Poll /api/printful-mockup/status?task_key=... to get the URL",
    });
  } catch (error: any) {
    console.error("Error generating Printful mockup:", error);
    try {
      const { product_id, image_url } = await request.json();
      console.error("Product ID:", product_id);
      console.error("Image URL:", image_url);
      // Return fallback instead of 500 error
      return NextResponse.json({
        success: true,
        mockup_url: image_url || "", // Fallback to original image
        method: "fallback",
        warning: "Printful mockup generation failed, showing original image",
        error: error.message,
      });
    } catch (parseError) {
      // If we can't parse the request, return a generic error
      return NextResponse.json({
        success: false,
        error: "Failed to process request",
        message: error.message,
      }, { status: 500 });
    }
  }
}



