"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { generateMugMockup, generateCanvasMockup, MockupOptions } from "@/lib/client-mockup-generator";

interface ClientMockupProps {
  imageUrl: string;
  productType: "mug" | "canvas";
  placement?: "left" | "right" | "front" | "back";
  className?: string;
  alt?: string;
}

/**
 * Client-side mockup generator component
 * Generates product mockups in the browser without API calls
 */
export default function ClientMockup({
  imageUrl,
  productType,
  placement = "right",
  className = "",
  alt = "Product mockup",
}: ClientMockupProps) {
  const [mockupUrl, setMockupUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!imageUrl) {
      setError("No image URL provided");
      setLoading(false);
      return;
    }

    const generateMockup = async () => {
      setLoading(true);
      setError(null);

      console.log(`🎨 Starting client-side mockup generation for ${productType} with image:`, imageUrl);

      try {
        let dataUrl: string;

        if (productType === "mug") {
          console.log(`☕ Generating mug mockup with placement: ${placement}`);
          const options: MockupOptions = {
            placement,
            perspective: 0.3,
            curvature: 0.15,
          };
          dataUrl = await generateMugMockup(imageUrl, options);
          console.log(`✅ Mug mockup generated successfully`);
        } else if (productType === "canvas") {
          console.log(`🖼️ Generating canvas mockup`);
          dataUrl = await generateCanvasMockup(imageUrl);
          console.log(`✅ Canvas mockup generated successfully`);
        } else {
          throw new Error(`Unsupported product type: ${productType}`);
        }

        if (!dataUrl) {
          throw new Error("Mockup generation returned empty result");
        }

        setMockupUrl(dataUrl);
        setLoading(false);
        console.log(`✅ Mockup URL set successfully`);
      } catch (err: any) {
        console.error("❌ Error generating client-side mockup:", err);
        console.error("Error details:", {
          message: err.message,
          stack: err.stack,
          productType,
          imageUrl,
        });
        setError(err.message || "Failed to generate mockup");
        setLoading(false);
      }
    };

    generateMockup();
  }, [imageUrl, productType, placement]);

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-500 text-center px-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!mockupUrl) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-500">No mockup available</p>
        </div>
      </div>
    );
  }

  // Use regular img tag for data URLs (Next.js Image doesn't optimize data URLs)
  const isDataUrl = mockupUrl.startsWith('data:');
  
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 ${className}`}
      style={{ minHeight: 240 }}
    >
      {isDataUrl ? (
        <img
          src={mockupUrl}
          alt={alt}
          className="w-full h-full object-contain absolute inset-0"
          loading="eager"
        />
      ) : (
        <Image
          src={mockupUrl}
          alt={alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority
        />
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

