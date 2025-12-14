import { NextResponse } from "next/server";

/**
 * Diagnostic endpoint to check if Supabase environment variables are loaded
 * GET /api/check-supabase-env
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  
  const isPublishableInAnon = anonKey.startsWith("sb_publishable_");
  const detectedKey = publishableKey || (isPublishableInAnon ? anonKey : "");
  
  return NextResponse.json({
    success: true,
    environment: process.env.NODE_ENV,
    hasUrl: !!supabaseUrl,
    hasPublishableKey: !!publishableKey,
    hasAnonKey: !!anonKey,
    isPublishableInAnon: isPublishableInAnon,
    detectedKey: detectedKey ? detectedKey.substring(0, 25) + "..." : "MISSING",
    keyLength: detectedKey.length,
    url: supabaseUrl || "MISSING",
    message: detectedKey 
      ? "✅ Environment variables are loaded correctly"
      : "❌ CRITICAL: Publishable key is missing! Add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to Vercel environment variables."
  });
}
