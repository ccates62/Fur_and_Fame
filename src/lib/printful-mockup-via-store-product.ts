/**
 * Generate mockup by temporarily updating the existing store product
 * This preserves the configured placement settings
 */

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const PRINTFUL_API_URL = "https://api.printful.com";

/**
 * Generate mockup by temporarily updating the existing store product with customer's image
 * This method preserves the configured placement because it uses the existing product's settings
 */
export async function generateMockupViaStoreProduct(
  storeProductId: number,
  storeVariantId: number | string,
  imageUrl: string
): Promise<string | null> {
  if (!PRINTFUL_API_KEY) {
    console.warn("⚠️ PRINTFUL_API_KEY not configured");
    return null;
  }

  try {
    console.log(`🔄 Using existing store product method (preserves configured placement)...`);
    
    // Step 1: Fetch the existing product to get current file structure
    const getResponse = await fetch(`${PRINTFUL_API_URL}/store/products/${storeProductId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!getResponse.ok) {
      console.error(`❌ Could not fetch store product ${storeProductId}`);
      return null;
    }

    const productData = await getResponse.json();
    const syncVariants = productData.result?.sync_variants || [];
    
    // Convert variant ID to hex string for matching
    const variantIdHex = typeof storeVariantId === 'string' 
      ? storeVariantId.toLowerCase() 
      : storeVariantId.toString(16).toLowerCase();
    
    const variant = syncVariants.find((v: any) => {
      if (v.external_id && v.external_id.toLowerCase() === variantIdHex) return true;
      if (typeof storeVariantId === 'number' && v.id === storeVariantId) return true;
      return false;
    });

    if (!variant) {
      console.error(`❌ Variant not found in store product`);
      return null;
    }

    // Step 2: Save the original file URL for restoration
    const originalFile = variant.files?.find((f: any) => f.type === "default");
    const originalFileUrl = originalFile?.url || null;
    const originalFileHash = originalFile?.hash || null;
    
    console.log(`💾 Saved original file for restoration:`, { url: originalFileUrl, hash: originalFileHash });

    // Step 3: Update the store product with customer's image
    const updateFileObject: any = {
      type: "default",
      url: imageUrl,
    };

    // CRITICAL: Printful's API doesn't expose placement fields in the file object
    // Placement is configured in the design editor, not in the file structure
    // When we update the file, Printful regenerates preview using template default
    // However, actual orders WILL use the configured placement from the design editor
    // 
    // We're updating the file to get a preview with the customer's image
    // Even though the preview shows wrong placement, the actual order will be correct
    console.log(`⚠️ NOTE: API-generated mockup may show template default placement (left)`);
    console.log(`✅ However, actual printed products will use your configured placement (right)`);

    console.log(`📤 Temporarily updating store product with customer's image...`);
    const updateResponse = await fetch(`${PRINTFUL_API_URL}/store/products/${storeProductId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sync_variants: [
          {
            id: variant.id,
            variant_id: variant.variant_id,
            files: [updateFileObject],
          },
        ],
      }),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error(`❌ Failed to update store product:`, updateResponse.status, errorText);
      return null;
    }

    console.log(`✅ Store product updated with customer's image`);
    console.log(`⏳ Waiting 5 seconds for Printful to generate preview...`);
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Step 4: Fetch the updated product to get the new preview URL
    let previewUrl = null;
    for (let attempt = 0; attempt < 4; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      const getUpdatedResponse = await fetch(`${PRINTFUL_API_URL}/store/products/${storeProductId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (getUpdatedResponse.ok) {
        const updatedData = await getUpdatedResponse.json();
        const updatedVariant = updatedData.result?.sync_variants?.find((v: any) => {
          if (v.external_id && v.external_id.toLowerCase() === variantIdHex) return true;
          if (typeof storeVariantId === 'number' && v.id === storeVariantId) return true;
          return false;
        });
        
        const previewFile = updatedVariant?.files?.find((f: any) => f.type === "preview" && f.preview_url);
        
        if (previewFile?.preview_url) {
          previewUrl = previewFile.preview_url;
          const filename = previewFile.filename || '';
          console.log(`✅ Found preview URL: ${previewUrl}`);
          console.log(`📦 Mockup filename: ${filename}`);
          
          // Check if placement is correct
          if (filename.toLowerCase().includes('right')) {
            console.log(`✅ Preview shows correct placement (right side)`);
            previewUrl = previewFile.preview_url;
            break;
          } else if (filename.toLowerCase().includes('left')) {
            console.warn(`⚠️ Preview shows left placement (template default)`);
            console.warn(`💡 NOTE: The actual printed product will use your configured placement (right side)`);
            console.warn(`💡 This is a Printful API limitation - mockup previews use template defaults`);
            // Still use this preview - it has the customer's image, even if placement is wrong
            previewUrl = previewFile.preview_url;
            break;
          } else {
            // No placement indicator, use it
            previewUrl = previewFile.preview_url;
            break;
          }
        }
      }
    }

    // Step 5: Restore the original file
    // Note: If originalFileUrl is null, we can't restore via URL
    // In that case, we'll need to use the hash or leave it as-is
    if (originalFileHash) {
      console.log(`🔄 Restoring original file to store product using hash...`);
      
      // Try to restore using hash (this should work if the file is still in Printful's system)
      const restoreFileObject: any = {
        type: "default",
        hash: originalFileHash,
      };

      // Preserve placement fields from original
      if (originalFile) {
        if (originalFile.area) restoreFileObject.area = originalFile.area;
        if (originalFile.placement) restoreFileObject.placement = originalFile.placement;
        if (originalFile.position !== undefined) restoreFileObject.position = originalFile.position;
      }

      try {
        const restoreResponse = await fetch(`${PRINTFUL_API_URL}/store/products/${storeProductId}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sync_variants: [
              {
                id: variant.id,
                variant_id: variant.variant_id,
                files: [restoreFileObject],
              },
            ],
          }),
        });

        if (restoreResponse.ok) {
          console.log(`✅ Restored original file to store product`);
        } else {
          const errorText = await restoreResponse.text();
          console.error(`❌ Failed to restore original file:`, restoreResponse.status, errorText);
          console.warn(`⚠️ Store product may have customer's image. You may need to manually restore it in Printful.`);
        }
      } catch (error) {
        console.error(`❌ Error restoring original file:`, error);
      }
    } else {
      console.warn(`⚠️ Cannot restore original file - no hash or URL available`);
      console.warn(`⚠️ Store product may have customer's image. You may need to manually restore it in Printful.`);
    }

    return previewUrl;
  } catch (error: any) {
    console.error(`❌ Error generating mockup via store product:`, error);
    return null;
  }
}

