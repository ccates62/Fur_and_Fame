"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProductDetailModal from "@/components/ProductDetailModal";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  sizes?: { size: string; price: number; variantKey: string }[];
}

interface SelectedVariant {
  variant: {
    url: string;
    style?: string;
  };
  style?: string;
}

const products: Product[] = [
  {
    id: "canvas",
    name: "Canvas Print",
    description: "Premium canvas print of your pet's portrait",
    price: 59,
    icon: "🖼️",
    sizes: [
      { size: "12×12", price: 59, variantKey: "canvas-12x12" },
      { size: "16×20", price: 89, variantKey: "canvas-16x20" },
    ],
  },
  {
    id: "blanket",
    name: "Throw Blanket",
    description: "Cozy sherpa blanket with your pet's portrait",
    price: 49,
    icon: "🛏️",
    sizes: [
      { size: "37×57", price: 39, variantKey: "blanket-37x57" },
      { size: "50×60", price: 49, variantKey: "blanket-50x60" },
    ],
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<SelectedVariant | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [mockupUrls, setMockupUrls] = useState<Record<string, string>>({});
  const [loadingMockups, setLoadingMockups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load selected variant from sessionStorage
    if (typeof window !== "undefined") {
      const storedVariant = sessionStorage.getItem("selectedVariant");
      if (storedVariant) {
        try {
          const parsed = JSON.parse(storedVariant);
          setSelectedVariant(parsed);
        } catch (e) {
          console.error("Error parsing selected variant:", e);
          router.push("/variants");
        }
      } else {
        router.push("/variants");
      }
      setLoading(false);
    }
  }, [router]);

  const handleProductClick = (product: Product) => {
    setModalProduct(product);
    setShowProductModal(true);
  };

  const handleSelectProduct = (product: Product, size?: string) => {
    setSelectedProduct(product);
    if (size) {
      setSelectedSize(size);
    } else if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0].size);
    } else {
      setSelectedSize(null);
    }
    setShowProductModal(false);
  };

  const getSelectedProductId = (): string => {
    if (!selectedProduct) return "";
    if (selectedProduct.sizes && selectedSize) {
      const sizeOption = selectedProduct.sizes.find((s) => s.size === selectedSize);
      return sizeOption?.variantKey || selectedProduct.id;
    }
    return selectedProduct.id;
  };

  const getSelectedPrice = (): number => {
    if (!selectedProduct) return 0;
    if (selectedProduct.sizes && selectedSize) {
      const sizeOption = selectedProduct.sizes.find((s) => s.size === selectedSize);
      return sizeOption?.price || selectedProduct.price;
    }
    return selectedProduct.price;
  };

  const handleCheckout = async () => {
    if (!selectedProduct || !selectedVariant) {
      setError("Please select a product");
      return;
    }

    setCheckoutLoading(true);
    setError(null);

    try {
      const productId = getSelectedProductId();
      const price = getSelectedPrice();
      const variantUrl = selectedVariant.variant.url;

      // Create Stripe checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          product_name: selectedProduct.name,
          variant_url: variantUrl,
          price: price,
          size: selectedSize,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create checkout session");
      }

      const data = await response.json();
      if (data.checkout_url) {
        // Redirect to Stripe checkout
        window.location.href = data.checkout_url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      setError(error.message || "Failed to proceed to checkout. Please try again.");
      setCheckoutLoading(false);
    }
  };

  const loadMockup = async (productId: string, variantKey: string) => {
    if (mockupUrls[variantKey] || loadingMockups[variantKey]) return;

    if (!selectedVariant) return;

    setLoadingMockups((prev) => ({ ...prev, [variantKey]: true }));

    try {
      const response = await fetch("/api/printful-mockup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: variantKey,
          image_url: selectedVariant.variant.url,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.mockup_url) {
          setMockupUrls((prev) => ({ ...prev, [variantKey]: data.mockup_url }));
        }
      }
    } catch (error) {
      console.error("Error loading mockup:", error);
    } finally {
      setLoadingMockups((prev) => ({ ...prev, [variantKey]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!selectedVariant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-white">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No variant selected. Please select a variant first.</p>
          <button
            onClick={() => router.push("/variants")}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Go to Variants
          </button>
        </div>
      </div>
    );
  }

  const selectedPrice = getSelectedPrice();
  const selectedProductId = getSelectedProductId();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Select Your Product</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Selected Portrait */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Portrait</h2>
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <Image
                src={selectedVariant.variant.url}
                alt="Selected portrait"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {selectedVariant.variant.style && (
              <p className="text-sm text-gray-600 text-center">Style: {selectedVariant.variant.style}</p>
            )}
          </div>

          {/* Right: Product Selection */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Choose a Product</h2>

            <div className="space-y-4 mb-6">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedProduct?.id === product.id
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{product.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.description}</p>
                      {product.sizes && product.sizes.length > 0 ? (
                        <p className="text-sm text-amber-600 mt-1">
                          From ${Math.min(...product.sizes.map((s) => s.price))}
                        </p>
                      ) : (
                        <p className="text-sm text-amber-600 mt-1">${product.price}</p>
                      )}
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Product Summary */}
            {selectedProduct && (
              <div className="border-t pt-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedProduct.name}</h3>
                    {selectedSize && (
                      <p className="text-sm text-gray-600">Size: {selectedSize}</p>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-amber-600">${selectedPrice}</p>
                </div>

                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Size:</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((size) => (
                        <button
                          key={size.size}
                          onClick={() => {
                            setSelectedSize(size.size);
                            loadMockup(selectedProduct.id, size.variantKey);
                          }}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            selectedSize === size.size
                              ? "bg-amber-500 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {size.size} - ${size.price}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                >
                  {checkoutLoading ? "Processing..." : `Proceed to Checkout - $${selectedPrice}`}
                </button>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </div>
            )}

            {!selectedProduct && (
              <p className="text-sm text-gray-500 text-center py-4">
                Click on a product above to view details and select
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {showProductModal && modalProduct && (
        <ProductDetailModal
          isOpen={showProductModal}
          onClose={() => setShowProductModal(false)}
          productId={modalProduct.id}
          productName={modalProduct.name}
          productDescription={modalProduct.description}
          productIcon={modalProduct.icon}
          sizes={modalProduct.sizes}
          selectedVariantUrl={selectedVariant.variant.url}
          onSelectProduct={() => handleSelectProduct(modalProduct)}
          mockupUrls={mockupUrls}
          loadingMockups={loadingMockups}
        />
      )}
    </div>
  );
}
