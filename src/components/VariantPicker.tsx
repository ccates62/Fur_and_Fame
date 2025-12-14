"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export interface PortraitVariant {
  id: string;
  url: string;
  prompt: string;
}

interface VariantPickerProps {
  variants: PortraitVariant[] | Record<string, PortraitVariant[]>; // Support both old format and new grouped format
  petName: string;
  sessionId?: string;
  remainingFree?: number;
  onSelect: (variant: PortraitVariant, style?: string) => void;
}

function VariantPickerInner({
  variants,
  petName,
  sessionId,
  remainingFree = 0,
  onSelect,
}: VariantPickerProps) {
  const [selectedVariant, setSelectedVariant] = useState<{ variant: PortraitVariant; style: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false);
  const [selectedStyleForPayment, setSelectedStyleForPayment] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if returning from payment
  useEffect(() => {
    const payment = searchParams.get("payment");
    const style = searchParams.get("style");
    const checkoutSessionId = searchParams.get("checkout_session_id");
    
    if (payment === "success" && style && checkoutSessionId && sessionId) {
      // Payment successful - generate the additional style
      handlePaymentSuccess(style, checkoutSessionId);
    }
  }, [searchParams, sessionId]);

  // Normalize variants to grouped format
  const groupedVariants: Record<string, PortraitVariant[]> = Array.isArray(variants)
    ? { "Selected Style": variants } // Old format - single style
    : variants; // New format - multiple styles

  const handleSelect = (variant: PortraitVariant, style: string) => {
    setSelectedVariant({ variant, style });
    setLoading(true);
    // Small delay for UX
    setTimeout(() => {
      onSelect(variant, style);
      setLoading(false);
    }, 300);
  };

  const handleTryAnotherStyle = (style: string) => {
    if (remainingFree > 0) {
      // Still has free generations - allow it
      // This would trigger a new generation (to be implemented)
      setShowPaymentPrompt(false);
    } else {
      // No free generations left - show payment prompt
      setSelectedStyleForPayment(style);
      setShowPaymentPrompt(true);
    }
  };

  const handlePaymentSuccess = async (style: string, checkoutSessionId: string) => {
    try {
      const response = await fetch("/api/generate-additional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style,
          session_id: sessionId,
          checkout_session_id: checkoutSessionId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Add new variants to the display
        // Reload page or update state
        window.location.reload();
      }
    } catch (error) {
      console.error("Error generating additional style:", error);
    }
  };

  const initiatePayment = async () => {
    if (!selectedStyleForPayment || !sessionId) return;

    try {
      const response = await fetch("/api/checkout-additional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style: selectedStyleForPayment,
          session_id: sessionId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.checkout_url) {
          window.location.href = data.checkout_url;
        }
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Favorite Portrait
          </h1>
          <p className="text-xl text-gray-600">
            {Object.keys(groupedVariants).length > 1 
              ? `We generated portraits of ${petName} in ${Object.keys(groupedVariants).length} different styles. Pick your favorite!`
              : `We generated 3 amazing portraits of ${petName}. Pick your favorite!`
            }
          </p>
          {remainingFree > 0 && (
            <p className="text-sm text-green-600 mt-2">
              🎉 {remainingFree} free style generation{remainingFree !== 1 ? 's' : ''} remaining!
            </p>
          )}
        </div>

        {/* Payment Prompt Modal */}
        {showPaymentPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Try Another Style
              </h3>
              <p className="text-gray-600 mb-6">
                You've used all 3 free style generations. Additional styles are just <strong className="text-amber-600">$0.50</strong> each and include 3 variants!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPaymentPrompt(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={initiatePayment}
                  className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition"
                >
                  Pay $0.50 & Generate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Display variants grouped by style */}
        {Object.entries(groupedVariants).map(([style, styleVariants]) => (
          <div key={style} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{style}</h2>
              {remainingFree === 0 && Object.keys(groupedVariants).length < 20 && (
                <button
                  onClick={() => handleTryAnotherStyle(style)}
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  Try Another Style ($0.50) →
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {styleVariants.map((variant, index) => {
                const isSelected = selectedVariant?.variant.id === variant.id && selectedVariant?.style === style;
                return (
                  <div
                    key={variant.id}
                    className={`relative group cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? "ring-4 ring-amber-500 scale-105"
                        : "hover:scale-102 hover:shadow-xl"
                    }`}
                    onClick={() => handleSelect(variant, style)}
                  >
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg bg-gray-100">
                      <Image
                        src={variant.url}
                        alt={`${petName} as ${style} - variant ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
                        <p className="text-white font-semibold text-sm">
                          Variant {index + 1}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-4 right-4 bg-amber-500 text-white rounded-full p-2">
                          <svg
                            className="w-6 h-6"
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
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium text-gray-700">
                        {isSelected ? "Selected" : "Click to select"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {selectedVariant && (
          <div className="text-center">
            <button
              onClick={() => {
                if (selectedVariant) {
                  onSelect(selectedVariant.variant, selectedVariant.style);
                }
              }}
              disabled={loading}
              className="px-8 py-4 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {loading ? "Processing..." : "Continue to Checkout →"}
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/create"
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            ← Generate Different Portraits
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VariantPicker(props: VariantPickerProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VariantPickerInner {...props} />
    </Suspense>
  );
}

