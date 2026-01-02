import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

/**
 * Create Stripe checkout session for product purchase
 * POST /api/checkout
 */
export async function POST(request: NextRequest) {
  try {
    const { product_id, product_name, variant_url, price, size, shipping_cost } = await request.json();

    if (!product_id || !product_name || !variant_url || !price) {
      return NextResponse.json(
        { error: "Missing required fields", message: "product_id, product_name, variant_url, and price are required" },
        { status: 400 }
      );
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    // Build line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product_name + (size ? ` (${size})` : ""),
            description: "AI-generated pet portrait",
            images: [variant_url],
          },
          unit_amount: Math.round(price * 100), // Convert to cents
        },
        quantity: 1,
      },
    ];

    // Add shipping as a line item if provided
    if (shipping_cost && shipping_cost > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
            description: "Shipping and handling",
          },
          unit_amount: Math.round(shipping_cost * 100), // Convert to cents
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?cancelled=true`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"], // Add more countries as needed
      },
      automatic_tax: {
        enabled: true, // Stripe automatically calculates tax
      },
      metadata: {
        type: "product_purchase",
        product_id: product_id,
        product_name: product_name,
        variant_url: variant_url,
        size: size || "",
      },
    });

    return NextResponse.json({
      success: true,
      checkout_url: checkoutSession.url,
      session_id: checkoutSession.id,
    });
  } catch (error: any) {
    console.error("Error creating checkout:", error);
    return NextResponse.json(
      { error: "Failed to create checkout", message: error.message },
      { status: 500 }
    );
  }
}
