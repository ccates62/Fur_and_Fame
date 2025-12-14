import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  
  // Block /accounts route from production domains
  if (pathname.startsWith("/accounts")) {
    // Check if this is a production domain
    const isProduction = 
      hostname === "furandfame.com" ||
      hostname === "www.furandfame.com" ||
      hostname.endsWith(".vercel.app") ||
      hostname.endsWith(".netlify.app");
    
    // Check if this is localhost
    const isLocalhost = 
      hostname === "localhost" ||
      hostname.startsWith("localhost:") ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("127.0.0.1:") ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.0.");
    
    // Block if production, allow only localhost
    if (isProduction || !isLocalhost) {
      console.log(`🚫 Blocked /accounts access from ${hostname}`);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/accounts/:path*",
  ],
};

