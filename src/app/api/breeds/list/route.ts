import { NextResponse } from "next/server";
import { getAllCustomBreeds, getCustomBreedsForType } from "@/lib/breed-storage";

/**
 * API route to get custom breeds
 * GET /api/breeds/list?petType=dog|cat|other
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const petType = searchParams.get("petType") as "dog" | "cat" | "other" | null;

  if (petType && ["dog", "cat", "other"].includes(petType)) {
    // Get breeds for specific type
    const breeds = getCustomBreedsForType(petType);
    return NextResponse.json({
      petType,
      breeds,
      count: breeds.length,
    });
  }

  // Get all breeds (for admin/analytics)
  const allBreeds = getAllCustomBreeds();
  return NextResponse.json({
    allBreeds,
    totalCount: allBreeds.length,
    byType: {
      dog: allBreeds.filter((b) => b.petType === "dog").length,
      cat: allBreeds.filter((b) => b.petType === "cat").length,
      other: allBreeds.filter((b) => b.petType === "other").length,
    },
  });
}

