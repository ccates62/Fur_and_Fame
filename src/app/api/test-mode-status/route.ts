import { NextResponse } from "next/server";
import { isTestMode } from "@/lib/fal-client";

/**
 * API route to check if test mode is enabled
 * GET /api/test-mode-status
 */
export async function GET() {
  const testMode = isTestMode();
  const falApiKey = !!process.env.FAL_API_KEY;
  const nodeEnv = process.env.NODE_ENV;
  const falTestMode = process.env.FAL_TEST_MODE;

  return NextResponse.json({
    testMode,
    falApiKeyConfigured: falApiKey,
    nodeEnv,
    falTestModeEnv: falTestMode,
    message: testMode 
      ? "✅ Test mode is ACTIVE - using free placeholder images" 
      : "❌ Test mode is INACTIVE - will use real fal.ai API",
    instructions: testMode
      ? "You can test without any API costs. To switch to production, set FAL_TEST_MODE=false"
      : "To enable test mode, set FAL_TEST_MODE=true in your .env.local file and restart the server",
  });
}

