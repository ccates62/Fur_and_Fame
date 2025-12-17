import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createPrintfulOrder, PRINTFUL_PRODUCT_MAP, type PrintfulOrderData } from "@/lib/printful-client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

/**
 * Stripe Webhook Handler
 * POST /api/stripe/webhook
 * 
 * This endpoint receives Stripe webhook events and automatically tracks sales.
 * Configure this URL in your Stripe dashboard webhook settings.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = body;

    // Handle successful payment events
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      
      // Expand session to get full details including shipping address
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items', 'customer', 'shipping_details'],
      });
      
      // Extract sale information
      const amount = fullSession.amount_total ? fullSession.amount_total / 100 : 0; // Convert from cents
      const customerEmail = fullSession.customer_email || fullSession.customer_details?.email;
      const orderId = fullSession.id;
      
      // Get product info from metadata
      const productId = fullSession.metadata?.product_id || "";
      const variantUrl = fullSession.metadata?.variant_url || "";
      const productName = fullSession.metadata?.product_name || "Pet Portrait";
      
      // Create sale record
      const sale = {
        id: `stripe-${orderId}`,
        date: new Date().toISOString().split("T")[0],
        amount: amount,
        product: productName,
        customerEmail: customerEmail,
        orderId: orderId,
      };

      console.log("✅ Sale automatically tracked from Stripe:", sale);

      // Create Printful order if product is configured and shipping address exists
      if (productId && variantUrl && fullSession.shipping_details?.address) {
        const productMap = PRINTFUL_PRODUCT_MAP[productId];
        
        if (productMap && fullSession.shipping_details.address) {
          const shipping = fullSession.shipping_details;
          const address = shipping.address;
          
          // Prepare Printful order data
          const printfulOrderData: PrintfulOrderData = {
            recipient: {
              name: shipping.name || fullSession.customer_details?.name || "Customer",
              address1: address.line1 || "",
              address2: address.line2 || undefined,
              city: address.city || "",
              state_code: address.state || "",
              country_code: address.country || "US",
              zip: address.postal_code || "",
              phone: fullSession.customer_details?.phone || undefined,
              email: customerEmail || undefined,
            },
            items: [
              {
                variant_id: productMap.variantId,
                quantity: 1,
                files: [
                  {
                    type: "default",
                    url: variantUrl, // The AI-generated portrait image URL
                  },
                ],
              },
            ],
            external_id: orderId, // Link to Stripe order
          };

          // All products are handled the same way now (no bundles)

          // Create Printful order
          const printfulResult = await createPrintfulOrder(printfulOrderData);
          
          if (printfulResult) {
            console.log("✅ Printful order created:", printfulResult);
          } else {
            console.error("❌ Failed to create Printful order");
          }
        } else {
          console.warn(`⚠️ Product ${productId} not mapped in PRINTFUL_PRODUCT_MAP or missing shipping address`);
        }
      }

      // TODO: Save to Supabase database
      // await supabase.from('sales').insert(sale);

      return NextResponse.json({
        success: true,
        message: "Sale tracked and Printful order created",
        sale: sale,
      });
    }

    // Handle other events (subscriptions, refunds, etc.)
    return NextResponse.json({
      success: true,
      message: "Webhook received",
      event: event.type,
    });
  } catch (error: any) {
    console.error("Error processing Stripe webhook:", error);
    return NextResponse.json(
      {
        error: "Failed to process webhook",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}









