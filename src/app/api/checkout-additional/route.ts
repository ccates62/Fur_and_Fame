import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getBaseUrl } from "@/lib/url-utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

/**
 * Create Stripe checkout session for additional style generation ($0.50)
 * POST /api/checkout-additional
 */
export async function POST(request: NextRequest) {
  try {
    const { style, session_id, fingerprint } = await request.json();

    if (!style || !session_id) {
      return NextResponse.json(
        { error: "Missing required fields", message: "style and session_id are required" },
        { status: 400 }
      );
    }

    // Get origin from request header, or use base URL utility
    const baseUrl = getBaseUrl();
    const origin = request.headers.get("origin") || baseUrl;

    // Create Stripe checkout session for $0.50
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Additional Style Generation: ${style}`,
              description: "Generate 3 variants of your pet in this style",
            },
            unit_amount: 50, // $0.50 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/variants?payment=success&style=${encodeURIComponent(style)}&session_id=${session_id}&checkout_session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/variants?payment=cancelled`,
      metadata: {
        type: "additional_generation",
        style: style,
        session_id: session_id,
        fingerprint: fingerprint || "",
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









