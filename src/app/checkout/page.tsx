"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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
  // NOTE: Other products (blanket, t-shirt, poster) are commented out
  // because they don't exist in your Printful store yet.
  // Uncomment and update product IDs in PRINTFUL_PRODUCT_MAP once you set them up in Printful.
  /*
  {
    id: "blanket",
    name: "Throw Blanket",
    description: "Cozy fleece blanket with your pet's portrait, perfect for snuggling",
    price: 49,
    icon: "🛏️",
  },
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
  const [selectedSize, setSelectedSize] = useState<string | null>(null); // Add size selection for canvas
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mockupUrls, setMockupUrls] = useState<Record<string, string>>({});
  const [loadingMockups, setLoadingMockups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load selected variant from sessionStorage
    if (typeof window !== "undefined") {
      const storedVariant = sessionStorage.getItem("selectedVariant");
      if (storedVariant) {
        try {
          const parsed = JSON.parse(storedVariant);
          setSelectedVariant(parsed.variant || parsed);
          
          // Auto-select first canvas size so mockup shows immediately
          const canvasProduct = products.find(p => p.id === "canvas");
          if (canvasProduct?.sizes && canvasProduct.sizes.length > 0) {
            setSelectedSize(canvasProduct.sizes[0].size);
          }
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

  // Fetch Printful mockups for all products when variant is loaded
  useEffect(() => {
    if (!selectedVariant?.url) return;

    const fetchMockups = async () => {
      const newMockupUrls: Record<string, string> = {};
      const newLoadingMockups: Record<string, boolean> = {};

      // Fetch mockups for each product
      for (const product of products) {
        // For canvas, fetch mockups for each size
        if (product.id === "canvas" && product.sizes) {
          for (const sizeOption of product.sizes) {
            const productIdForMockup = sizeOption.variantKey;
            newLoadingMockups[productIdForMockup] = true;
            setLoadingMockups((prev) => ({ ...prev, [productIdForMockup]: true }));

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
                  newMockupUrls[productIdForMockup] = data.mockup_url;
                } else if (data.task_key) {
                  // Poll for mockup if task-based
                  const pollMockup = async () => {
                    let attempts = 0;
                    const maxAttempts = 10;
                    while (attempts < maxAttempts) {
                      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
                      try {
                        const statusResponse = await fetch(`/api/printful-mockup/status?task_key=${data.task_key}`);
                        if (statusResponse.ok) {
                          const statusData = await statusResponse.json();
                          if (statusData.mockup_url) {
                            newMockupUrls[productIdForMockup] = statusData.mockup_url;
                            setMockupUrls((prev) => ({ ...prev, [productIdForMockup]: statusData.mockup_url }));
                            setLoadingMockups((prev) => ({ ...prev, [productIdForMockup]: false }));
                            return;
                          }
                        }
                        // 202 (Accepted) or 404 means not ready yet - continue polling (don't log as error)
                      } catch (err) {
                        // Network errors - continue polling
                        console.debug(`Polling attempt ${attempts + 1} failed, continuing...`);
                      }
                      attempts++;
                    }
                    // Fallback to original image if polling fails
                    newMockupUrls[productIdForMockup] = selectedVariant.url;
                    setLoadingMockups((prev) => ({ ...prev, [productIdForMockup]: false }));
                  };
                  pollMockup();
                } else {
                  // Fallback to original image
                  newMockupUrls[productIdForMockup] = selectedVariant.url;
                }
              } else {
                // Fallback to original image on error
                newMockupUrls[productIdForMockup] = selectedVariant.url;
              }
            } catch (err) {
              console.error(`Error fetching mockup for ${productIdForMockup}:`, err);
              // Fallback to original image
              newMockupUrls[productIdForMockup] = selectedVariant.url;
            } finally {
              setLoadingMockups((prev) => ({ ...prev, [productIdForMockup]: false }));
            }
          }
          continue; // Skip the regular product mockup fetch for canvas
        }

        newLoadingMockups[product.id] = true;
        setLoadingMockups((prev) => ({ ...prev, [product.id]: true }));

        try {
          const response = await fetch("/api/printful-mockup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              product_id: product.id,
              image_url: selectedVariant.url,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.mockup_url) {
              newMockupUrls[product.id] = data.mockup_url;
                } else if (data.task_key) {
                  // Poll for mockup if task-based
                  const pollMockup = async () => {
                    let attempts = 0;
                    const maxAttempts = 10;
                    while (attempts < maxAttempts) {
                      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
                      try {
                        const statusResponse = await fetch(`/api/printful-mockup/status?task_key=${data.task_key}`);
                        if (statusResponse.ok) {
                          const statusData = await statusResponse.json();
                          if (statusData.mockup_url) {
                            newMockupUrls[product.id] = statusData.mockup_url;
                            setMockupUrls((prev) => ({ ...prev, [product.id]: statusData.mockup_url }));
                            setLoadingMockups((prev) => ({ ...prev, [product.id]: false }));
                            return;
                          }
                        }
                        // 202 (Accepted) or 404 means not ready yet - continue polling (don't log as error)
                      } catch (err) {
                        // Network errors - continue polling
                        console.debug(`Polling attempt ${attempts + 1} failed, continuing...`);
                      }
                      attempts++;
                    }
                    // Fallback to original image if polling fails
                    newMockupUrls[product.id] = selectedVariant.url;
                    setLoadingMockups((prev) => ({ ...prev, [product.id]: false }));
                  };
                  pollMockup();
            } else {
              // Fallback to original image
              newMockupUrls[product.id] = selectedVariant.url;
            }
          } else {
            // Fallback to original image on error
            newMockupUrls[product.id] = selectedVariant.url;
          }
        } catch (err) {
          console.error(`Error fetching mockup for ${product.id}:`, err);
          // Fallback to original image
          newMockupUrls[product.id] = selectedVariant.url;
        } finally {
          setLoadingMockups((prev) => ({ ...prev, [product.id]: false }));
        }
      }

      setMockupUrls((prev) => ({ ...prev, ...newMockupUrls }));
    };

    fetchMockups();
  }, [selectedVariant]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setError(null);
    // Auto-select first size for canvas products
    if (product.id === "canvas" && product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0].size);
    } else {
      setSelectedSize(null);
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setError(null);
  };

  const handleCheckout = async () => {
    if (!selectedProduct || !selectedVariant) {
      setError("Please select a product");
      return;
    }

    // For canvas, require size selection
    if (selectedProduct.id === "canvas" && !selectedSize) {
      setError("Please select a canvas size");
      return;
    }

    setLoading(true);
    setError(null);

    // Determine the product ID and price based on selection
    let productId = selectedProduct.id;
    let productName = selectedProduct.name;
    let price = selectedProduct.price;

    // For canvas, use the size-specific variant key
    if (selectedProduct.id === "canvas" && selectedSize) {
      const sizeOption = selectedProduct.sizes?.find(s => s.size === selectedSize);
      if (sizeOption) {
        productId = sizeOption.variantKey; // Use "canvas-12x12" or "canvas-16x20"
        productName = `${selectedSize} ${selectedProduct.name}`;
        price = sizeOption.price;
      }
    }

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
                    onClick={() => handleProductSelect(product)}
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
                    <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden min-h-[260px]">
                      {product.id === "canvas" ? (
                        // Canvas: Show mockup for selected size, or default to first size, or show placeholder
                        (() => {
                          // Determine which size to show: selected size, or first size, or none
                          const displaySize = selectedSize || (product.sizes && product.sizes[0]?.size);
                          const mockupKey = displaySize ? `canvas-${displaySize}` : null;
                          const isLoading = mockupKey ? loadingMockups[mockupKey] : false;
                          const mockupUrl = mockupKey ? mockupUrls[mockupKey] : null;
                          
                          if (isLoading) {
                            return (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                              </div>
                            );
                          } else if (mockupUrl) {
                            return (
                              <Image
                                src={mockupUrl}
                                alt={`Canvas ${displaySize} mockup`}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            );
                          } else {
                            // Show placeholder portrait image
                            return (
                              <div className="absolute inset-0 bg-white rounded shadow-lg border-2 border-amber-800/20 flex items-center justify-center p-4">
                                {selectedVariant ? (
                                  <Image
                                    src={selectedVariant.url}
                                    alt="Canvas preview"
                                    fill
                                    className="object-contain rounded"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  />
                                ) : (
                                  <div className="text-center text-gray-400">
                                    <p className="text-sm">Loading preview...</p>
                                  </div>
                                )}
                              </div>
                            );
                          }
                        })()
                      ) : loadingMockups[product.id] ? (
                        // Loading state while fetching Printful mockup
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                        </div>
                      ) : mockupUrls[product.id] ? (
                        // Show Printful mockup if available (for other products)
                        <Image
                          src={mockupUrls[product.id]}
                          alt={`${product.name} mockup`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : selectedVariant ? (
                        // Fallback: Show original portrait if mockup not available
                        <Image
                          src={selectedVariant.url}
                          alt={`${product.name} with portrait`}
                          fill
                          className="object-cover rounded-lg"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : null}
                      
                      {/* Product label overlay */}
                      <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm rounded px-2 py-1 shadow-md">
                        <p className="text-xs font-semibold text-gray-900 text-center">
                          {product.icon} {product.name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 text-center mb-3 min-h-[2.5rem]">
                        {product.description}
                      </p>
                      
                      {/* Size Selection for Canvas */}
                      {product.id === "canvas" && product.sizes && isSelected && (
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
                          ${product.id === "canvas" && selectedSize && isSelected
                            ? product.sizes?.find(s => s.size === selectedSize)?.price || product.price
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
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Selected Product</h3>
                    <p className="text-gray-600">{selectedProduct.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-amber-600">
                      ${selectedProduct.price}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full px-8 py-4 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                >
                  {loading ? "Processing..." : `Proceed to Payment →`}
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
    </div>
  );
}

