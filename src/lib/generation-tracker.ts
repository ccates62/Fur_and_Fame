/**
 * Generation Session Tracker
 * Tracks user generations by IP address and browser fingerprint to prevent abuse
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Use modern secret key format (sb_secret_...)
const secretKey = 
  process.env.SUPABASE_SECRET_KEY || 
  (process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith("sb_secret_") 
    ? process.env.SUPABASE_SERVICE_ROLE_KEY 
    : null);

if (!secretKey) {
  throw new Error("Supabase secret key is missing. Please add SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY (with sb_secret_ prefix) to .env.local");
}

const supabase = createClient(supabaseUrl, secretKey);

export interface GenerationSession {
  id: string;
  ip_address: string;
  fingerprint?: string;
  pet_name?: string;
  breed?: string;
  pet_type?: string;
  photo_url?: string;
  selected_styles: string[];
  generated_styles: string[];
  free_generations_used: number;
  paid_generations_count: number;
  purchase_made: boolean;
  purchase_bonus_generations: number;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
  // Try various headers (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfIP) {
    return cfIP;
  }
  
  return 'unknown';
}

/**
 * Create or get existing generation session
 */
export async function getOrCreateSession(
  ipAddress: string,
  fingerprint?: string
): Promise<GenerationSession | null> {
  try {
    // First, try to find existing active session
    const now = new Date().toISOString();
    
    let query = supabase
      .from('generation_sessions')
      .select('*')
      .gt('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(1);

    // Try to find by fingerprint first (more reliable)
    if (fingerprint) {
      const { data: byFingerprint } = await query.eq('fingerprint', fingerprint).single();
      if (byFingerprint) {
        return byFingerprint as GenerationSession;
      }
    }

    // Then try by IP
    const { data: byIP } = await query.eq('ip_address', ipAddress).single();
    if (byIP) {
      return byIP as GenerationSession;
    }

    // Create new session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
    
    const { data: newSession, error: createError } = await supabase
      .from('generation_sessions')
      .insert({
        ip_address: ipAddress,
        fingerprint: fingerprint || null,
        selected_styles: [],
        generated_styles: [],
        free_generations_used: 0,
        paid_generations_count: 0,
        purchase_made: false,
        purchase_bonus_generations: 0,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (createError || !newSession) {
      console.error('Error creating session:', createError);
      return null;
    }

    return newSession as GenerationSession;
  } catch (error) {
    console.error('Error in getOrCreateSession:', error);
    return null;
  }
}

/**
 * Get session by ID
 */
export async function getSessionById(sessionId: string): Promise<GenerationSession | null> {
  try {
    const { data, error } = await supabase
      .from('generation_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error || !data) {
      console.error('Error getting session:', error);
      return null;
    }

    return data as GenerationSession;
  } catch (error) {
    console.error('Error in getSessionById:', error);
    return null;
  }
}

/**
 * Update session with selected styles and generation info
 */
export async function updateSession(
  sessionId: string,
  updates: Partial<GenerationSession>
): Promise<GenerationSession | null> {
  try {
    const { data, error } = await supabase
      .from('generation_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error || !data) {
      console.error('Error updating session:', error);
      return null;
    }

    return data as GenerationSession;
  } catch (error) {
    console.error('Error in updateSession:', error);
    return null;
  }
}

/**
 * Check if user can generate more free styles
 */
export function canGenerateFree(session: GenerationSession): boolean {
  const maxFree = 3;
  const totalFree = session.free_generations_used;
  const bonusFree = session.purchase_bonus_generations;
  return (totalFree < maxFree) || (bonusFree > 0);
}

/**
 * Get remaining free generations
 */
export function getRemainingFree(session: GenerationSession): number {
  const maxFree = 3;
  const used = session.free_generations_used;
  const bonus = session.purchase_bonus_generations;
  
  if (used < maxFree) {
    return maxFree - used;
  }
  return bonus;
}

/**
 * Mark purchase as made and grant bonus generations
 */
export async function markPurchaseMade(
  sessionId: string,
  bonusGenerations: number = 3
): Promise<GenerationSession | null> {
  return updateSession(sessionId, {
    purchase_made: true,
    purchase_bonus_generations: bonusGenerations,
  });
}









