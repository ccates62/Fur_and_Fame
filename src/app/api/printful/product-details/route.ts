import { NextRequest, NextResponse } from "next/server";
import { PRINTFUL_PRODUCT_MAP } from "@/lib/printful-client";

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const PRINTFUL_API_URL = "https://api.printful.com";

/**
 * Get product details from Printful
 * GET /api/printful/product-details?productId=canvas-12x12
 * Returns: Product details (materials, dimensions, care instructions, etc.)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Missing productId parameter" },
        { status: 400 }
      );
    }

    if (!PRINTFUL_API_KEY) {
      return NextResponse.json(
        { error: "Printful API key not configured" },
        { status: 500 }
      );
    }

    // Get Printful product mapping
    const productMap = PRINTFUL_PRODUCT_MAP[productId];
    if (!productMap) {
      return NextResponse.json(
        { error: `Product ${productId} not found in Printful product map` },
        { status: 404 }
      );
    }

    const storeProductId = productMap.productId;

    // Fetch product details from Printful
    const response = await fetch(
      `${PRINTFUL_API_URL}/store/products/${storeProductId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PRINTFUL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to fetch Printful product ${storeProductId}:`,
        response.status,
        errorText
      );
      return NextResponse.json(
        { error: "Failed to fetch product details from Printful" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const product = data.result;

    // Extract relevant details without over-exposing
    // Get the first variant for general product info
    const variant = product?.sync_variants?.[0];
    const catalogProduct = variant?.product;

    // Build product details object
    const details: {
      name?: string;
      description?: string;
      materials?: string;
      dimensions?: string;
      care_instructions?: string;
      weight?: string;
    } = {};

    // Product name
    if (product?.name) {
      details.name = product.name;
    } else if (variant?.name) {
      details.name = variant.name;
    }

    // Description from catalog product
    if (catalogProduct?.description) {
      details.description = catalogProduct.description;
    }

    // Materials - extract from catalog product or variant
    if (catalogProduct?.specs) {
      // Printful specs often include materials
      const materials = catalogProduct.specs
        .filter((spec: any) => spec.name?.toLowerCase().includes("material"))
        .map((spec: any) => spec.value)
        .join(", ");
      if (materials) {
        details.materials = materials;
      }
    }

    // Dimensions - from variant or catalog product
    if (variant?.size) {
      details.dimensions = variant.size;
    } else if (catalogProduct?.size) {
      details.dimensions = catalogProduct.size;
    }

    // Care instructions - from catalog product
    if (catalogProduct?.care_instructions) {
      details.care_instructions = catalogProduct.care_instructions;
    }

    // Weight - from catalog product
    if (catalogProduct?.weight) {
      details.weight = `${catalogProduct.weight} oz`;
    }

    return NextResponse.json({
      success: true,
      details,
    });
  } catch (error: any) {
    console.error("Error fetching product details:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch product details",
        message: error.message || "An error occurred",
      },
      { status: 500 }
    );
  }
}

