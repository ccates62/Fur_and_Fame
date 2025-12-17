import { NextRequest, NextResponse } from "next/server";
import { PRINTFUL_PRODUCT_MAP, getCatalogIds } from "@/lib/printful-client";

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const PRINTFUL_API_URL = "https://api.printful.com";

/**
 * Get shipping rates from Printful based on recipient address and items
 * POST /api/printful/shipping-rates
 * 
 * Body:
 * {
 *   recipient: {
 *     address1: string,
 *     city: string,
 *     state_code: string,
 *     country_code: string,
 *     zip: string
 *   },
 *   items: [
 *     { product_id: string, quantity: number }
 *   ]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { recipient, items } = await request.json();

    if (!recipient || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields", message: "recipient and items are required" },
        { status: 400 }
      );
    }

    if (!PRINTFUL_API_KEY) {
      return NextResponse.json(
        { error: "Printful API key not configured" },
        { status: 500 }
      );
    }

    // Convert product IDs to Printful catalog variant IDs (shipping API needs catalog IDs, not store IDs)
    const printfulItems = await Promise.all(
      items.map(async (item: { product_id: string; quantity: number }) => {
        const productMap = PRINTFUL_PRODUCT_MAP[item.product_id];
        if (!productMap) {
          throw new Error(`Product ${item.product_id} not found in Printful product map`);
        }
        
        // Get catalog variant ID (numeric) from store variant ID (may be hex string)
        const catalogIds = await getCatalogIds(productMap.productId, productMap.variantId);
        if (!catalogIds) {
          throw new Error(`Could not get catalog IDs for product ${item.product_id}`);
        }
        
        return {
          variant_id: catalogIds.catalogVariantId, // Use catalog variant ID (numeric) for shipping API
          quantity: item.quantity || 1,
        };
      })
    );

    // Call Printful Shipping Rates API
    const response = await fetch(`${PRINTFUL_API_URL}/shipping/rates`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient,
        items: printfulItems,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Printful shipping rates API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to get shipping rates", message: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Printful returns: { code: 200, result: [{ id, name, rate, currency, minDeliveryDays, maxDeliveryDays }] }
    return NextResponse.json({
      success: true,
      shipping_options: data.result || [],
    });
  } catch (error: any) {
    console.error("Error fetching shipping rates:", error);
    return NextResponse.json(
      { error: "Failed to calculate shipping", message: error.message },
      { status: 500 }
    );
  }
}

