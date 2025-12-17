"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productDescription: string;
  productIcon: string;
  sizes?: { size: string; price: number; variantKey: string }[];
  selectedVariantUrl?: string;
  onSelectProduct?: () => void; // Callback to select product for checkout
  mockupUrls?: Record<string, string>; // Cached mockup URLs from parent
  loadingMockups?: Record<string, boolean>; // Loading states from parent
}

interface PrintfulProductDetails {
  name: string;
  description?: string;
  materials?: string;
  care_instructions?: string;
  dimensions?: string;
  weight?: string;
  mockupImages?: string[];
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  productId,
  productName,
  productDescription,
  productIcon,
  sizes,
  selectedVariantUrl,
  onSelectProduct,
  mockupUrls = {},
  loadingMockups = {},
}: ProductDetailModalProps) {
  const [productDetails, setProductDetails] = useState<PrintfulProductDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Get first size as default
  useEffect(() => {
    if (sizes && sizes.length > 0 && !selectedSize) {
      setSelectedSize(sizes[0].size);
    }
  }, [sizes, selectedSize]);

  // Fetch product details from Printful
  useEffect(() => {
    if (!isOpen || !productId) return;

    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/printful/product-details?productId=${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProductDetails(data.details);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [isOpen, productId]);

  // Use cached mockup URL from parent instead of fetching
  // This prevents regeneration when clicking products

  if (!isOpen) return null;

  const selectedSizeOption = sizes?.find(s => s.size === selectedSize);
  const displayPrice = selectedSizeOption?.price || 0;
  
  // Get mockup URL from cache (parent component's state) - prevents regeneration
  const mockupKey = selectedSizeOption?.variantKey || productId;
  const mockupUrl = mockupUrls[mockupKey] || null;
  const loadingMockup = loadingMockups[mockupKey] || false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Left: Product Image/Mockup */}
          <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
            {loadingMockup ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
              </div>
            ) : mockupUrl ? (
              <img
                src={mockupUrl}
                alt={`${productName} mockup`}
                className="w-full h-full object-contain"
              />
            ) : selectedVariantUrl ? (
              <Image
                src={selectedVariantUrl}
                alt={productName}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <span className="text-6xl">{productIcon}</span>
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            <div className="mb-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{productName}</h2>
              <p className="text-2xl font-semibold text-amber-600 mb-4">${displayPrice}</p>
              <p className="text-gray-600 mb-6">{productDescription}</p>
            </div>

            {/* Size Selection */}
            {sizes && sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Size:
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size.size}
                      onClick={() => setSelectedSize(size.size)}
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

            {/* Printful Product Details */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
              </div>
            ) : productDetails ? (
              <div className="space-y-4 text-sm text-gray-600 border-t pt-4">
                {productDetails.materials && (
                  <div>
                    <span className="font-semibold text-gray-900">Materials: </span>
                    {productDetails.materials}
                  </div>
                )}
                {productDetails.dimensions && (
                  <div>
                    <span className="font-semibold text-gray-900">Dimensions: </span>
                    {productDetails.dimensions}
                  </div>
                )}
                {productDetails.care_instructions && (
                  <div>
                    <span className="font-semibold text-gray-900">Care Instructions: </span>
                    {productDetails.care_instructions}
                  </div>
                )}
                {productDetails.description && (
                  <div>
                    <span className="font-semibold text-gray-900">Details: </span>
                    {productDetails.description}
                  </div>
                )}
              </div>
            ) : null}

            {/* Estimated Delivery */}
            <div className="mt-auto pt-6 border-t space-y-4">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">Estimated Delivery: </span>
                9-20 business days
              </p>
              
              {/* Select for Checkout Button */}
              {onSelectProduct && (
                <button
                  onClick={() => {
                    onSelectProduct();
                    onClose();
                  }}
                  className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Select for Checkout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

