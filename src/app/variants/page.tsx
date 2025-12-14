"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VariantPicker, { PortraitVariant } from "@/components/VariantPicker";

export default function VariantsPage() {
  const router = useRouter();
  const [variants, setVariants] = useState<PortraitVariant[] | Record<string, PortraitVariant[]>>([]);
  const [petName, setPetName] = useState("");
  const [testMode, setTestMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>("");
  const [remainingFree, setRemainingFree] = useState<number>(0);

  useEffect(() => {
    // Load variants from sessionStorage
    if (typeof window !== "undefined") {
      const storedVariants = sessionStorage.getItem("portraitVariants");
      const storedPetName = sessionStorage.getItem("petName");
      const storedSubjects = sessionStorage.getItem("subjects"); // For multi-subject flow
      const storedSessionId = sessionStorage.getItem("sessionId");

      // Check if we have variants (either single-pet or multi-subject)
      if (storedVariants) {
        try {
          const parsedVariants = JSON.parse(storedVariants);
          setVariants(parsedVariants);
          
          // For multi-subject flow, use first subject's name or generic name
          if (storedSubjects) {
            try {
              const subjects = JSON.parse(storedSubjects);
              const firstPet = subjects.find((s: any) => s.type === "pet");
              setPetName(firstPet?.name || "Your Portrait");
            } catch {
              setPetName("Your Portrait");
            }
          } else {
            setPetName(storedPetName || "Your Portrait");
          }
          
          setSessionId(storedSessionId || "");
          const storedTestMode = sessionStorage.getItem("testMode");
          setTestMode(storedTestMode === "true");
          
          // Check session for remaining free generations
          if (storedSessionId) {
            fetch("/api/sessions/check", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ session_id: storedSessionId }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.success && data.session) {
                  setRemainingFree(data.session.remaining_free || 0);
                }
              })
              .catch(() => {
                // Non-blocking
              });
          }
        } catch (e) {
          console.error("Error parsing variants:", e);
          router.push("/create");
        }
      } else {
        router.push("/create");
      }
      setLoading(false);
    }
  }, [router]);

  const handleSelect = (variant: PortraitVariant, style?: string) => {
    // Store selected variant with style info
    sessionStorage.setItem("selectedVariant", JSON.stringify({ variant, style }));
    
    // Navigate to checkout (will be built in next step)
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading variants...</p>
        </div>
      </div>
    );
  }

  const variantsArray = Array.isArray(variants) ? variants : Object.values(variants).flat();
  if (variantsArray.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-white">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No variants found. Please start over.</p>
          <button
            onClick={() => router.push("/create")}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Go to Upload Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {testMode && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 mx-4 sm:mx-6 lg:mx-8 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🧪</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-800">
                <strong>Test Mode Active:</strong> These are placeholder images for testing (no API costs)
              </p>
              <p className="text-xs text-blue-600 mt-1">
                To use real AI-generated portraits, set FAL_TEST_MODE=false in your .env.local file
              </p>
            </div>
          </div>
        </div>
      )}
      <VariantPicker 
        variants={variants} 
        petName={petName} 
        sessionId={sessionId}
        remainingFree={remainingFree}
        onSelect={handleSelect} 
      />
    </>
  );
}

