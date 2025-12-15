import { NextRequest, NextResponse } from "next/server";
import { getPrintfulMockupUrl } from "@/lib/printful-client";

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
      // Return 202 (Accepted) instead of 404 to indicate the task is still processing
      return NextResponse.json(
        { 
          success: false,
          status: "processing",
          message: "Mockup not ready yet, please poll again" 
        },
        { status: 202 }
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

