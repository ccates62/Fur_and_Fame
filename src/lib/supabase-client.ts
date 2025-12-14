/**
 * Shared Supabase Client for Client Components
 * Prevents multiple GoTrueClient instances warning by reusing a single client
 */

import { createClient } from "@supabase/supabase-js";

// Create a singleton client instance for client-side use
let supabaseClient: ReturnType<typeof createClient> | null = null;

/**
 * Get or create the shared Supabase client instance
 * This prevents the "Multiple GoTrueClient instances" warning
 * Environment variables are accessed lazily to avoid build-time errors
 */
export function getSupabaseClient() {
  if (!supabaseClient) {
    // Access environment variables lazily (only when function is called, not at module load)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Supabase environment variables are not configured. " +
        "Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables."
      );
    }
    
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

