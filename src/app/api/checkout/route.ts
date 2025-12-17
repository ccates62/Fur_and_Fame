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
    const { 
      product_id, 
      product_name, 
      price, 
      variant_url, 
      variant_id,
      shipping_address, // Optional: shipping address for shipping calculation
      shipping_cost, // Optional: pre-calculated shipping cost
    } = await request.json();

    if (!product_id || !product_name || !price || !variant_url) {
      return NextResponse.json(
        { error: "Missing required fields", message: "product_id, product_name, price, and variant_url are required" },
        { status: 400 }
      );
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    // Build line items based on product
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Single product - include portrait image in Stripe product
      const productDescription = product_id === "blanket" 
        ? "Cozy fleece throw blanket with your pet's AI-generated portrait"
        : product_id === "t-shirt"
        ? "Soft cotton t-shirt featuring your pet's AI-generated portrait"
        : product_id === "poster"
        ? "High-quality poster print of your pet's AI-generated portrait"
        : `Your pet's AI-generated portrait printed on ${product_name.toLowerCase()}`;
      
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product_name,
            description: productDescription,
            images: variant_url ? [variant_url] : undefined, // Show portrait in Stripe checkout
          },
          unit_amount: Math.round(price * 100), // Convert to cents
        },
        quantity: 1,
      });
    }

    // Add shipping as a line item if provided
    if (shipping_cost && shipping_cost > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
            description: "Standard shipping",
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
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"], // Add more countries as needed
      },
      // Enable Stripe Tax for automatic tax calculation
      automatic_tax: {
        enabled: true,
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?cancelled=true`,
      metadata: {
        type: "product_purchase",
        product_id: product_id,
        product_name: product_name,
        variant_url: variant_url,
        variant_id: variant_id || "",
        shipping_cost: shipping_cost ? shipping_cost.toString() : "",
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

