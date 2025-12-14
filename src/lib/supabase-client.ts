/**
 * Shared Supabase Client
 * Creates a singleton Supabase client to avoid multiple instances
 * Uses a module-level singleton for client-side components
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Module-level singleton (only works in client components)
let supabaseClientInstance: ReturnType<typeof createClient> | null = null;

/**
 * Get or create the shared Supabase client instance
 * Use this instead of creating new clients in each component
 * This ensures only one client instance exists across all components
 */
export function getSupabaseClient() {
  if (!supabaseClientInstance) {
    supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey, {
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
