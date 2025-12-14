import { NextRequest, NextResponse } from "next/server";

/**
 * API route to track sales
 * POST /api/sales/track
 * 
 * This endpoint records a sale for tracking purposes.
 * Can be called from Stripe webhooks or manually.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, product, customerEmail, orderId } = body;

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Must be greater than 0." },
        { status: 400 }
      );
    }

    if (!product) {
      return NextResponse.json(
        { error: "Product name is required." },
        { status: 400 }
      );
    }

    // Create sale record
    const sale = {
      id: orderId || `sale-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString().split("T")[0],
      amount: parseFloat(amount),
      product: product,
      customerEmail: customerEmail || undefined,
      orderId: orderId || undefined,
    };

    // In production, you would save this to a database (Supabase)
    // For now, we'll return it so the frontend can save to localStorage
    // When Stripe webhooks are set up, this will automatically save to the database

    console.log("✅ Sale tracked:", sale);

    return NextResponse.json({
      success: true,
      message: "Sale tracked successfully",
      sale: sale,
      note: "In production, this will be automatically saved to your database via Stripe webhooks.",
    });
  } catch (error: any) {
    console.error("Error tracking sale:", error);
    return NextResponse.json(
      {
        error: "Failed to track sale",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}









