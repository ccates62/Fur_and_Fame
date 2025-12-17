"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProductDetailModal from "@/components/ProductDetailModal";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  popular?: boolean;
  sizes?: { size: string; price: number; variantKey: string }[]; // Add sizes for canvas
}

// Only show products that are configured in Printful
// Products without valid Printful product IDs will be hidden
const products: Product[] = [
  {
    id: "canvas",
    name: "Canvas Print",
    description: "Premium quality canvas print, perfect for displaying your pet's portrait",
    price: 59, // Default price (12x12)
    icon: "🖼️",
    popular: true,
    sizes: [
      { size: "12x12", price: 59, variantKey: "canvas-12x12" },
      { size: "16x20", price: 89, variantKey: "canvas-16x20" },
    ],
  },
  {
    id: "blanket",
    name: "Sublimated Sherpa Blanket",
    description: "Plush sherpa blanket with your pet's portrait, perfect for snuggling",
    price: 70, // Default price (50×60)
    icon: "🛏️",
    sizes: [
      { size: "37×57", price: 55, variantKey: "blanket-37x57" },
      { size: "50×60", price: 70, variantKey: "blanket-50x60" },
    ],
  },
  // NOTE: Other products (t-shirt, poster) are commented out
  // because they don't exist in your Printful store yet.
  /*
  {
    id: "t-shirt",
    name: "T-Shirt",
    description: "Soft cotton t-shirt featuring your pet's portrait",
    price: 29,
    icon: "👕",
  },
  {
    id: "poster",
    name: "Poster Print",
    description: "High-quality poster print, great for wall decoration",
    price: 24,
    icon: "📄",
  },
  */
];

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [productVariantsMap, setProductVariantsMap] = useState<Record<string, Record<string, any[]>> | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null); // Add size selection for canvas
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mockupUrls, setMockupUrls] = useState<Record<string, string>>({});
  const [loadingMockups, setLoadingMockups] = useState<Record<string, boolean>>({});
  const fetchingRef = useRef<Set<string>>(new Set()); // Track ongoing fetches to prevent duplicates
  
  // Product detail modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  
  const [shippingAddress, setShippingAddress] = useState({
    address1: "",
    city: "",
    state_code: "",
    country_code: "US",
    zip: "",
  });
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [loadingShipping, setLoadingShipping] = useState(false);

  useEffect(() => {
    // Load selected variant from sessionStorage
    if (typeof window !== "undefined") {
      const storedVariant = sessionStorage.getItem("selectedVariant");
      if (storedVariant) {
        try {
          const parsed = JSON.parse(storedVariant);
          setSelectedVariant(parsed.variant || parsed);
          
          // Load product variants map if available (for product-specific aspect ratios)
          const storedProductMap = sessionStorage.getItem("productVariantsMap");
          if (storedProductMap) {
            try {
              const productMap = JSON.parse(storedProductMap);
              setProductVariantsMap(productMap);
            } catch (e) {
              console.error("Error parsing product variants map:", e);
            }
          }
          
          // Don't auto-select any product - let user choose
        } catch (e) {
          console.error("Error parsing selected variant:", e);
          router.push("/variants");
        }
      } else {
        // No variant selected, redirect back
        router.push("/variants");
      }
    }
  }, [router]);

  // Fetch Printful mockups automatically for ALL products when variant is available
  // This will load mockups for all products/sizes on page load, not just the selected one
  useEffect(() => {
    if (!selectedVariant?.url) {
      console.log("⏸️ Mockup fetch skipped: No variant URL available");
      return;
    }
    
    console.log("🖼️ Starting Printful mockup fetch for all products...", {
      variantUrl: selectedVariant.url?.substring(0, 50) + "..."
    });

    // Fetch mockups for all products in parallel
    const fetchAllMockups = async () => {
      // Collect all mockup fetch promises
      const mockupPromises: Promise<void>[] = [];

      for (const product of products) {
        if (product.sizes && product.sizes.length > 0) {
          // Fetch mockup for each size
          for (const sizeOption of product.sizes) {
            const productIdForMockup = sizeOption.variantKey;
            
            // Skip if we already have this mockup or are currently loading it
            if (fetchingRef.current.has(productIdForMockup) || mockupUrls[productIdForMockup]) {
              console.log(`⏸️ Skipping mockup fetch for ${productIdForMockup}: already have mockup or currently loading`);
              continue;
            }

            fetchingRef.current.add(productIdForMockup); // Mark as fetching
            setLoadingMockups((prev) => ({ ...prev, [productIdForMockup]: true }));

            console.log(`📤 Fetching Printful mockup for ${productIdForMockup}...`);

            // Create promise for this mockup fetch
            const mockupPromise = (async () => {
              try {
                const response = await fetch("/api/printful-mockup", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    product_id: productIdForMockup,
                    image_url: selectedVariant.url,
                  }),
                });

                if (response.ok) {
                  const data = await response.json();
                  if (data.mockup_url) {
                    // Success - use Printful mockup
                    console.log(`✅ Printful mockup ready for ${productIdForMockup}`);
                    console.log(`📸 Mockup URL: ${data.mockup_url.substring(0, 80)}...`);
                    setMockupUrls((prev) => {
                      const updated = { ...prev, [productIdForMockup]: data.mockup_url };
                      console.log(`💾 Updated mockupUrls state for key "${productIdForMockup}":`, updated[productIdForMockup] ? 'URL set' : 'NOT SET');
                      return updated;
                    });
                    setLoadingMockups((prev) => ({ ...prev, [productIdForMockup]: false }));
                    fetchingRef.current.delete(productIdForMockup); // Clear fetching status
                  } else if (data.task_key) {
                    // Poll for mockup if task-based (async generation)
                    console.log(`⏳ Polling for Printful mockup task: ${data.task_key}`);
                    const pollMockup = async () => {
                      let attempts = 0;
                      const maxAttempts = 15; // Increased attempts for reliability
                      while (attempts < maxAttempts) {
                        await new Promise((resolve) => setTimeout(resolve, 2000));
                        try {
                          const statusResponse = await fetch(`/api/printful-mockup/status?task_key=${data.task_key}`);
                          if (statusResponse.ok) {
                            const statusData = await statusResponse.json();
                            if (statusData.mockup_url) {
                              console.log(`✅ Printful mockup ready for ${productIdForMockup} after ${attempts + 1} attempts`);
                              setMockupUrls((prev) => ({ ...prev, [productIdForMockup]: statusData.mockup_url }));
                              setLoadingMockups((prev) => ({ ...prev, [productIdForMockup]: false }));
                              fetchingRef.current.delete(productIdForMockup); // Clear fetching status
                              return;
                            }
                          } else if (statusResponse.status === 202) {
                            // Still processing - continue polling
                            console.log(`⏳ Mockup still processing... (attempt ${attempts + 1}/${maxAttempts})`);
                          }
                        } catch (err) {
                          console.debug(`Polling attempt ${attempts + 1} failed, continuing...`);
                        }
                        attempts++;
                      }
                      // If polling fails after max attempts, keep showing loading state
                      console.error(`❌ Printful mockup polling failed for ${productIdForMockup} after ${maxAttempts} attempts`);
                      setLoadingMockups((prev) => ({ ...prev, [productIdForMockup]: false }));
                      fetchingRef.current.delete(productIdForMockup); // Clear fetching status
                    };
                    pollMockup();
                  } else {
                    console.error(`❌ No mockup URL or task_key returned for ${productIdForMockup}`);
                    setLoadingMockups((prev) => ({ ...prev, [productIdForMockup]: false }));
                    fetchingRef.current.delete(productIdForMockup); // Clear fetching status
                  }
                } else {
                  // API error - log but keep showing customer photo
                  const errorData = await response.json().catch(() => ({}));
                  console.error(`❌ Printful API error for ${productIdForMockup}:`, errorData.message || response.status);
                  setLoadingMockups((prev) => ({ ...prev, [productIdForMockup]: false }));
                  fetchingRef.current.delete(productIdForMockup); // Clear fetching status
                }
              } catch (err) {
                console.error(`❌ Error fetching mockup for ${productIdForMockup}:`, err);
                setLoadingMockups((prev) => ({ ...prev, [productIdForMockup]: false }));
                fetchingRef.current.delete(productIdForMockup); // Clear fetching status
              }
            })();

            mockupPromises.push(mockupPromise);
          }
        } else {
          // Product without sizes - fetch single mockup
          const productIdForMockup = product.id;
          
          // Skip if we already have this mockup or are currently loading it
          if (fetchingRef.current.has(productIdForMockup) || mockupUrls[productIdForMockup]) {
            console.log(`⏸️ Skipping mockup fetch for ${productIdForMockup}: already have mockup or currently loading`);
            continue;
          }

          fetchingRef.current.add(productIdForMockup);
          setLoadingMockups((prev) => ({ ...prev, [productIdForMockup]: true }));

          console.log(`📤 Fetching Printful mockup for ${productIdForMockup}...`);

          // Create promise for this mockup fetch
          const mockupPromise = (async () => {
            try {
              const response = await fetch("/api/printful-mockup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  product_id: productIdForMockup,
                  image_url: selectedVariant.url,
                }),
              });

              if (response.ok) {
                const data = await response.json();
                if (data.mockup_url) {
                  console.log(`✅ Printful mockup ready for ${productIdForMockup}`);
                  setMockupUrls((prev) => ({ ...prev, [productIdForMockup]: data.mockup_url }));
                  setLoadingMockups((prev) => ({ ...prev, [productIdForMockup]: false }));
                  fetchingRef.current.delete(productIdForMockup);
                }
              }
            } catch (err) {
              console.error(`❌ Error fetching mockup for ${productIdForMockup}:`, err);
              setLoadingMockups((prev) => ({ ...prev, [productIdForMockup]: false }));
              fetchingRef.current.delete(productIdForMockup);
            }
          })();

          mockupPromises.push(mockupPromise);
        }
      }

      // Execute all mockup fetches in parallel
      await Promise.all(mockupPromises);
    };

    fetchAllMockups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariant?.url]); // Fetch when variant is available

  // OLD CODE REMOVED: Was generating mockups for all products upfront (wasteful)
  // Now we only generate mockups on-demand when a product is selected (see useEffect above)

  // Open product detail modal (Etsy-style)
  const handleProductClick = (product: Product) => {
    setSelectedProductForModal(product);
    setIsModalOpen(true);
  };

  // Select product for checkout (called from modal or direct selection)
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setError(null);
    // Auto-select first size for products with sizes (canvas, blanket, etc.)
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0].size);
    } else {
      setSelectedSize(null);
    }
    
    // If product variants map exists, try to use a variant generated for this product
    if (productVariantsMap && selectedVariant) {
      const productId = product.sizes?.[0] 
        ? product.sizes[0].variantKey 
        : product.id;
      
      // Find the style of the currently selected variant
      const variantStyle = Object.keys(productVariantsMap).find(style => 
        Object.values(productVariantsMap[style]).some(variants => 
          variants.some((v: any) => v.id === selectedVariant.id)
        )
      );
      
      if (variantStyle && productVariantsMap[variantStyle][productId]) {
        // Use the first variant for this product (same style)
        const productSpecificVariant = productVariantsMap[variantStyle][productId][0];
        if (productSpecificVariant && productSpecificVariant.url !== selectedVariant.url) {
          console.log(`🔄 Switching to product-specific variant for ${productId} (aspect ratio: ${productSpecificVariant.aspectRatio})`);
          setSelectedVariant(productSpecificVariant);
        }
      }
    }
    
    // Shipping will be calculated automatically via useEffect
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setError(null);
    
    // If product size changed, switch to variant for that size (canvas, blanket, etc.)
    if (selectedProduct?.sizes && productVariantsMap && selectedVariant) {
      const sizeOption = selectedProduct.sizes?.find(s => s.size === size);
      if (sizeOption) {
        const productId = sizeOption.variantKey; // "canvas-12x12" or "canvas-16x20"
        
        // Find the style of the currently selected variant
        const variantStyle = Object.keys(productVariantsMap).find(style => 
          Object.values(productVariantsMap[style]).some(variants => 
            variants.some((v: any) => v.id === selectedVariant.id)
          )
        );
        
        if (variantStyle && productVariantsMap[variantStyle][productId]) {
          // Use the first variant for this product size (same style)
          const productSpecificVariant = productVariantsMap[variantStyle][productId][0];
          if (productSpecificVariant && productSpecificVariant.url !== selectedVariant.url) {
            console.log(`🔄 Switching to product-specific variant for ${productId} (aspect ratio: ${productSpecificVariant.aspectRatio})`);
            setSelectedVariant(productSpecificVariant);
          }
        }
      }
    }
  };

  // Calculate shipping automatically when product/size changes
  const calculateShipping = async (addressOverride?: typeof shippingAddress) => {
    const address = addressOverride || shippingAddress;
    
    // Use default US address if no address provided (for estimate)
    const defaultAddress = {
      address1: "123 Main St",
      city: "New York",
      state_code: "NY",
      country_code: "US",
      zip: "10001",
    };
    
    const recipient = address.address1 && address.city && address.zip 
      ? address 
      : defaultAddress;

    if (!selectedProduct) {
      return;
    }

    setLoadingShipping(true);
    try {
      // Determine product ID
      // Determine the product ID for shipping calculation
      // The API route will convert product_id to catalog variant_id
      let productId = selectedProduct.id;
      if (selectedProduct.sizes && selectedSize) {
        const sizeOption = selectedProduct.sizes.find(s => s.size === selectedSize);
        if (sizeOption) {
          productId = sizeOption.variantKey; // Use variantKey like "canvas-12x12"
        }
      }

      const response = await fetch("/api/printful/shipping-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient,
          items: [{ product_id: productId, quantity: 1 }],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.shipping_options.length > 0) {
          setShippingOptions(data.shipping_options);
          // Use cheapest option by default
          const cheapest = data.shipping_options.reduce((prev: any, curr: any) => 
            curr.rate < prev.rate ? curr : prev
          );
          // Ensure rate is a number
          const rate = typeof cheapest.rate === 'number' ? cheapest.rate : parseFloat(cheapest.rate) || 0;
          setShippingCost(rate);
        }
      }
    } catch (error) {
      console.error("Error calculating shipping:", error);
    } finally {
      setLoadingShipping(false);
    }
  };

  // Auto-calculate shipping when product or size changes
  useEffect(() => {
    if (selectedProduct) {
      calculateShipping();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct, selectedSize]); // Recalculate when product or size changes (shippingAddress intentionally excluded - uses default if not provided)

  const handleCheckout = async () => {
    if (!selectedProduct || !selectedVariant) {
      setError("Please select a product");
      return;
    }

    // For products with sizes, require size selection
    if (selectedProduct.sizes && selectedProduct.sizes.length > 0 && !selectedSize) {
      setError(`Please select a ${selectedProduct.name.toLowerCase()} size`);
      return;
    }

    setLoading(true);
    setError(null);

    // Determine the product ID and price based on selection
    let productId = selectedProduct.id;
    let productName = selectedProduct.name;
    let price = selectedProduct.price;

    // For products with sizes, use the size-specific variant key
    if (selectedProduct.sizes && selectedSize) {
      const sizeOption = selectedProduct.sizes.find(s => s.size === selectedSize);
      if (sizeOption) {
        productId = sizeOption.variantKey; // Use "canvas-12x12", "blanket-37x57", etc.
        productName = `${selectedSize} ${selectedProduct.name}`;
        price = sizeOption.price;
      }
    }

    // Shipping is already calculated automatically when product is selected
    const finalShippingCost = shippingCost || 0;

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          product_name: productName,
          price: price,
          variant_url: selectedVariant.url,
          variant_id: selectedVariant.id,
          shipping_cost: finalShippingCost || 0, // Include shipping cost
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create checkout session");
      }

      const data = await response.json();
      
      if (data.checkout_url) {
        // Redirect to Stripe checkout
        window.location.href = data.checkout_url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Failed to proceed to checkout. Please try again.");
      setLoading(false);
    }
  };

  if (!selectedVariant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Product 🎨
          </h1>
          <p className="text-xl text-gray-600">
            Select how you'd like to display your pet's portrait
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Selected Portrait Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Portrait</h2>
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-4">
                <Image
                  src={selectedVariant.url}
                  alt="Selected portrait"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                This is the portrait that will be printed
              </p>
            </div>
          </div>

          {/* Product Selection */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {products.map((product) => {
                const isSelected = selectedProduct?.id === product.id;
                return (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className={`relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? "ring-4 ring-amber-500 scale-105 shadow-xl"
                        : "hover:scale-102 hover:shadow-lg"
                    }`}
                  >
                    {product.popular && (
                      <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                        POPULAR
                      </div>
                    )}
                    
                    {/* Product Preview with Printful Mockup */}
                    <div>
                      {product.sizes ? (
                        // Products with sizes: Show mockup for selected size if this product is selected, otherwise show first size
                        (() => {
                          // If this product is selected, use selectedSize; otherwise use first size
                          const displaySize = isSelected && selectedSize 
                            ? selectedSize 
                            : (product.sizes && product.sizes[0]?.size);
                          const sizeOption = displaySize ? product.sizes.find(s => s.size === displaySize) : null;
                          const mockupKey = sizeOption ? sizeOption.variantKey : null;
                          const isLoading = mockupKey ? (loadingMockups[mockupKey] ?? false) : false;
                          const mockupUrl = mockupKey ? (mockupUrls[mockupKey] || null) : null;
                          
                          if (isLoading) {
                            return (
                              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                              </div>
                            );
                          } else if (mockupUrl) {
                            // Show Printful mockup - image defines its own size
                            return (
                              <img
                                src={mockupUrl}
                                alt={`${product.name} ${displaySize} mockup`}
                                style={{ width: '100%', display: 'block' }}
                              />
                            );
                          } else if (selectedVariant) {
                            return (
                              <img
                                src={selectedVariant.url}
                                alt="Preview"
                                style={{ width: '100%', display: 'block' }}
                              />
                            );
                          } else {
                            return (
                              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <p className="text-sm text-gray-400">Loading...</p>
                              </div>
                            );
                          }
                        })()
                      ) : (() => {
                        // Products without sizes
                        const isLoading = loadingMockups[product.id];
                        const mockupUrl = mockupUrls[product.id];
                        
                        if (isLoading) {
                          return (
                            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                            </div>
                          );
                        } else if (mockupUrl) {
                          return (
                            <img
                              src={mockupUrl}
                              alt={`${product.name} mockup`}
                              style={{ width: '100%', display: 'block' }}
                            />
                          );
                        } else if (selectedVariant) {
                          return (
                            <img
                              src={selectedVariant.url}
                              alt={`${product.name} preview`}
                              style={{ width: '100%', display: 'block' }}
                            />
                          );
                        } else {
                          return null;
                        }
                      })()}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 text-center mb-3 min-h-[2.5rem]">
                        {product.description}
                      </p>
                      
                      {/* Size Selection for Products with Sizes */}
                      {product.sizes && isSelected && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Select Size:</p>
                          <div className="flex gap-2 justify-center">
                            {product.sizes.map((sizeOption) => (
                              <button
                                key={sizeOption.size}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSizeSelect(sizeOption.size);
                                }}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                                  selectedSize === sizeOption.size
                                    ? "bg-amber-500 text-white shadow-md scale-105"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {sizeOption.size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <p className="text-2xl font-bold text-amber-600">
                          ${product.sizes && selectedSize && isSelected
                            ? product.sizes.find(s => s.size === selectedSize)?.price || product.price
                            : product.price}
                        </p>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="absolute top-2 left-2 bg-amber-500 text-white rounded-full p-2 z-10">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {selectedProduct && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Order Summary</h3>
                  
                  {/* Product Price */}
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-gray-700 font-medium">
                        {selectedProduct.sizes && selectedSize
                          ? `${selectedSize} ${selectedProduct.name}`
                          : selectedProduct.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ${selectedProduct.sizes && selectedSize
                          ? selectedProduct.sizes.find(s => s.size === selectedSize)?.price || selectedProduct.price
                          : selectedProduct.price}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Cost */}
                  <div className="flex items-center justify-between mb-2 border-t pt-2">
                    <div>
                      <p className="text-gray-700 font-medium">Shipping</p>
                      {loadingShipping && (
                        <p className="text-xs text-gray-500">Calculating...</p>
                      )}
                      {!loadingShipping && !shippingCost && (
                        <p className="text-xs text-gray-500">Estimate (US)</p>
                      )}
                    </div>
                    <div className="text-right">
                      {loadingShipping ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600 inline-block"></div>
                      ) : shippingCost !== null && shippingCost !== undefined ? (
                        <p className="text-lg font-semibold text-gray-900">${Number(shippingCost).toFixed(2)}</p>
                      ) : (
                        <p className="text-sm text-gray-500">—</p>
                      )}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t-2 border-gray-200">
                    <div>
                      <p className="text-lg font-bold text-gray-900">Total</p>
                      <p className="text-xs text-gray-500">+ tax (calculated at checkout)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-amber-600">
                        ${(
                          (selectedProduct.sizes && selectedSize
                            ? selectedProduct.sizes.find(s => s.size === selectedSize)?.price || selectedProduct.price
                            : selectedProduct.price) +
                          (shippingCost || 0)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={loading || loadingShipping}
                  className="w-full px-8 py-4 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                >
                  {loading ? "Processing..." : loadingShipping ? "Calculating Shipping..." : `Proceed to Payment →`}
                </button>
              </div>
            )}

            <div className="text-center">
              <Link
                href="/variants"
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                ← Back to Variants
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Detail Modal */}
      {selectedProductForModal && (
        <ProductDetailModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProductForModal(null);
          }}
          productId={selectedProductForModal.sizes?.[0]?.variantKey || selectedProductForModal.id}
          productName={selectedProductForModal.name}
          productDescription={selectedProductForModal.description}
          productIcon={selectedProductForModal.icon}
          sizes={selectedProductForModal.sizes}
          selectedVariantUrl={selectedVariant?.url}
          onSelectProduct={() => handleProductSelect(selectedProductForModal)}
          mockupUrls={mockupUrls}
          loadingMockups={loadingMockups}
        />
      )}
    </div>
  );
}

