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
}

const products: Product[] = [
  {
    id: "canvas-12x12",
    name: "12x12 Canvas",
    description: "Premium quality canvas print, perfect for displaying your pet's portrait",
    price: 59,
    icon: "🖼️",
  },
  {
    id: "canvas-16x20",
    name: "16x20 Canvas",
    description: "Large format canvas print for maximum impact",
    price: 89,
    icon: "🖼️",
    popular: true,
  },
  {
    id: "mug",
    name: "Mug",
    description: "Ceramic mug with your pet's portrait, perfect for daily use",
    price: 19,
    icon: "☕",
  },
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
  {
    id: "bundle",
    name: "Bundle",
    description: "Best value! Get both 12x12 Canvas and Mug together",
    price: 99,
    icon: "🎁",
    popular: true,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load selected variant from sessionStorage
    if (typeof window !== "undefined") {
      const storedVariant = sessionStorage.getItem("selectedVariant");
      if (storedVariant) {
        try {
          const parsed = JSON.parse(storedVariant);
          setSelectedVariant(parsed.variant || parsed);
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

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setError(null);
  };

  const handleCheckout = async () => {
    if (!selectedProduct || !selectedVariant) {
      setError("Please select a product");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          product_name: selectedProduct.name,
          price: selectedProduct.price,
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
                    
                    {/* Product Preview with Portrait */}
                    <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                      {selectedVariant && (
                        <Image
                          src={selectedVariant.url}
                          alt={`${product.name} with portrait`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      )}
                      {/* Product overlay/mockup effect */}
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1">
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
                      <div className="text-center">
                        <p className="text-2xl font-bold text-amber-600">
                          ${product.price}
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

