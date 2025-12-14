import { NextRequest, NextResponse } from "next/server";

/**
 * Get Business Information (Localhost Only)
 * GET /api/business-info
 * 
 * SECURITY: This endpoint only works on localhost for security.
 * Business information is never exposed on production domain.
 */
export async function GET(request: NextRequest) {
  try {
    // SECURITY: Only allow on localhost
    const hostname = request.headers.get("host") || "";
    const isLocalhost = 
      hostname.includes("localhost") || 
      hostname.includes("127.0.0.1") || 
      hostname.startsWith("192.168.") || 
      hostname.startsWith("10.");

    if (!isLocalhost) {
      return NextResponse.json(
        { error: "Access denied. This endpoint is only available on localhost." },
        { status: 403 }
      );
    }

    // Return business information from environment variables
    const businessInfo = {
      ein: process.env.BUSINESS_EIN || "",
      llcName: process.env.LLC_NAME || "",
      llcRegistryNumber: process.env.LLC_REGISTRY_NUMBER || "",
      llcStatus: process.env.LLC_STATUS || "",
      llcNextRenewal: process.env.LLC_NEXT_RENEWAL || "",
      dbaName: process.env.DBA_NAME || "",
      dbaRegistry: process.env.DBA_REGISTRY_NUMBER || "",
      bankName: process.env.BUSINESS_BANK_NAME || "",
      accountNumber: process.env.BUSINESS_ACCOUNT_NUMBER || "",
      routingNumber: process.env.BUSINESS_ROUTING_NUMBER || "",
      accountType: process.env.BUSINESS_ACCOUNT_TYPE || "",
    };

    return NextResponse.json({
      success: true,
      data: businessInfo,
    });
  } catch (error: any) {
    console.error("Error fetching business info:", error);
    return NextResponse.json(
      { error: "Failed to fetch business information", message: error.message },
      { status: 500 }
    );
  }
}
