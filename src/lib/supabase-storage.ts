/**
 * Supabase Storage Client
 * Handles uploading pet photos to Supabase storage
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use modern publishable key format (sb_publishable_...)
const publishableKey = 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.startsWith("sb_publishable_") 
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
    : null);
const SUPABASE_ANON_KEY = publishableKey || undefined;

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Upload a pet photo to Supabase storage
 */
export async function uploadPetPhoto(file: File): Promise<UploadResult> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase credentials not configured");
  }

  // Create a unique filename
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 9);
  const fileExt = file.name.split(".").pop();
  const fileName = `pets/${timestamp}-${randomId}.${fileExt}`;

  // Convert file to base64 for upload
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  try {
    // Upload to Supabase storage
    const response = await fetch(
      `${SUPABASE_URL}/storage/v1/object/pet-photos/${fileName}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": file.type,
          "x-upsert": "true", // Overwrite if exists
        },
        body: arrayBuffer,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Supabase upload failed: ${response.status} - ${error}`);
    }

    // Get public URL
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/pet-photos/${fileName}`;

    return {
      url: publicUrl,
      path: fileName,
    };
  } catch (error: any) {
    console.error("Error uploading to Supabase:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
}

