import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side security check: Block production domain
  const headersList = await headers();
  const hostname = (headersList.get("host") || "").toLowerCase();
  
  // Block ALL production domains - be very explicit
  const isProduction = 
    hostname.includes("furandfame.com") ||
    hostname.includes("furandfame") ||
    hostname.includes("www.furandfame");
  
  const isLocalhost = 
    hostname === "localhost:3000" || 
    hostname === "127.0.0.1:3000" ||
    hostname.startsWith("localhost:") ||
    hostname.startsWith("127.0.0.1:") ||
    (hostname.startsWith("192.168.") && !isProduction) ||
    (hostname.startsWith("10.") && !isProduction);
  
  // Block ALL production domains and any non-localhost
  if (isProduction || !isLocalhost) {
    console.error("🚨 SERVER-SIDE SECURITY BLOCKED: Business dashboard accessed from:", hostname);
    redirect("/dashboard");
  }
  
  return <>{children}</>;
}
