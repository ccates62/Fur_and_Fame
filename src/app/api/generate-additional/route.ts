import { NextRequest, NextResponse } from "next/server";
import { generatePortraitVariants, GeneratePortraitParams } from "@/lib/fal-client";
import { getSessionById, updateSession } from "@/lib/generation-tracker";

/**
 * Generate additional style (paid generation)
 * POST /api/generate-additional
 * 
 * Requires payment_intent_id from Stripe checkout
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // This endpoint requires payment verification
    if (!body.payment_intent_id && !body.checkout_session_id) {
      return NextResponse.json(
        { error: "Payment required", message: "Please complete payment first" },
        { status: 402 }
      );
    }

    // TODO: Verify payment with Stripe
    // For now, we'll trust the payment_intent_id/checkout_session_id
    // In production, verify with Stripe API:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const payment = await stripe.paymentIntents.retrieve(body.payment_intent_id);
    // if (payment.status !== 'succeeded') {
    //   return NextResponse.json({ error: "Payment not verified" }, { status: 402 });
    // }

    const session = await getSessionById(body.session_id);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Validate style is provided
    if (!body.style) {
      return NextResponse.json(
        { error: "Style required", message: "Please select a style" },
        { status: 400 }
      );
    }

    // Check if style was already generated
    if (session.generated_styles.includes(body.style)) {
      return NextResponse.json(
        { error: "Style already generated", message: "This style has already been generated for this session" },
        { status: 400 }
      );
    }

    // Generate single additional style
    const params: GeneratePortraitParams = {
      petName: body.petName || session.pet_name || "Pet",
      breed: body.breed || session.breed || "Unknown",
      petType: body.petType || session.pet_type || "dog",
      style: body.style,
      extraNotes: body.extraNotes,
      imageUrl: body.imageUrl || session.photo_url || "",
    };

    const variants = await generatePortraitVariants(params);

    // Update session
    const updatedSession = await updateSession(session.id, {
      generated_styles: [...session.generated_styles, body.style],
      paid_generations_count: session.paid_generations_count + 1,
    });

    return NextResponse.json({
      success: true,
      style: body.style,
      variants,
      session_id: session.id,
      paid_generations_count: updatedSession?.paid_generations_count || session.paid_generations_count + 1,
    });
  } catch (error: any) {
    console.error("Error generating additional portrait:", error);
    return NextResponse.json(
      { error: "Failed to generate portrait", message: error.message },
      { status: 500 }
    );
  }
}










