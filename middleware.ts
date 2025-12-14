import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  const hostnameLower = hostname.toLowerCase();

  // Block /accounts route on production domains
  if (pathname.startsWith("/accounts")) {
    const isProduction = 
      hostnameLower.includes("furandfame.com") ||
      hostnameLower.includes("furandfame") ||
      hostnameLower.includes("www.furandfame");
    
    const isLocalhost = 
      hostnameLower === "localhost:3000" ||
      hostnameLower === "127.0.0.1:3000" ||
      hostnameLower.startsWith("localhost:") ||
      hostnameLower.startsWith("127.0.0.1:") ||
      hostnameLower.startsWith("192.168.") ||
      hostnameLower.startsWith("10.");
    
    // Block ALL production domains - no exceptions
    if (isProduction || !isLocalhost) {
      console.error("🚨 MIDDLEWARE BLOCKED: /accounts accessed from:", hostnameLower);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/accounts/:path*",
  ],
};
