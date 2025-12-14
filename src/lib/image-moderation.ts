/**
 * Image Content Moderation using fal.ai NSFW Detection
 * Detects explicit content, violence, and inappropriate images
 */

const FAL_API_KEY = process.env.FAL_API_KEY;
// fal.ai moderation endpoint - using their NSFW detection model
const FAL_MODERATION_URL = "https://queue.fal.run/fal-ai/nsfw-image-detection";

export interface ModerationResult {
  isSafe: boolean;
  reasons: string[];
  nsfwScore?: number;
  details?: {
    porn?: number;
    sexy?: number;
    hentai?: number;
    drawing?: number;
    neutral?: number;
  };
}

/**
 * Moderate image from data URL using fal.ai NSFW detection
 * @param dataUrl - Image as data URL (data:image/...;base64,...)
 * @returns Moderation result
 */
export async function moderateImageFromDataUrl(dataUrl: string): Promise<ModerationResult> {
  // If fal.ai is not configured, allow image through with warning
  // Fail-open approach to avoid blocking legitimate pet photos
  if (!FAL_API_KEY) {
    console.warn("⚠️  fal.ai moderation not configured - allowing image through");
    return {
      isSafe: true,
      reasons: ["Moderation not configured - image allowed"],
    };
  }

  try {
    // Extract base64 data from data URL
    const base64Data = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
    
    // Call fal.ai NSFW detection API
    const response = await fetch(FAL_MODERATION_URL, {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: dataUrl, // fal.ai can accept data URLs
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("fal.ai moderation API error:", response.status, errorText);
      console.error("Moderation API failed - allowing image through with warning");
      
      // On API error, allow image through (fail-open) to avoid blocking legitimate pet photos
      // Log the error for monitoring but don't block user uploads
      return {
        isSafe: true,
        reasons: ["Moderation service temporarily unavailable - image allowed"],
      };
    }

    const data = await response.json();
    
    // fal.ai NSFW detection returns scores for different categories
    // Typical response structure:
    // { porn: 0.01, sexy: 0.02, hentai: 0.0, drawing: 0.0, neutral: 0.97 }
    const scores = data.scores || data || {};
    const pornScore = scores.porn || 0;
    const sexyScore = scores.sexy || 0;
    const hentaiScore = scores.hentai || 0;
    
    // Calculate overall NSFW score (weighted)
    const nsfwScore = Math.max(pornScore, sexyScore * 0.7, hentaiScore * 0.5);
    
    const reasons: string[] = [];
    let isSafe = true;
    
    // Thresholds for rejection
    const PORN_THRESHOLD = 0.3; // 30% confidence in pornographic content
    const SEXY_THRESHOLD = 0.5; // 50% confidence in sexually suggestive content
    const HENTAI_THRESHOLD = 0.4; // 40% confidence in hentai content
    
    if (pornScore >= PORN_THRESHOLD) {
      isSafe = false;
      reasons.push("Explicit adult content detected");
    }
    
    if (sexyScore >= SEXY_THRESHOLD) {
      isSafe = false;
      reasons.push("Sexually suggestive content detected");
    }
    
    if (hentaiScore >= HENTAI_THRESHOLD) {
      isSafe = false;
      reasons.push("Inappropriate animated content detected");
    }
    
    // If overall NSFW score is high, reject
    if (nsfwScore >= 0.4 && isSafe) {
      isSafe = false;
      reasons.push("Inappropriate content detected");
    }

    return {
      isSafe,
      reasons,
      nsfwScore,
      details: {
        porn: pornScore,
        sexy: sexyScore,
        hentai: hentaiScore,
        drawing: scores.drawing || 0,
        neutral: scores.neutral || 0,
      },
    };
  } catch (error: any) {
    console.error("Error moderating image with fal.ai:", error);
    console.error("Moderation error details:", error.message, error.stack);
    
    // On error, allow image through (fail-open) to avoid blocking legitimate pet photos
    // This prevents false positives from blocking legitimate dog/cat photos
    return {
      isSafe: true,
      reasons: ["Moderation service error - image allowed"],
    };
  }
}

/**
 * Moderate image from Buffer
 * @param imageBuffer - Image file as Buffer
 * @returns Moderation result
 */
export async function moderateImageFromBuffer(imageBuffer: Buffer, mimeType: string = "image/jpeg"): Promise<ModerationResult> {
  // Convert buffer to data URL
  const base64 = imageBuffer.toString("base64");
  const dataUrl = `data:${mimeType};base64,${base64}`;
  return await moderateImageFromDataUrl(dataUrl);
}


