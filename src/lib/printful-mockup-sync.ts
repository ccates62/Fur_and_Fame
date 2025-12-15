/**
 * Alternative Printful Mockup Generation using Sync Product System
 * 
 * This approach creates a temporary sync product with the customer's image,
 * which causes Printful to automatically generate preview/mockup URLs.
 * We then extract the preview URL and optionally delete the sync product.
 */

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const PRINTFUL_API_URL = "https://api.printful.com";

interface SyncProductVariant {
  variant_id: number;
  files: Array<{
    type: "default" | "preview" | "back";
    url: string;
  }>;
}

/**
 * Create a temporary sync product to generate Printful mockups
 * This method works by syncing a product with the customer's image,
 * which triggers Printful to generate preview URLs automatically
 */
export async function generateMockupViaSync(
  storeProductId: number,
  catalogVariantId: number,
  imageUrl: string,
  placement?: string
): Promise<string | null> {
  if (!PRINTFUL_API_KEY) {
    console.warn("⚠️ PRINTFUL_API_KEY not configured");
    return null;
  }

  try {
    console.log(`🔄 Creating sync product for mockup generation...`);
    
    // Try to fetch the original product's file structure to replicate its placement settings
    let originalFileStructure: any = null;
    if (placement) {
      try {
        const originalProductResponse = await fetch(`${PRINTFUL_API_URL}/store/products/${storeProductId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
            "Content-Type": "application/json",
          },
        });
        
        if (originalProductResponse.ok) {
          const originalProductData = await originalProductResponse.json();
          const syncVariants = originalProductData.result?.sync_variants || [];
          // Find variant by matching catalog variant ID
          const originalVariant = syncVariants.find((v: any) => {
            // Match by variant_id (catalog variant ID)
            if (v.variant_id === catalogVariantId) return true;
            // Or match by product.variant_id
            if (v.product?.variant_id === catalogVariantId) return true;
            return false;
          });
          
          console.log(`🔍 Looking for variant with catalog variant_id: ${catalogVariantId}`);
          console.log(`📋 Found ${syncVariants.length} variants in original product`);
          if (originalVariant) {
            console.log(`✅ Found matching variant: ${originalVariant.name || originalVariant.id}`);
          } else {
            console.warn(`⚠️ Could not find variant with catalog variant_id ${catalogVariantId}`);
          }
          
          if (originalVariant?.files && originalVariant.files.length > 0) {
            // Find the default file (not preview)
            const originalDefaultFile = originalVariant.files.find((f: any) => f.type === "default");
            if (originalDefaultFile) {
              originalFileStructure = { ...originalDefaultFile };
              console.log(`📋 Found original file structure:`, JSON.stringify(originalFileStructure, null, 2));
            }
          }
        }
      } catch (error) {
        console.warn("⚠️ Could not fetch original product structure:", error);
      }
    }
    
    // Create a sync variant with the customer's image
    // Start with original file structure if available, otherwise create new
    const fileObject: any = originalFileStructure 
      ? { ...originalFileStructure, url: imageUrl } // Copy all fields from original, but replace URL
      : { type: "default", url: imageUrl };
    
    // Remove fields that shouldn't be sent in the API request
    delete fileObject.filename;
    delete fileObject.preview_url;
    delete fileObject.id;
    
    // For mugs, try multiple field names that Printful might accept
    if (placement && !originalFileStructure) {
      // Only add placement fields if we didn't copy from original (original should already have them)
      // Try "area" field first (this is what Printful uses for product templates)
      fileObject.area = placement;
      
      // Also try "placement" as fallback
      fileObject.placement = placement;
      
      // Also try numeric position (0 = front, 1 = back, 2 = left, 3 = right)
      const positionMap: Record<string, number> = {
        "front": 0,
        "back": 1,
        "left": 2,
        "right": 3
      };
      if (positionMap[placement] !== undefined) {
        fileObject.position = positionMap[placement];
      }
      
      console.log(`📍 Setting file area/placement to: ${placement} (area: ${fileObject.area}, position: ${fileObject.position})`);
    } else if (originalFileStructure) {
      console.log(`📍 Using file structure from original product (should preserve placement settings)`);
    }
    
    const syncData = {
      sync_product: {
        name: `Temp Mockup - ${Date.now()}`,
      },
      sync_variants: [
        {
          variant_id: catalogVariantId,
          files: [fileObject],
        },
      ],
    };
    
    console.log(`📋 Sync product file structure:`, JSON.stringify(fileObject, null, 2));
    console.log(`📋 Full sync data being sent:`, JSON.stringify(syncData, null, 2));

    const response = await fetch(`${PRINTFUL_API_URL}/store/products`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(syncData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Failed to create sync product:`, response.status, errorText);
      return null;
    }

    const data = await response.json();
    const syncProductId = data.result?.id;

    if (!syncProductId) {
      console.error(`❌ No sync product created`);
      console.error(`Response:`, JSON.stringify(data, null, 2));
      return null;
    }

    console.log(`✅ Sync product created: ${syncProductId}`);

    // Wait a moment for Printful to process the creation
    console.log(`⏳ Waiting 2 seconds for Printful to process sync product...`);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // OPTION 2: Try to update the sync product after creation to set correct placement
    // This might work if Printful allows updating file placement via API
    if (placement) {
      try {
        console.log(`🔄 Attempting to update sync product ${syncProductId} with placement: ${placement}...`);
        
        // Fetch the sync product to get the variant ID
        const getProductForUpdate = await fetch(`${PRINTFUL_API_URL}/store/products/${syncProductId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
            "Content-Type": "application/json",
          },
        });
        
        if (getProductForUpdate.ok) {
          const productData = await getProductForUpdate.json();
          const syncVariant = productData.result?.sync_variants?.[0];
          
          if (syncVariant) {
            // Try to update the variant's files with correct placement
            const updateFileObject: any = {
              type: "default",
              url: imageUrl,
              area: placement,
              placement: placement,
            };
            
            const positionMap: Record<string, number> = {
              "front": 0,
              "back": 1,
              "left": 2,
              "right": 3
            };
            if (positionMap[placement] !== undefined) {
              updateFileObject.position = positionMap[placement];
            }
            
            // Try PUT request to update the sync product
            console.log(`📤 Sending update request with placement: ${placement}`);
            const updateResponse = await fetch(`${PRINTFUL_API_URL}/store/products/${syncProductId}`, {
              method: "PUT",
              headers: {
                "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                sync_variants: [
                  {
                    id: syncVariant.id,
                    variant_id: catalogVariantId,
                    files: [updateFileObject],
                  },
                ],
              }),
            });
            
            if (updateResponse.ok) {
              const updateData = await updateResponse.json();
              console.log(`✅ Successfully updated sync product with placement: ${placement}`);
              console.log(`📋 Update response:`, JSON.stringify(updateData, null, 2).substring(0, 500));
              
              // Wait longer for Printful to regenerate preview with new placement
              // Printful may need to regenerate the preview after file placement change
              console.log(`⏳ Waiting 5 seconds for Printful to regenerate preview with new placement...`);
              await new Promise((resolve) => setTimeout(resolve, 5000));
              
              // Fetch again to check if preview was regenerated
              const checkResponse = await fetch(`${PRINTFUL_API_URL}/store/products/${syncProductId}`, {
                method: "GET",
                headers: {
                  "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
                  "Content-Type": "application/json",
                },
              });
              
              if (checkResponse.ok) {
                const checkData = await checkResponse.json();
                const checkVariant = checkData.result?.sync_variants?.[0];
                const previewFile = checkVariant?.files?.find((f: any) => f.type === "preview" && f.filename);
                if (previewFile?.filename) {
                  const filename = previewFile.filename.toLowerCase();
                  if (filename.includes(placement)) {
                    console.log(`✅ Preview regenerated with correct placement! Filename: ${previewFile.filename}`);
                  } else {
                    console.warn(`⚠️ Preview still shows wrong placement. Filename: ${previewFile.filename}`);
                    console.warn(`💡 Printful API may not support updating file placement after creation`);
                  }
                }
              }
            } else {
              const errorText = await updateResponse.text();
              console.warn(`⚠️ Could not update sync product placement:`, updateResponse.status, errorText);
              console.warn(`📝 Sync product will use template default placement`);
            }
          }
        }
      } catch (error) {
        console.warn("⚠️ Error attempting to update sync product placement:", error);
      }
    }

    console.log(`📥 Fetching sync product details for ${syncProductId}...`);
    const getProductResponse = await fetch(`${PRINTFUL_API_URL}/store/products/${syncProductId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!getProductResponse.ok) {
      const errorText = await getProductResponse.text();
      console.error(`❌ Failed to fetch sync product details:`, getProductResponse.status, errorText);
      // Try to delete the product
      try {
        await fetch(`${PRINTFUL_API_URL}/store/products/${syncProductId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
          },
        });
        console.log(`🗑️ Deleted orphaned sync product ${syncProductId}`);
      } catch (e) {
        // Ignore delete errors
      }
      return null;
    }

    const productData = await getProductResponse.json();
    console.log(`📦 Product data received. Has sync_variants:`, !!productData.result?.sync_variants);
    console.log(`📦 Number of variants:`, productData.result?.sync_variants?.length || 0);
    const syncVariant = productData.result?.sync_variants?.[0];

    if (!syncVariant) {
      console.error(`❌ No sync variant found in product ${syncProductId}`);
      console.error(`Product data keys:`, Object.keys(productData.result || {}));
      console.error(`Sync variants array:`, productData.result?.sync_variants);
      console.error(`Full response (first 1000 chars):`, JSON.stringify(productData, null, 2).substring(0, 1000));
      // Try to delete the product
      try {
        await fetch(`${PRINTFUL_API_URL}/store/products/${syncProductId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
          },
        });
        console.log(`🗑️ Deleted orphaned sync product ${syncProductId}`);
      } catch (e) {
        // Ignore delete errors
      }
      return null;
    }

    console.log(`✅ Found sync variant: ${syncVariant.id || 'N/A'}`);

    // Wait for Printful to process the image and generate previews
    // Printful generates previews asynchronously, so we poll until it's ready
    console.log(`⏳ Waiting for Printful to generate preview...`);
    let previewFile = null;
    let attempts = 0;
    const maxAttempts = 4; // Try up to 4 times (12 seconds total)
    
    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds between checks
      attempts++;
      
      const getResponse = await fetch(`${PRINTFUL_API_URL}/store/products/${syncProductId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!getResponse.ok) {
        if (attempts < maxAttempts) {
          console.log(`⏳ Fetch failed, retrying... (attempt ${attempts}/${maxAttempts})`);
          continue;
        }
        const errorText = await getResponse.text();
        console.error(`❌ Failed to fetch sync product:`, getResponse.status, errorText);
        return null;
      }

      const productData = await getResponse.json();
      const variant = productData.result?.sync_variants?.[0];
      
      if (!variant) {
        console.error(`❌ No sync variant found in product ${syncProductId}`);
        return null;
      }
      
      // Printful automatically generates a "preview" type file with the product mockup
      previewFile = variant?.files?.find((f: any) => f.type === "preview");
      
      if (previewFile?.preview_url) {
        console.log(`✅ Preview URL available after ${attempts} attempt(s)`);
        break;
      }
      
      if (attempts < maxAttempts) {
        console.log(`⏳ Preview not ready yet, checking again... (attempt ${attempts}/${maxAttempts})`);
      }
    }
    
    if (!previewFile) {
      console.warn(`⚠️ No preview file (product mockup) found in sync product after ${maxAttempts} attempts`);
      // Fetch one more time to see what files are available
      const finalCheck = await fetch(`${PRINTFUL_API_URL}/store/products/${syncProductId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      if (finalCheck.ok) {
        const finalData = await finalCheck.json();
        const finalVariant = finalData.result?.sync_variants?.[0];
        console.warn(`Available files:`, finalVariant?.files?.map((f: any) => ({ type: f.type, filename: f.filename, has_preview_url: !!f.preview_url })));
      }
      return null;
    }

    // Get the mockup URL - Printful provides preview_url in the file object
    let mockupUrl = previewFile.preview_url || previewFile.url;
    
    // If preview_url is not available yet, construct it from hash (Printful CDN format)
    if (!mockupUrl && previewFile.hash) {
      const hash = previewFile.hash;
      const hashPrefix = hash.substring(0, 3);
      mockupUrl = `https://files.cdn.printful.com/files/${hashPrefix}/${hash}_preview.png`;
      console.log(`📝 Constructed mockup URL from hash: ${mockupUrl}`);
    }

    if (mockupUrl) {
      console.log(`✅ Found Printful product mockup URL: ${mockupUrl}`);
      console.log(`📦 Mockup filename: ${previewFile.filename || 'N/A'}`);
      
      // Auto-delete the temporary sync product after successfully getting the mockup
      console.log(`🗑️ Deleting temporary sync product ${syncProductId}...`);
      try {
        await deleteSyncProduct(syncProductId);
      } catch (deleteError) {
        console.warn(`⚠️ Failed to delete sync product ${syncProductId}, but mockup URL retrieved successfully`);
      }
      
      return mockupUrl;
    }

    console.warn(`⚠️ Preview file found but no URL available`);
    console.warn(`Preview file keys:`, Object.keys(previewFile));
    console.warn(`Preview file:`, JSON.stringify(previewFile, null, 2).substring(0, 500));
    return null;
  } catch (error: any) {
    console.error("Error generating mockup via sync:", error);
    return null;
  }
}

/**
 * Delete a sync product (cleanup function)
 */
async function deleteSyncProduct(syncProductId: number): Promise<void> {
  try {
    await fetch(`${PRINTFUL_API_URL}/store/products/${syncProductId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
      },
    });
    console.log(`🗑️ Deleted temporary sync product ${syncProductId}`);
  } catch (error: any) {
    console.error("Error deleting sync product:", error);
  }
}

