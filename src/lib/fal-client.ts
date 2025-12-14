/**
 * fal.ai Flux Pro API Client
 * Handles AI portrait generation using Flux Pro model
 */

import { containsInappropriateContent, validateUserContent } from "./content-moderation";

const FAL_API_KEY = process.env.FAL_API_KEY;
// fal.ai API endpoint - using queue API for async generation
const FAL_API_URL = "https://queue.fal.run/fal-ai/flux-pro";

// Test/Demo mode - enabled by default unless explicitly disabled
// Active if FAL_TEST_MODE is not "false" AND (it's "true" OR in development OR no API key is set)
const TEST_MODE = 
  process.env.FAL_TEST_MODE !== "false" && 
  (process.env.FAL_TEST_MODE === "true" || 
   process.env.NODE_ENV === "development" || 
   !FAL_API_KEY);

export interface GeneratePortraitParams {
  petName: string;
  breed: string;
  style?: string; // Optional for people portraits
  extraNotes?: string;
  imageUrl: string; // URL of uploaded pet photo
  petType?: "dog" | "cat" | "other"; // Pet type for better prompt generation
  backgroundType?: string; // Background type (solid, translucent, etc.)
  personSex?: string; // For people portraits
  personEthnicity?: string; // For people portraits
  personHairColor?: string; // For people portraits
}

export interface PortraitVariant {
  id: string;
  url: string;
  prompt: string;
}

/**
 * Build prompt for person portraits - focuses on face, not clothing
 */
function buildPersonPrompt(params: GeneratePortraitParams): string {
  const { personSex, personEthnicity, personHairColor, style } = params;
  
  // Build demographic description
  let demographicDesc = "";
  if (personSex && personSex !== "prefer-not-to-say") {
    demographicDesc += personSex === "non-binary" ? "person" : personSex;
  }
  
  if (personEthnicity && personEthnicity !== "prefer-not-to-say") {
    if (demographicDesc) demographicDesc += ", ";
    demographicDesc += personEthnicity;
  }
  
  if (personHairColor && personHairColor !== "n/a" && personHairColor !== "skip") {
    if (demographicDesc) demographicDesc += ", ";
    demographicDesc += personHairColor === "other" ? "hair" : `${personHairColor} hair`;
  }
  
  const personDesc = demographicDesc ? `a ${demographicDesc}` : "a person";
  const stylePart = style ? `as a ${style}, ` : "";
  
  // Focus on face, not clothing
  return `A highly detailed portrait of ${personDesc} ${stylePart}accurate face from reference photo, focus on facial features and expression, ignore clothing and background, perfect skin detail, natural facial structure, cinematic lighting, museum-quality 4K portrait, ultra realistic --ar 3:4 --stylize 250 --v 6`;
}

/**
 * Get negative prompt to avoid clothing focus
 */
function getNegativePrompt(params: GeneratePortraitParams): string {
  // Base negative prompts to prevent inappropriate content
  const baseNegative = "inappropriate content, explicit content, nudity, sexual content, violence, hate speech, offensive gestures, profanity, curse words, crude images, bad gestures, flipping off, middle finger, offensive symbols";
  
  // For people, emphasize ignoring clothing and prevent inappropriate content
  if (params.petType === "other" && params.breed === "person") {
    return `${baseNegative}, clothing, outfit, shirt, dress, jacket, background details, full body, body proportions, ignore clothing style, focus only on face, comically obese, unrealistic proportions`;
  }
  
  // For pets, standard negative prompts plus content moderation
  return `${baseNegative}, blurry, low quality, distorted, deformed, extra limbs, missing features`;
}

/**
 * Generate a portrait using the exact prompt template from the roadmap
 */
function buildPrompt(params: GeneratePortraitParams): string {
  // Handle people portraits separately
  if (params.petType === "other" && params.breed === "person") {
    return buildPersonPrompt(params);
  }
  
  const { petName, breed, style, extraNotes, petType } = params;
  
  // Build breed description based on pet type
  let breedDescription = breed || "adorable pet";
  if (petType === "dog" && !breed) {
    breedDescription = "adorable dog";
  } else if (petType === "cat" && !breed) {
    breedDescription = "adorable cat";
  } else if (petType === "other" && !breed) {
    breedDescription = "adorable pet";
  }
  
  // Adjust detail description based on pet type
  let detailDescription = "perfect fur/feather/scale detail";
  if (petType === "dog" || petType === "cat") {
    detailDescription = "perfect fur detail";
  } else if (petType === "other") {
    detailDescription = "perfect detail";
  }
  
  // Validate pet name and extra notes for inappropriate content
  const nameValidation = validateUserContent(petName, "pet name");
  if (!nameValidation.isValid) {
    throw new Error(nameValidation.error || "Pet name contains inappropriate content");
  }
  
  if (extraNotes && extraNotes.trim()) {
    const notesValidation = validateUserContent(extraNotes, "notes");
    if (!notesValidation.isValid) {
      throw new Error(notesValidation.error || "Notes contain inappropriate content");
    }
  }
  
  const stylePart = style ? `as a ${style}, ` : "";
  const basePrompt = `A highly detailed ${breedDescription} named ${petName} ${stylePart}${detailDescription}, accurate face from reference photo, cinematic lighting, museum-quality 4K portrait, ultra realistic --ar 3:4 --stylize 250 --v 6`;
  
  if (extraNotes && extraNotes.trim()) {
    return `${basePrompt} ${extraNotes.trim()}`;
  }
  
  return basePrompt;
}

/**
 * Generate placeholder images for testing (no API costs)
 */
function generatePlaceholderVariants(
  params: GeneratePortraitParams
): PortraitVariant[] {
  const prompt = buildPrompt(params);
  
  // Get number of variants from env (default: 3, can be 1, 2, or 3)
  const numVariants = Math.min(Math.max(parseInt(process.env.NUM_VARIANTS || "3"), 1), 3);
  
  // Use placeholder image service (picsum.photos) for demo
  // These are free placeholder images that change based on seed
  const baseUrl = "https://picsum.photos/seed";
  
  const variants: PortraitVariant[] = [];
  for (let i = 1; i <= numVariants; i++) {
    const seed = Math.abs(hashCode(`${params.petName}-${params.breed}-${i}`));
    let variantPrompt = prompt;
    if (i === 2) {
      variantPrompt = `${prompt} slightly different angle`;
    } else if (i === 3) {
      variantPrompt = `${prompt} alternative composition`;
    }
    
    variants.push({
      id: `variant-${i}`,
      url: `${baseUrl}/${seed}/800/1000`,
      prompt: variantPrompt,
    });
  }
  
  return variants;
}

/**
 * Simple hash function for consistent seed generation
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

/**
 * Generate portrait variants using fal.ai Flux Pro
 * Number of variants is configurable via NUM_VARIANTS env var (default: 3)
 * Each variant = 1 API call = 1x the cost per image
 */
export async function generatePortraitVariants(
  params: GeneratePortraitParams
): Promise<PortraitVariant[]> {
  // Use test mode if enabled or if API key is missing
  if (TEST_MODE || !FAL_API_KEY) {
    console.log("🧪 TEST MODE: Using placeholder images (no API costs)");
    console.log("💡 To enable production mode, set FAL_TEST_MODE=false and ensure FAL_API_KEY is set");
    console.log("🔍 Debug: FAL_TEST_MODE=", process.env.FAL_TEST_MODE, "NODE_ENV=", process.env.NODE_ENV);
    return generatePlaceholderVariants(params);
  }

  const prompt = buildPrompt(params);
  
  // Get number of variants from env (default: 3, can be 1, 2, or 3)
  const numVariants = Math.min(Math.max(parseInt(process.env.NUM_VARIANTS || "3"), 1), 3);
  
  // Generate variants with slight variations
  const variantPromises = Array.from({ length: numVariants }, (_, i) =>
    generateSingleVariant(prompt, params.imageUrl, i + 1, params)
  );
  
  const variants = await Promise.all(variantPromises);

  return variants;
}

/**
 * Generate a single portrait variant
 */
async function generateSingleVariant(
  prompt: string,
  referenceImageUrl: string,
  variantNumber: number,
  params: GeneratePortraitParams
): Promise<PortraitVariant> {
  if (!FAL_API_KEY) {
    throw new Error("FAL_API_KEY is not configured");
  }

  try {
    // Add slight variation to prompt for diversity
    const variantPrompt = variantNumber === 1 
      ? prompt 
      : `${prompt} ${variantNumber === 2 ? "slightly different angle" : "alternative composition"}`;

    // Get negative prompt if needed
    const negativePrompt = getNegativePrompt(params);
    
    const requestBody: any = {
      prompt: variantPrompt,
      image_url: referenceImageUrl, // Reference image
      num_images: 1,
      aspect_ratio: "3:4",
      output_format: "png",
      guidance_scale: 7.5,
      num_inference_steps: 28,
    };
    
    // Add negative prompt if available (some models support this)
    if (negativePrompt) {
      requestBody.negative_prompt = negativePrompt;
    }

    const response: Response = await fetch(FAL_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `fal.ai API error: ${response.status}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || errorData.message || errorMessage;
        
        // Check for common error cases
        if (response.status === 401 || response.status === 403) {
          errorMessage = "Invalid API key or insufficient permissions. Check your FAL_API_KEY.";
        } else if (response.status === 402 || errorMessage.includes("balance") || errorMessage.includes("credit")) {
          errorMessage = "Insufficient account balance. Please add funds to your fal.ai account.";
        } else if (response.status === 429) {
          errorMessage = "Rate limit exceeded. Please try again in a moment.";
        }
      } catch {
        errorMessage = `${errorMessage} - ${errorText.substring(0, 200)}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // fal.ai returns images in different formats, handle both
    const generatedImageUrl = data.images?.[0]?.url || data.image?.url || data.url;
    
    if (!generatedImageUrl) {
      console.error("fal.ai response data:", JSON.stringify(data, null, 2));
      throw new Error("No image URL returned from fal.ai. This may be due to insufficient account balance or API configuration issues. Check your fal.ai dashboard for account status.");
    }

    return {
      id: `variant-${variantNumber}`,
      url: generatedImageUrl,
      prompt: variantPrompt,
    };
  } catch (error) {
    console.error(`Error generating variant ${variantNumber}:`, error);
    throw error;
  }
}

/**
 * Check if fal.ai API key is configured
 */
export function isFalConfigured(): boolean {
  return !!FAL_API_KEY;
}

/**
 * Check if test mode is enabled
 */
export function isTestMode(): boolean {
  return TEST_MODE;
}

