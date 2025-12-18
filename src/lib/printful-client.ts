/**
 * Printful API client for product mockups and order fulfillment
 */

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const PRINTFUL_API_URL = "https://api.printful.com";

/**
 * Map our product IDs to Printful product/variant IDs
 * These need to be configured in your Printful store
 */
export const PRINTFUL_PRODUCT_MAP: Record<string, { productId: number; variantId: number | string }> = {
  "canvas": {
    productId: 407686920, // Your Canvas product ID (same for all sizes)
    variantId: 0, // Will be determined by selected size
  },
  "canvas-12x12": {
    productId: 407686920, // Same product, 12x12 size variant
    variantId: "693f5603130014", // 12x12 variant external_id from Printful (hex string)
  },
  "canvas-16x20": {
    productId: 407686920, // Same product, 16x20 size variant
    variantId: "693f56031300b7", // 16x20 variant external_id from Printful (hex string)
  },
  // Blanket products (Sublimated Sherpa Blanket)
  "blanket-37x57": {
    productId: 408134929, // Sherpa blanket product ID
    variantId: "69421576454962", // 37×57 variant external_id from Printful
  },
  "blanket-50x60": {
    productId: 408134929, // Sherpa blanket product ID
    variantId: "69421576454a03", // 50×60 variant external_id from Printful
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
 * Get existing mockup URLs from store product (if available)
 * This avoids rate limits by using pre-generated mockups
 */
async function getExistingMockupUrl(
  storeProductId: number,
  storeVariantId: number | string,
  imageUrl: string
): Promise<string | null> {
  if (!PRINTFUL_API_KEY) return null;

  try {
    const response = await fetch(`${PRINTFUL_API_URL}/store/products/${storeProductId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    const syncVariants = data.result?.sync_variants || [];
    
    // Convert variant ID to hex string for matching
    const variantIdHex = typeof storeVariantId === 'string' 
      ? storeVariantId.toLowerCase() 
      : storeVariantId.toString(16).toLowerCase();
    
    const variant = syncVariants.find((v: any) => {
      if (v.external_id && v.external_id.toLowerCase() === variantIdHex) return true;
      if (typeof storeVariantId === 'number' && v.id === storeVariantId) return true;
      return false;
    });
    
    // Check if variant has mockup images
    if (variant?.mockup_images && variant.mockup_images.length > 0) {
      // Return the first mockup image URL (this should be the favorite/main mockup)
      const mockupUrl = variant.mockup_images[0]?.url || variant.mockup_images[0];
      if (mockupUrl) {
        console.log(`✅ Found existing mockup for variant ${variantIdHex}`);
        return mockupUrl;
      }
    }
    
    // Also check preview_url in files (this is the generated preview from Printful)
    // The preview file should respect the favorite mockup setting
    const previewFile = variant?.files?.find((f: any) => f.type === "preview" && f.preview_url);
    if (previewFile?.preview_url) {
      console.log(`✅ Found preview URL from existing product (should respect favorite mockup)`);
      return previewFile.preview_url;
    }
    
    return null;
  } catch (error: any) {
    console.error("Error fetching existing mockup:", error);
    return null;
  }
}

/**
 * Get catalog product/variant IDs from store product/variant IDs
 * Store products include catalog IDs in the sync_variants[].product field
 */
export async function getCatalogIds(
  storeProductId: number,
  storeVariantId: number | string
): Promise<{ catalogProductId: number; catalogVariantId: number } | null> {
  if (!PRINTFUL_API_KEY) return null;

  try {
    console.log(`🔍 Fetching catalog IDs for product ${storeProductId}, variant ${storeVariantId}`);
    
    // Fetch store product details - this includes catalog product info
    const response = await fetch(`${PRINTFUL_API_URL}/store/products/${storeProductId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn(`❌ Could not fetch store product ${storeProductId} for catalog IDs`);
      return null;
    }

    const data = await response.json();
    const syncVariants = data.result?.sync_variants || [];
    
    // Convert variant ID to hex string for matching
    // If it's already a string, use it directly; if it's a number, convert to hex
    const variantIdHex = typeof storeVariantId === 'string' 
      ? storeVariantId.toLowerCase() 
      : storeVariantId.toString(16).toLowerCase();
    
    console.log(`🔍 Looking for variant with external_id: ${variantIdHex}`);
    
    const variant = syncVariants.find((v: any) => {
      // Match by external_id (hex string like "693f5603130014")
      if (v.external_id && v.external_id.toLowerCase() === variantIdHex) {
        console.log(`✅ Matched variant: ${v.name} (external_id: ${v.external_id})`);
        return true;
      }
      // Also try matching by numeric id (if variantId is a number)
      if (typeof storeVariantId === 'number' && v.id === storeVariantId) {
        console.log(`✅ Matched variant by id: ${v.id}`);
        return true;
      }
      return false;
    });
    
    if (!variant || !variant.product) {
      console.warn(`❌ Variant ${storeVariantId} (hex: ${variantIdHex}) not found in product ${storeProductId}`);
      console.warn(`📋 Available variants:`, syncVariants.map((v: any) => ({ 
        name: v.name, 
        id: v.id, 
        external_id: v.external_id 
      })));
      return null;
    }

    // Extract catalog IDs from variant.product
    const catalogProductId = variant.product.product_id;
    const catalogVariantId = variant.product.variant_id;

    if (catalogProductId && catalogVariantId) {
      console.log(`✅ Found catalog IDs: product=${catalogProductId}, variant=${catalogVariantId}`);
      return { catalogProductId, catalogVariantId };
    }

    console.warn(`⚠️ Catalog IDs not found in variant.product`);
    return null;
  } catch (error: any) {
    console.error("Error fetching catalog IDs:", error);
    return null;
  }
}

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

  // Note: Canvas uses "position" field instead of "placement"
  // This is handled in the files array construction below

  try {
    console.log(`🖼️ Getting catalog IDs for ${productId}...`);
    // Get catalog IDs from store IDs
    const catalogIds = await getCatalogIds(productMap.productId, productMap.variantId);
    
    if (!catalogIds) {
      console.warn(`⚠️ Could not get catalog IDs for ${productId}, skipping mockup`);
      return null;
    }
    
    // Use sync product method for all products (canvas, blanket, etc.)
    // This method creates a temp sync product and waits for Printful to generate the mockup
    const useSyncMethod = productId.startsWith("canvas") || productId.startsWith("blanket");
    
    if (useSyncMethod) {
      console.log(`🔄 Using sync product method for ${productId}...`);
      const { generateMockupViaSync } = await import("./printful-mockup-sync");
      
      // Use catalog variant ID for sync method
      const variantIdToUse = catalogIds.catalogVariantId;
      
      // Pass undefined placement - sync method will use product defaults
      const syncMockupUrl = await generateMockupViaSync(
        productMap.productId,
        variantIdToUse,
        imageUrl,
        undefined
      );
      if (syncMockupUrl) {
        console.log(`✅ Got mockup via sync method for ${productId}`);
        return `sync:${syncMockupUrl}`;
      }
      console.warn(`⚠️ Sync method failed, falling back to API method`);
    }

    // Build files array - some products need "position" field, others need "placement"
    const isCanvas = productId.startsWith("canvas");
    
    let files: any[];
    if (isCanvas) {
      files = [
        {
          position: "default", // Canvas uses "position" field
          image_url: imageUrl,
        },
      ];
    } else {
      files = [
        {
          placement: mockupPosition, // Other products use "placement" field
          image_url: imageUrl,
        },
      ];
    }

    console.log(`🖼️ Generating Printful mockup for ${productId}:`, {
      storeProductId: productMap.productId,
      storeVariantId: typeof productMap.variantId === 'string' ? productMap.variantId : productMap.variantId.toString(16),
      catalogProductId: catalogIds.catalogProductId,
      catalogVariantId: catalogIds.catalogVariantId,
      files: JSON.stringify(files),
      imageUrl: imageUrl.substring(0, 50) + "...",
    });

    // Use catalog IDs for mockup generation
    // Endpoint format: /mockup-generator/create-task/{product_id} (variant_ids go in body)
    const response = await fetch(
      `${PRINTFUL_API_URL}/mockup-generator/create-task/${catalogIds.catalogProductId}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variant_ids: [catalogIds.catalogVariantId],
          format: "jpg",
          width: 1000,
          // Try using files array - if canvas doesn't work, we'll need alternative approach
          files: files,
          // Note: API also accepts product_template_id as alternative to files array
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: { message: errorText } };
      }
      
      // Handle rate limiting (429) - this is expected for new stores
      if (response.status === 429) {
        const retryAfter = errorData.error?.message?.match(/(\d+)\s+seconds/)?.[1] || "30";
        console.warn(`⏳ Printful rate limit hit for ${productId}. Retry after ${retryAfter} seconds.`);
        console.warn(`📝 Note: New stores are limited to 2 mockup requests/minute. After $10+ in orders, limit increases to 10/minute.`);
        console.warn(`💡 The API endpoint is working correctly - just wait ${retryAfter} seconds and refresh the page.`);
        // Return null so the original image is shown as fallback
        return null;
      }
      
      // Handle 400 errors - log the exact error for debugging
      if (response.status === 400) {
        console.error(`❌ Printful API validation error for ${productId}:`, errorData);
        console.error(`📋 Request files structure:`, JSON.stringify(files, null, 2));
        return null;
      }
      
      console.error(`❌ Printful mockup API error for ${productId}:`, response.status, errorText);
      return null;
    }

    const data = await response.json();
    const taskKey = data.result?.task_key || null;
    
    if (taskKey) {
      console.log(`✅ Printful mockup task created for ${productId}:`, taskKey);
    } else {
      console.warn(`⚠️ No task_key returned for ${productId}:`, data);
    }
    
    return taskKey;
  } catch (error: any) {
    console.error(`❌ Error generating Printful mockup for ${productId}:`, error.message);
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
  // Direct URL method doesn't work reliably with Printful
  // Always use API method instead
  return null;
}

/**
 * Create a Printful order for fulfillment
 * @param orderData - Order data including recipient, items, and image URLs
 * @returns Printful order ID or null if creation fails
 */
export interface PrintfulOrderItem {
  variant_id: number;
  quantity: number;
  files: Array<{
    type: "default" | "preview" | "back";
    url: string;
  }>;
}

export interface PrintfulOrderData {
  recipient: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state_code: string;
    country_code: string;
    zip: string;
    phone?: string;
    email?: string;
  };
  items: PrintfulOrderItem[];
  external_id?: string; // Stripe order ID for tracking
}

/**
 * Get shipping rates from Printful
 * @param recipient Shipping address
 * @param items Array of items with product_id and quantity
 * @returns Array of shipping options with rates
 */
export async function getPrintfulShippingRates(
  recipient: {
    address1: string;
    city: string;
    state_code: string;
    country_code: string;
    zip: string;
    address2?: string;
  },
  items: Array<{ product_id: string; quantity: number }>
): Promise<Array<{
  id: string;
  name: string;
  rate: number;
  currency: string;
  minDeliveryDays: number;
  maxDeliveryDays: number;
}>> {
  if (!PRINTFUL_API_KEY) {
    console.warn("⚠️ PRINTFUL_API_KEY not configured - cannot get shipping rates");
    return [];
  }

  try {
    // Convert product IDs to Printful variant IDs
    const printfulItems = items.map(item => {
      const productMap = PRINTFUL_PRODUCT_MAP[item.product_id];
      if (!productMap) {
        throw new Error(`Product ${item.product_id} not found in Printful product map`);
      }
      return {
        variant_id: productMap.variantId,
        quantity: item.quantity || 1,
      };
    });

    const response = await fetch(`${PRINTFUL_API_URL}/shipping/rates`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient,
        items: printfulItems,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Printful shipping rates API error:", response.status, errorText);
      return [];
    }

    const data = await response.json();
    return data.result || [];
  } catch (error: any) {
    console.error("Error fetching shipping rates:", error);
    return [];
  }
}

export async function createPrintfulOrder(
  orderData: PrintfulOrderData
): Promise<{ orderId: number; printfulOrderId: string } | null> {
  if (!PRINTFUL_API_KEY) {
    console.warn("⚠️ PRINTFUL_API_KEY not configured - cannot create Printful order");
    return null;
  }

  try {
    const response = await fetch(`${PRINTFUL_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: orderData.recipient,
        items: orderData.items,
        external_id: orderData.external_id,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Printful order API error:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    return {
      orderId: data.result?.id || 0,
      printfulOrderId: data.result?.external_id || "",
    };
  } catch (error: any) {
    console.error("Error creating Printful order:", error);
    return null;
  }
}



