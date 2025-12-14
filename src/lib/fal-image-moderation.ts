/**
 * fal.ai Image Content Moderation
 * Uses fal.ai's built-in NSFW detection models to moderate uploaded images
 * This is a simpler alternative to Google Cloud Vision API
 */

const FAL_API_KEY = process.env.FAL_API_KEY;

export interface ModerationResult {
  isSafe: boolean;
  confidence?: number;
  reason?: string;
  error?: string;
}

/**
 * Check if image is safe using fal.ai NSFW Checker
 * Model: fal-ai/x-ailab/nsfw
 * Returns binary classification: SFW or NSFW
 */
export async function checkImageSafety(imageUrl: string): Promise<ModerationResult> {
  if (!FAL_API_KEY) {
    console.warn("FAL_API_KEY not configured - skipping image moderation");
    // In development/test mode, allow images (but log warning)
    return {
      isSafe: true,
      reason: "FAL_API_KEY not configured - moderation skipped",
    };
  }

  try {
    // Use fal.ai NSFW Checker API
    const response = await fetch("https://fal.run/fal-ai/x-ailab/nsfw", {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: imageUrl,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("fal.ai NSFW check error:", errorText);
      
      // On API error, reject for safety
      return {
        isSafe: false,
        reason: "Error checking image safety",
        error: errorText,
      };
    }

    const data = await response.json();
    
    // fal.ai NSFW checker returns classification
    // Check the response format - it may be "sfw" or "nsfw" or have a score
    const isNSFW = data.classification === "nsfw" || 
                   data.label === "nsfw" || 
                   (data.score && data.score > 0.5) ||
                   (data.nsfw === true);

    if (isNSFW) {
      return {
        isSafe: false,
        confidence: data.score || data.confidence || 1.0,
        reason: "Image contains explicit or inappropriate content (NSFW)",
      };
    }

    return {
      isSafe: true,
      confidence: data.score || data.confidence || 0.0,
      reason: "Image is safe for work",
    };
  } catch (error: any) {
    console.error("Error checking image safety with fal.ai:", error);
    
    // On error, reject for safety (fail-safe)
    return {
      isSafe: false,
      reason: "Error processing image moderation",
      error: error.message || "Unknown error",
    };
  }
}

/**
 * Check image safety using fal.ai NSFW Filter (probabilistic)
 * Model: fal-ai/imageutils/nsfw
 * Returns probability score (0-1) of image being NSFW
 */
export async function checkImageSafetyProbabilistic(imageUrl: string): Promise<ModerationResult> {
  if (!FAL_API_KEY) {
    console.warn("FAL_API_KEY not configured - skipping image moderation");
    return {
      isSafe: true,
      reason: "FAL_API_KEY not configured - moderation skipped",
    };
  }

  try {
    const response = await fetch("https://fal.run/fal-ai/imageutils/nsfw", {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: imageUrl,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("fal.ai NSFW filter error:", errorText);
      
      return {
        isSafe: false,
        reason: "Error checking image safety",
        error: errorText,
      };
    }

    const data = await response.json();
    
    // NSFW Filter returns probability (0-1)
    // Threshold: > 0.5 = NSFW
    const nsfwProbability = data.probability || data.score || data.nsfw_score || 0;
    const isNSFW = nsfwProbability > 0.5;

    if (isNSFW) {
      return {
        isSafe: false,
        confidence: nsfwProbability,
        reason: `Image likely contains explicit content (${Math.round(nsfwProbability * 100)}% confidence)`,
      };
    }

    return {
      isSafe: true,
      confidence: 1 - nsfwProbability,
      reason: `Image appears safe (${Math.round((1 - nsfwProbability) * 100)}% confidence)`,
    };
  } catch (error: any) {
    console.error("Error checking image safety with fal.ai:", error);
    
    return {
      isSafe: false,
      reason: "Error processing image moderation",
      error: error.message || "Unknown error",
    };
  }
}

/**
 * Moderate image from base64 data URL
 * fal.ai accepts base64 images in the format: data:image/jpeg;base64,<base64_string>
 */
export async function moderateImageFromDataUrl(dataUrl: string): Promise<ModerationResult> {
  if (!FAL_API_KEY) {
    console.warn("FAL_API_KEY not configured - skipping image moderation");
    return {
      isSafe: true,
      reason: "FAL_API_KEY not configured - moderation skipped",
    };
  }

  try {
    console.log("🔍 Calling fal.ai NSFW Checker API...");
    // fal.ai can accept base64 data URLs directly
    const response = await fetch("https://fal.run/fal-ai/x-ailab/nsfw", {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: dataUrl, // fal.ai accepts data URLs
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { detail: errorText };
      }
      
      console.error("fal.ai NSFW check error:", errorText);
      console.error("Response status:", response.status);
      
      // Check if it's a balance issue
      const isBalanceIssue = errorData.detail?.includes("balance") || 
                            errorData.detail?.includes("Exhausted") ||
                            errorData.detail?.includes("locked");
      
      // If it's a 401/403 (auth/balance error), allow image but log warning
      if (response.status === 401 || response.status === 403) {
        if (isBalanceIssue) {
          console.warn("⚠️ fal.ai account balance exhausted - allowing image but moderation skipped");
          console.warn("💡 Tip: Add funds at https://fal.ai/dashboard/billing to enable moderation");
        } else {
          console.warn("⚠️ fal.ai API authentication error - allowing image but moderation skipped");
        }
        return {
          isSafe: true,
          reason: isBalanceIssue 
            ? "Moderation check skipped due to account balance issue" 
            : "Moderation check skipped due to API authentication error",
          error: errorText,
        };
      }
      
      // For other API errors, allow image but log warning
      console.warn("⚠️ fal.ai API error - allowing image but moderation skipped");
      return {
        isSafe: true,
        reason: "Moderation check skipped due to API error",
        error: errorText,
      };
    }

    const data = await response.json();
    console.log("📊 fal.ai NSFW Checker response:", JSON.stringify(data, null, 2));
    
    // fal.ai NSFW checker returns classification
    const isNSFW = data.classification === "nsfw" || 
                   data.label === "nsfw" || 
                   (data.score && data.score > 0.5) ||
                   (data.nsfw === true);

    if (isNSFW) {
      console.warn("⚠️ NSFW content detected:", data);
      return {
        isSafe: false,
        confidence: data.score || data.confidence || 1.0,
        reason: "Image contains explicit or inappropriate content (NSFW)",
      };
    }

    console.log("✅ Image classified as SFW (Safe For Work)");
    return {
      isSafe: true,
      confidence: data.score || data.confidence || 0.0,
      reason: "Image is safe for work",
    };
  } catch (error: any) {
    console.error("Error moderating image with fal.ai:", error);
    
    // On error, allow image but log warning (more user-friendly)
    // This prevents blocking users if there's a temporary API issue
    console.warn("⚠️ Moderation check failed - allowing image to proceed");
    return {
      isSafe: true,
      reason: "Moderation check skipped due to error",
      error: error.message || "Unknown error",
    };
  }
}

