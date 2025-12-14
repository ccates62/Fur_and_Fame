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

    // Try direct URL method first (faster, no API call needed)
    const directMockupUrl = getPrintfulMockupUrlDirect(product_id, image_url);
    
    if (directMockupUrl) {
      // Return direct URL (may need to verify this works with your Printful products)
      return NextResponse.json({
        success: true,
        mockup_url: directMockupUrl,
        method: "direct",
      });
    }

    // Fallback to API method (slower but more reliable)
    const taskKey = await generatePrintfulMockup(product_id, image_url);
    
    if (!taskKey) {
      // If API fails, return a placeholder or the original image
      console.warn(`Failed to generate Printful mockup for ${product_id}, returning original image`);
      return NextResponse.json({
        success: true,
        mockup_url: image_url, // Fallback to original image
        method: "fallback",
        warning: "Printful mockup generation failed, showing original image",
      });
    }

    // Poll for mockup URL (Printful tasks are async)
    // In production, you might want to implement proper polling
    // For now, we'll return the task key and let the client poll
    return NextResponse.json({
      success: true,
      task_key: taskKey,
      method: "api",
      message: "Mockup generation started. Poll /api/printful-mockup/status?task_key=... to get the URL",
    });
  } catch (error: any) {
    console.error("Error generating Printful mockup:", error);
    return NextResponse.json(
      { error: "Failed to generate mockup", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * Get mockup status and URL from task key
 * GET /api/printful-mockup/status?task_key=...
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskKey = searchParams.get("task_key");

    if (!taskKey) {
      return NextResponse.json(
        { error: "Missing task_key parameter" },
        { status: 400 }
      );
    }

    const mockupUrl = await getPrintfulMockupUrl(taskKey);
    
    if (!mockupUrl) {
      return NextResponse.json(
        { error: "Mockup not ready yet or task failed" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      mockup_url: mockupUrl,
    });
  } catch (error: any) {
    console.error("Error getting Printful mockup status:", error);
    return NextResponse.json(
      { error: "Failed to get mockup status", message: error.message },
      { status: 500 }
    );
  }
}

