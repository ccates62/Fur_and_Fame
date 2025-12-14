import { NextResponse } from "next/server";

/**
 * Test endpoint to verify FAL_API_KEY is accessible
 * GET /api/test-fal
 */
export async function GET() {
  const apiKey = process.env.FAL_API_KEY;
  
  return NextResponse.json({
    keyExists: !!apiKey,
    keyLength: apiKey ? apiKey.length : 0,
    keyPreview: apiKey ? `${apiKey.substring(0, 20)}...` : "Not set",
    message: apiKey 
      ? "✅ FAL_API_KEY is configured and accessible!" 
      : "❌ FAL_API_KEY is not set. Check .env.local file.",
  });
}

