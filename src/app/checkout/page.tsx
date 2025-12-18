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
// Static placeholder mockup URLs from Printful Dashboard
// These show immediately while real mockups with customer portrait load in background
const PLACEHOLDER_MOCKUPS: Record<string, string> = {
  "canvas-12x12": "https://files.cdn.printful.com/files/9f2/9f23bf21122d94ac498298fec3d7425e_preview.png",
  "canvas-16x20": "https://files.cdn.printful.com/files/b0a/b0a74c2fa44a1c24a99bed071d64527d_preview.png",
  "blanket-37x57": "https://files.cdn.printful.com/files/d4d/d4d11a60b82492b3b0cf77bff2d5cefa_preview.png",
  "blanket-50x60": "https://files.cdn.printful.com/files/a3f/a3f29f8526a12550f0f9ac07f1d9313c_preview.png",
};

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
  const fetchQueueRef = useRef<string[]>([]); // Queue of mockups to fetch
  const priorityKeyRef = useRef<string | null>(null); // Priority key to fetch next
  const isFetchingRef = useRef<boolean>(false); // Is the fetch loop running
  
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
      variantUrl: selectedVariant.url?.substring(0, 50) + "...",
      fullUrl: selectedVariant.url
    });

    // Check sessionStorage cache first - but invalidate if portrait URL changed
    const cachedMockups = sessionStorage.getItem("mockupUrls");
    const cachedPortraitUrl = sessionStorage.getItem("mockupPortraitUrl");
    
    if (cachedMockups && cachedPortraitUrl === selectedVariant.url) {
      try {
        const cached = JSON.parse(cachedMockups);
        // Only use cache if we have all expected mockups
        const expectedKeys = ["canvas-12x12", "canvas-16x20", "blanket-37x57", "blanket-50x60"];
        const hasAllKeys = expectedKeys.every(key => cached[key]);
        if (hasAllKeys) {
          console.log("📦 Using cached mockups from sessionStorage");
          setMockupUrls(cached);
          return; // Use cached mockups, skip fetching
        } else {
          console.log("⚠️ Cache incomplete, refetching...");
        }
      } catch (e) {
        console.log("⚠️ Could not parse cached mockups");
      }
    } else if (cachedPortraitUrl !== selectedVariant.url) {
      console.log("🔄 Portrait changed, clearing mockup cache");
      sessionStorage.removeItem("mockupUrls");
    }
    
    // Store current portrait URL for cache validation
    sessionStorage.setItem("mockupPortraitUrl", selectedVariant.url);

    // Build fetch queue: one size per product first, then remaining sizes
    const firstSizes: string[] = [];
    const remainingSizes: string[] = [];

    for (const product of products) {
      if (product.sizes && product.sizes.length > 0) {
        // Add first size to priority list
        firstSizes.push(product.sizes[0].variantKey);
        // Add remaining sizes to secondary list
        for (let i = 1; i < product.sizes.length; i++) {
          remainingSizes.push(product.sizes[i].variantKey);
        }
      } else {
        firstSizes.push(product.id);
      }
    }

    // Queue: first sizes first, then remaining
    fetchQueueRef.current = [...firstSizes, ...remainingSizes];
    console.log("📋 Fetch queue:", fetchQueueRef.current);

    // Set all as loading
    const loadingState: Record<string, boolean> = {};
    fetchQueueRef.current.forEach(key => { loadingState[key] = true; });
    setLoadingMockups(loadingState);

    // Start the fetch loop if not already running
    if (!isFetchingRef.current) {
      processFetchQueue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariant?.url]); // Fetch when variant is available

  // Process the fetch queue in batches with rate limiting
  // Printful allows ~2 requests/minute for new stores
  const BATCH_SIZE = 2;
  const BATCH_DELAY_MS = 65000; // 65 seconds between batches (safe margin for 2/min)

  const processFetchQueue = async () => {
    if (isFetchingRef.current) return; // Already running
    isFetchingRef.current = true;

    const newMockupUrls: Record<string, string> = {};

    while (fetchQueueRef.current.length > 0 || priorityKeyRef.current) {
      // Build batch of keys to fetch
      const batch: string[] = [];

      // Check for priority key first
      if (priorityKeyRef.current && !mockupUrls[priorityKeyRef.current] && !fetchingRef.current.has(priorityKeyRef.current)) {
        batch.push(priorityKeyRef.current);
        fetchQueueRef.current = fetchQueueRef.current.filter(k => k !== priorityKeyRef.current);
        console.log(`🚀 Priority fetch: ${priorityKeyRef.current}`);
        priorityKeyRef.current = null;
      }

      // Fill batch with remaining queue items
      while (batch.length < BATCH_SIZE && fetchQueueRef.current.length > 0) {
        const key = fetchQueueRef.current.shift();
        if (key && !mockupUrls[key] && !newMockupUrls[key] && !fetchingRef.current.has(key)) {
          batch.push(key);
        }
      }

      if (batch.length === 0) break;

      console.log(`📦 Fetching batch of ${batch.length}: ${batch.join(', ')}`);

      // Mark all in batch as fetching
      batch.forEach(key => fetchingRef.current.add(key));

      // Fetch all in batch in parallel
      const fetchPromises = batch.map(async (keyToFetch) => {
        console.log(`📤 Fetching Printful mockup for ${keyToFetch}...`);

        try {
          const response = await fetch("/api/printful-mockup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              product_id: keyToFetch,
              image_url: selectedVariant?.url,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.mockup_url) {
              console.log(`✅ Printful mockup ready for ${keyToFetch}`);
              newMockupUrls[keyToFetch] = data.mockup_url;
              setMockupUrls(prev => {
                const updated = { ...prev, [keyToFetch]: data.mockup_url };
                sessionStorage.setItem("mockupUrls", JSON.stringify(updated));
                return updated;
              });
            }
          } else {
            console.error(`❌ Printful API error for ${keyToFetch}`);
          }
        } catch (err) {
          console.error(`❌ Error fetching mockup for ${keyToFetch}:`, err);
        }

        fetchingRef.current.delete(keyToFetch);
        setLoadingMockups(prev => ({ ...prev, [keyToFetch]: false }));
      });

      // Wait for all in batch to complete
      await Promise.all(fetchPromises);

      // Wait before next batch if more to fetch
      if (fetchQueueRef.current.length > 0 || priorityKeyRef.current) {
        console.log(`⏳ Waiting ${BATCH_DELAY_MS / 1000}s before next batch to avoid rate limits...`);
        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
      }
    }

    isFetchingRef.current = false;
    console.log("✅ Fetch queue complete");
  };

  // Prioritize fetching a specific mockup (called when user clicks a product)
  const prioritizeMockup = (key: string) => {
    if (mockupUrls[key] || fetchingRef.current.has(key)) {
      return; // Already have it or fetching it
    }
    console.log(`🎯 Prioritizing mockup: ${key}`);
    priorityKeyRef.current = key;
    setLoadingMockups(prev => ({ ...prev, [key]: true }));
    
    // Start fetch loop if not running
    if (!isFetchingRef.current) {
      processFetchQueue();
    }
  };

  // Open product detail modal (Etsy-style)
  const handleProductClick = (product: Product) => {
    setSelectedProductForModal(product);
    setIsModalOpen(true);
    
    // Prioritize fetching this product's mockup
    if (product.sizes && product.sizes.length > 0) {
      prioritizeMockup(product.sizes[0].variantKey);
    } else {
      prioritizeMockup(product.id);
    }
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
    
    // Prioritize fetching this size's mockup
    if (selectedProduct?.sizes) {
      const sizeOption = selectedProduct.sizes.find(s => s.size === size);
      if (sizeOption) {
        prioritizeMockup(sizeOption.variantKey);
      }
    }
    
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white py-4 sm:py-12 px-2 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">
            Choose Your Product 🎨
          </h1>
          <p className="text-sm sm:text-xl text-gray-600">
            Select how you'd like to display your pet's portrait
          </p>
        </div>

        {/* Mobile Portrait Preview - Small version at top */}
        <div className="lg:hidden mb-4">
          <div className="bg-white rounded-lg shadow-md p-3 flex items-center gap-3">
            <div className="relative w-16 h-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={selectedVariant.url}
                alt="Selected portrait"
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Your Portrait</h2>
              <p className="text-xs text-gray-600">This will be printed on your product</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Selected Portrait Preview - Desktop sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Portrait</h2>
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-4">
                <Image
                  src={selectedVariant.url}
                  alt="Selected portrait"
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                This is the portrait that will be printed
              </p>
            </div>
          </div>

          {/* Product Selection */}
          <div className="col-span-1 lg:col-span-2">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
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
                          
                          // Show real mockup if available, otherwise placeholder, with loading overlay
                          const placeholderUrl = mockupKey ? PLACEHOLDER_MOCKUPS[mockupKey] : null;
                          const displayUrl = mockupUrl || placeholderUrl || selectedVariant?.url;
                          
                          return (
                            <div className="aspect-square overflow-hidden bg-white relative">
                              {displayUrl && (
                                <img
                                  src={displayUrl}
                                  alt={`${product.name} ${displaySize} mockup`}
                                  className={`w-full h-full object-contain transition-opacity ${isLoading ? 'opacity-70' : 'opacity-100'}`}
                                />
                              )}
                              {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/30">
                                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-amber-600"></div>
                                </div>
                              )}
                              {!displayUrl && !isLoading && (
                                <div className="flex items-center justify-center h-full">
                                  <p className="text-xs sm:text-sm text-gray-400">No preview</p>
                                </div>
                              )}
                            </div>
                          );
                        })()
                      ) : (() => {
                        // Products without sizes
                        const isLoading = loadingMockups[product.id];
                        const mockupUrl = mockupUrls[product.id];
                        const placeholderUrl = PLACEHOLDER_MOCKUPS[product.id];
                        const displayUrl = mockupUrl || placeholderUrl || selectedVariant?.url;
                        
                        return (
                          <div className="aspect-square overflow-hidden bg-white relative">
                            {displayUrl && (
                              <img
                                src={displayUrl}
                                alt={`${product.name} mockup`}
                                className={`w-full h-full object-contain transition-opacity ${isLoading ? 'opacity-70' : 'opacity-100'}`}
                              />
                            )}
                            {isLoading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/30">
                                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-amber-600"></div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                    
                    <div className="p-2 sm:p-4">
                      <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-1 text-center">
                        {product.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 text-center mb-2 sm:mb-3 hidden sm:block min-h-[2.5rem]">
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

