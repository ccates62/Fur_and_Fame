import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  const hostnameLower = hostname.toLowerCase();

  // Block /accounts route on production domains - ABSOLUTE BLOCK
  if (pathname.startsWith("/accounts")) {
    // Check for production domains FIRST - most restrictive
    const isProduction = 
      hostnameLower.includes("furandfame.com") ||
      hostnameLower.includes("furandfame") ||
      hostnameLower === "www.furandfame.com" ||
      hostnameLower === "furandfame.com";
    
    // If production, BLOCK IMMEDIATELY - no exceptions
    if (isProduction) {
      console.error("🚨 MIDDLEWARE BLOCKED PRODUCTION: /accounts accessed from:", hostnameLower);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    // Only allow localhost - block everything else
    const isLocalhost = 
      hostnameLower === "localhost:3000" ||
      hostnameLower === "127.0.0.1:3000" ||
      hostnameLower.startsWith("localhost:") ||
      hostnameLower.startsWith("127.0.0.1:");
    
    // Block ALL non-localhost domains
    if (!isLocalhost) {
      console.error("🚨 MIDDLEWARE BLOCKED NON-LOCALHOST: /accounts accessed from:", hostnameLower);
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
