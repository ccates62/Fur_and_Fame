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

  // Note: Canvas and mugs both use "position" field instead of "placement"
  // This is handled in the files array construction below

  try {
    console.log(`🖼️ Getting catalog IDs for ${productId}...`);
    // Get catalog IDs from store IDs
    const catalogIds = await getCatalogIds(productMap.productId, productMap.variantId);
    
    if (!catalogIds) {
      console.warn(`⚠️ Could not get catalog IDs for ${productId}, skipping mockup`);
      return null;
    }
    
    // For mugs, try to use the existing product's preview URL structure
    // Even though it's for the placeholder, it shows us the correct placement/angle
    // We'll use it as a reference to ensure our sync product matches
    
    // For mugs, we need to generate a mockup with the customer's image
    // while preserving the placement from the original product configuration
    
    // For mugs, use the existing store product method to preserve configured placement
    // This temporarily updates your store product with the customer's image, generates mockup, then restores it
    if (productId === "mug") {
      console.log(`🍵 Using store product method for mug (preserves your configured placement)...`);
      const { generateMockupViaStoreProduct } = await import("./printful-mockup-via-store-product");
      const storeMockupUrl = await generateMockupViaStoreProduct(
        productMap.productId,
        productMap.variantId,
        imageUrl
      );
      if (storeMockupUrl) {
        console.log(`✅ Got mockup via store product method for ${productId}`);
        return `sync:${storeMockupUrl}`;
      }
      console.warn(`⚠️ Store product method failed, falling back to sync method`);
    }
    
    // Use sync product method for canvas (or if store product method failed for mug)
    const useSyncMethod = productId.startsWith("canvas") || productId === "mug";
    
    if (useSyncMethod) {
      console.log(`🔄 Using sync product method for ${productId}...`);
      const { generateMockupViaSync } = await import("./printful-mockup-sync");
      
      // For mugs, try to detect placement from original product filename
      let detectedPlacement: string | undefined = undefined;
      if (productId === "mug") {
        try {
          const productResponse = await fetch(`${PRINTFUL_API_URL}/store/products/${productMap.productId}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
              "Content-Type": "application/json",
            },
          });
          
          if (productResponse.ok) {
            const productData = await productResponse.json();
            const syncVariants = productData.result?.sync_variants || [];
            const variantIdHex = typeof productMap.variantId === 'string' 
              ? productMap.variantId.toLowerCase() 
              : productMap.variantId.toString(16).toLowerCase();
            
            const variant = syncVariants.find((v: any) => {
              if (v.external_id && v.external_id.toLowerCase() === variantIdHex) return true;
              if (typeof productMap.variantId === 'number' && v.id === productMap.variantId) return true;
              return false;
            });
            
            const previewFile = variant?.files?.find((f: any) => f.type === "preview" && f.filename);
            if (previewFile?.filename) {
              const filename = previewFile.filename.toLowerCase();
              if (filename.includes("right")) detectedPlacement = "right";
              else if (filename.includes("left")) detectedPlacement = "left";
              else if (filename.includes("back")) detectedPlacement = "back";
              else if (filename.includes("front")) detectedPlacement = "front";
              
              if (detectedPlacement) {
                console.log(`📍 Detected placement "${detectedPlacement}" from original product - will try to preserve in sync product`);
              }
            }
          }
        } catch (error) {
          console.warn("⚠️ Could not detect placement from original product");
        }
      }
      
      // CRITICAL: Try using store variant ID instead of catalog variant ID
      // Store variant IDs reference the configured product, which should preserve placement
      // Catalog variant IDs use template defaults
      let variantIdToUse = catalogIds.catalogVariantId;
      
      // For mugs, try to get the store variant ID from the original product
      if (productId === "mug") {
        try {
          const productResponse = await fetch(`${PRINTFUL_API_URL}/store/products/${productMap.productId}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
              "Content-Type": "application/json",
            },
          });
          
          if (productResponse.ok) {
            const productData = await productResponse.json();
            const syncVariants = productData.result?.sync_variants || [];
            const variantIdHex = typeof productMap.variantId === 'string' 
              ? productMap.variantId.toLowerCase() 
              : productMap.variantId.toString(16).toLowerCase();
            
            const variant = syncVariants.find((v: any) => {
              if (v.external_id && v.external_id.toLowerCase() === variantIdHex) return true;
              if (typeof productMap.variantId === 'number' && v.id === productMap.variantId) return true;
              return false;
            });
            
            // Try using the store variant's variant_id (this references the configured product)
            if (variant?.variant_id) {
              console.log(`🔄 Using store variant_id ${variant.variant_id} instead of catalog variant_id ${catalogIds.catalogVariantId}`);
              console.log(`💡 This should reference your configured product with correct placement`);
              variantIdToUse = variant.variant_id;
            }
          }
        } catch (error) {
          console.warn("⚠️ Could not get store variant ID, using catalog variant ID");
        }
      }
      
      // Pass detected placement so sync method can try to replicate original product structure
      const syncMockupUrl = await generateMockupViaSync(
        productMap.productId,
        variantIdToUse, // Use store variant ID if available, otherwise catalog variant ID
        imageUrl,
        detectedPlacement
      );
      if (syncMockupUrl) {
        console.log(`✅ Got mockup via sync method for ${productId}`);
        return `sync:${syncMockupUrl}`;
      }
      console.warn(`⚠️ Sync method failed, falling back to API method`);
    }

    // Build files array - some products need "position" field, others need "placement"
    const isCanvas = productId.startsWith("canvas");
    const isMug = productId === "mug";
    
    // For mugs, try multiple field names that Printful might accept
    // The mockup generator API might accept "area", "placement", or "position"
    let files: any[];
    if (isMug) {
      // Try all possible field names for mug placement
      files = [
        {
          area: "front", // Primary: "area" field (used in product templates)
          placement: "front", // Fallback: "placement" field
          position: 0, // Fallback: numeric position (0 = front)
          image_url: imageUrl,
        },
      ];
      console.log(`🍵 Using mug-specific file structure with area/placement/position fields`);
    } else if (isCanvas) {
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



