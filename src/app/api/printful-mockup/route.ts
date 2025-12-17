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

    // All products use Printful API - no client-side fallback

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
      // If API fails, return error - don't use fallback
      console.error(`❌ Failed to generate Printful mockup for ${product_id}`);
      return NextResponse.json({
        success: false,
        error: "Failed to generate mockup",
        message: "Printful mockup generation failed. Please try again. If rate limited, wait 30-60 seconds and refresh. For new stores, limit is 2 requests/minute.",
        product_id: product_id,
      }, { status: 500 });
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
    return NextResponse.json({
      success: false,
      error: "Failed to generate mockup",
      message: error.message || "An error occurred while generating the mockup. Please try again.",
    }, { status: 500 });
  }
}



