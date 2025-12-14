import { NextRequest, NextResponse } from "next/server";

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
    if (event.type === "checkout.session.completed" || event.type === "payment_intent.succeeded") {
      const session = event.data.object;
      
      // Extract sale information
      const amount = session.amount_total ? session.amount_total / 100 : 0; // Convert from cents
      const customerEmail = session.customer_email || session.customer_details?.email;
      const orderId = session.id || session.payment_intent;
      
      // Determine product from line items or metadata
      let product = "Pet Portrait";
      if (session.line_items?.data?.[0]?.description) {
        product = session.line_items.data[0].description;
      } else if (session.metadata?.product) {
        product = session.metadata.product;
      }

      // Create sale record
      const sale = {
        id: `stripe-${orderId}`,
        date: new Date().toISOString().split("T")[0],
        amount: amount,
        product: product,
        customerEmail: customerEmail,
        orderId: orderId,
      };

      // In production, save to Supabase database
      // For now, log it (the frontend will sync from Stripe API)
      console.log("✅ Sale automatically tracked from Stripe:", sale);

      // TODO: Save to Supabase database
      // await supabase.from('sales').insert(sale);

      return NextResponse.json({
        success: true,
        message: "Sale tracked successfully",
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









