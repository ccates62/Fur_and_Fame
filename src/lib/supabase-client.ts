/**
 * Shared Supabase Client
 * Uses modern publishable keys (sb_publishable_...)
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

// Get publishable key - supports both variable names
// This handles both development (.env.local) and production (Vercel env vars)
const publishableKey: string = 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.startsWith("sb_publishable_") 
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
    : "") || "";

// Don't throw at module load - check at runtime instead
if (!supabaseUrl || !publishableKey) {
  if (typeof window !== "undefined") {
    console.error("❌ Supabase Configuration Error:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!publishableKey,
      url: supabaseUrl || "MISSING",
      keyPrefix: publishableKey ? publishableKey.substring(0, 20) + "..." : "MISSING",
      environment: process.env.NODE_ENV,
      currentDomain: window.location.origin
    });
  }
}

// Debug logging (both dev and production for troubleshooting)
if (typeof window !== "undefined") {
  const currentUrl = window.location.origin;
  const envVars = {
    hasPublishableKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    anonKeyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) || "MISSING"
  };
  
  console.log("🔑 Supabase Client Config:", {
    url: supabaseUrl,
    keyType: "publishable",
    keyPrefix: publishableKey.substring(0, 25) + "...",
    keyLength: publishableKey.length,
    currentDomain: currentUrl,
    environment: process.env.NODE_ENV,
    envVars,
    keyDetected: !!publishableKey
  });
  
  // Critical warning if key is missing in production
  if (currentUrl.includes("furandfame.com") && !publishableKey) {
    console.error("🚨 CRITICAL: Publishable key is MISSING in production! Check Vercel environment variables.");
  }
}

// Module-level singleton
let supabaseClientInstance: ReturnType<typeof createClient> | null = null;

/**
 * Get or create the shared Supabase client instance
 */
export function getSupabaseClient() {
  if (!supabaseClientInstance) {
    // Validate configuration before creating client
    if (!supabaseUrl || !publishableKey) {
      throw new Error(
        `Supabase configuration missing. URL: ${supabaseUrl ? "✓" : "✗"}, Key: ${publishableKey ? "✓" : "✗"}. ` +
        `Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set in your environment variables.`
      );
    }
    
    // Create client with publishable key
    // The library should handle apikey automatically, but we ensure it's set
    supabaseClientInstance = createClient(supabaseUrl, publishableKey, {
      global: {
        headers: {
          'apikey': publishableKey
        }
      },
      auth: {
        storageKey: 'sb-kanhbrdiagogexsyfkkl-auth-token',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  }
  return supabaseClientInstance;
}

