/**
 * Printful API client for product mockups and order fulfillment
 */

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const PRINTFUL_API_URL = "https://api.printful.com";

/**
 * Map our product IDs to Printful product/variant IDs
 * These need to be configured in your Printful store
 */
export const PRINTFUL_PRODUCT_MAP: Record<string, { productId: number; variantId: number }> = {
  "canvas-12x12": {
    productId: 1, // Canvas Print 12x12 - UPDATE with your actual Printful product ID
    variantId: 1, // UPDATE with your actual Printful variant ID
  },
  "canvas-16x20": {
    productId: 2, // Canvas Print 16x20 - UPDATE with your actual Printful product ID
    variantId: 2, // UPDATE with your actual Printful variant ID
  },
  "mug": {
    productId: 5, // Mug - UPDATE with your actual Printful product ID
    variantId: 4011, // 11oz mug - UPDATE with your actual Printful variant ID
  },
  "blanket": {
    productId: 99, // Throw Blanket - UPDATE with your actual Printful product ID
    variantId: 1, // UPDATE with your actual Printful variant ID
  },
  "t-shirt": {
    productId: 71, // T-Shirt - UPDATE with your actual Printful product ID
    variantId: 4011, // Gildan 64000 Unisex Softstyle T-Shirt - UPDATE with your actual Printful variant ID
  },
  "poster": {
    productId: 6, // Poster - UPDATE with your actual Printful product ID
    variantId: 1, // UPDATE with your actual Printful variant ID
  },
};

/**
 * Generate a Printful mockup URL for a product with custom image
 * @param productId - Our internal product ID (e.g., "canvas-12x12")
 * @param imageUrl - URL of the portrait image to use in the mockup
 * @param mockupPosition - Position of the image on the product (default: "front")
 * @returns Printful mockup task ID or null if API key is missing
 */
export async function generatePrintfulMockup(
  productId: string,
  imageUrl: string,
  mockupPosition: string = "front"
): Promise<string | null> {
  if (!PRINTFUL_API_KEY) {
    console.warn("⚠️ PRINTFUL_API_KEY not configured - cannot generate mockups");
    return null;
  }

  const productMap = PRINTFUL_PRODUCT_MAP[productId];
  if (!productMap) {
    console.warn(`⚠️ No Printful mapping found for product: ${productId}`);
    return null;
  }

  try {
    // Printful Mockup Generator API endpoint
    const response = await fetch(`${PRINTFUL_API_URL}/mockup-generator/create-task/${productMap.productId}/${productMap.variantId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variant_ids: [productMap.variantId],
        format: "jpg",
        width: 1000,
        files: [
          {
            placement: mockupPosition,
            image_url: imageUrl,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Printful mockup API error:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    // The response contains a task_key that we can use to get the mockup
    return data.result?.task_key || null;
  } catch (error: any) {
    console.error("Error generating Printful mockup:", error);
    return null;
  }
}

/**
 * Get mockup image URL from Printful task key
 * @param taskKey - Task key returned from generatePrintfulMockup
 * @returns Mockup image URL or null
 */
export async function getPrintfulMockupUrl(taskKey: string): Promise<string | null> {
  if (!PRINTFUL_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(`${PRINTFUL_API_URL}/mockup-generator/task?task_key=${taskKey}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    // The response contains mockup URLs
    if (data.result?.mockups && data.result.mockups.length > 0) {
      return data.result.mockups[0].mockup_url || null;
    }
    return null;
  } catch (error: any) {
    console.error("Error getting Printful mockup URL:", error);
    return null;
  }
}

/**
 * Alternative: Use Printful's simpler mockup URL format
 * This is a direct URL format that doesn't require API calls
 * Format: https://files.printful.com/mockups/{product_id}/{variant_id}/{mockup_id}/{image_url_encoded}
 */
export function getPrintfulMockupUrlDirect(
  productId: string,
  imageUrl: string,
  mockupId: number = 1
): string | null {
  const productMap = PRINTFUL_PRODUCT_MAP[productId];
  if (!productMap) {
    return null;
  }

  // Encode the image URL
  const encodedImageUrl = encodeURIComponent(imageUrl);
  
  // Printful's direct mockup URL format
  // Note: This may not work for all products - check Printful docs for your specific products
  return `https://files.printful.com/mockups/${productMap.productId}/${productMap.variantId}/${mockupId}/${encodedImageUrl}`;
}

