import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Test Supabase Authentication with Publishable Key
 * GET /api/test-supabase-auth?email=test@example.com&password=testpass
 * 
 * This endpoint tests if the publishable key can authenticate with actual credentials
 */
export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    // Use modern publishable key format
    const publishableKey = 
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.startsWith("sb_publishable_") 
        ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
        : null);
    
    const keyToUse = publishableKey || "";
    
    const supabase = createClient(supabaseUrl, keyToUse);

    // Get test credentials from query params (if provided)
    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get("email");
    const testPassword = searchParams.get("password");

    let authTest = null;
    if (testEmail && testPassword) {
      // Try actual sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      authTest = {
        success: !error,
        error: error?.message || null,
        status: error?.status || null,
        hasUser: !!data?.user
      };
    }

    // Test if key can make API calls
    const { data: healthCheck, error: healthError } = await supabase
      .from('_test')
      .select('*')
      .limit(1);

    return NextResponse.json({
      success: true,
      keyType: keyToUse?.startsWith("sb_publishable_") ? "publishable" : "anon",
      keyPrefix: keyToUse?.substring(0, 20) + "...",
      url: supabaseUrl,
      authTest: authTest || "No credentials provided. Add ?email=...&password=... to test sign in",
      healthCheck: healthError ? `API Error: ${healthError.message}` : "Key can make API calls",
      message: authTest?.error 
        ? `Authentication failed: ${authTest.error}. This confirms the 401 error.`
        : "Key format is correct. Provide email and password to test authentication."
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      message: "Failed to test Supabase authentication"
    }, { status: 500 });
  }
}
