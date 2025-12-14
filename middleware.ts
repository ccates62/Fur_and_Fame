import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  const hostnameLower = hostname.toLowerCase();

  // ABSOLUTE BLOCK: /accounts is ONLY for localhost - NO EXCEPTIONS
  if (pathname.startsWith("/accounts")) {
    // ONLY allow localhost - block EVERYTHING else
    const isLocalhost = 
      hostnameLower === "localhost:3000" ||
      hostnameLower === "127.0.0.1:3000" ||
      hostnameLower.startsWith("localhost:") ||
      hostnameLower.startsWith("127.0.0.1:");
    
    // If NOT localhost, BLOCK IMMEDIATELY - redirect to dashboard
    if (!isLocalhost) {
      console.error("🚨 MIDDLEWARE BLOCKED: /accounts accessed from production:", hostnameLower);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/accounts/:path*",
    "/accounts",
  ],
};
