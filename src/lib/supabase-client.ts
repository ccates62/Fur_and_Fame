/**
 * Shared Supabase Client
 * Creates a singleton Supabase client to avoid multiple instances
 * Uses a global window object to ensure true singleton across all modules
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Use global window object to ensure singleton across all modules
declare global {
  interface Window {
    __supabaseClient?: ReturnType<typeof createClient>;
  }
}

/**
 * Get or create the shared Supabase client instance
 * Use this instead of creating new clients in each component
 * This ensures only one client instance exists across all components
 */
export function getSupabaseClient() {
  // In browser, use window object for true singleton
  if (typeof window !== "undefined") {
    if (!window.__supabaseClient) {
      window.__supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          storageKey: 'sb-kanhbrdiagogexsyfkkl-auth-token',
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      });
    }
    return window.__supabaseClient;
  }
  
  // For server-side (shouldn't happen in client components, but just in case)
  // Create a module-level singleton
  if (!global.__supabaseClient) {
    global.__supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return global.__supabaseClient;
}
