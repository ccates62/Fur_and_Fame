/**
 * Shared Supabase Client for Client Components
 * Prevents multiple GoTrueClient instances warning by reusing a single client
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a singleton client instance for client-side use
let supabaseClient: ReturnType<typeof createClient> | null = null;

/**
 * Get or create the shared Supabase client instance
 * This prevents the "Multiple GoTrueClient instances" warning
 */
export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

