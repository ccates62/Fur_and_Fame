import { NextRequest, NextResponse } from "next/server";
import { getOrCreateSession, getClientIP } from "@/lib/generation-tracker";

/**
 * Check existing session and return generation status
 * POST /api/sessions/check
 */
export async function POST(request: NextRequest) {
  try {
    const ipAddress = getClientIP(request);
    const { fingerprint } = await request.json().catch(() => ({}));
    
    const session = await getOrCreateSession(ipAddress, fingerprint);
    
    if (!session) {
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    const remainingFree = Math.max(0, 3 - session.free_generations_used) + session.purchase_bonus_generations;
    const canGenerateFree = session.free_generations_used < 3 || session.purchase_bonus_generations > 0;

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        selected_styles: session.selected_styles,
        generated_styles: session.generated_styles,
        free_generations_used: session.free_generations_used,
        paid_generations_count: session.paid_generations_count,
        purchase_made: session.purchase_made,
        purchase_bonus_generations: session.purchase_bonus_generations,
        can_generate_free: canGenerateFree,
        remaining_free: remainingFree,
        pet_name: session.pet_name,
        breed: session.breed,
        pet_type: session.pet_type,
        photo_url: session.photo_url,
      },
      has_existing_generations: session.generated_styles.length > 0,
    });
  } catch (error: any) {
    console.error("Error checking session:", error);
    return NextResponse.json(
      { error: "Failed to check session", message: error.message },
      { status: 500 }
    );
  }
}











