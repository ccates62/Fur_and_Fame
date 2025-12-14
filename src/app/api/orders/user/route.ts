import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import Stripe from "stripe";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-11-17.clover",
});

/**
 * Get orders for the authenticated user
 * GET /api/orders/user
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user from Supabase using SSR client
    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Ignore cookie setting errors in API routes
          }
        },
      },
    });
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || !user.email) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please sign in to view orders" },
        { status: 401 }
      );
    }

    const userEmail = user.email;

    // Fetch checkout sessions from Stripe for this customer
    // Note: This requires storing customer email in Stripe metadata
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
    });

    // Filter sessions by customer email
    const userOrders = sessions.data
      .filter(
        (session) =>
          session.customer_email?.toLowerCase() === userEmail.toLowerCase() ||
          session.customer_details?.email?.toLowerCase() === userEmail.toLowerCase()
      )
      .map((session) => ({
        id: session.id,
        date: new Date(session.created * 1000).toISOString(),
        amount: (session.amount_total || 0) / 100, // Convert from cents
        product:
          session.line_items?.data?.[0]?.description ||
          session.metadata?.product ||
          "Pet Portrait",
        status: session.payment_status === "paid" ? "completed" : "pending",
        checkoutSessionId: session.id,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      success: true,
      orders: userOrders,
    });
  } catch (error: any) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch orders",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
