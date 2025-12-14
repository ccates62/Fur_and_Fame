import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ABSOLUTE BLOCK: Business accounts ONLY on localhost - NO EXCEPTIONS
  const headersList = await headers();
  const hostname = (headersList.get("host") || "").toLowerCase();
  
  // ONLY allow localhost - block EVERYTHING else (including production)
  const isLocalhost = 
    hostname === "localhost:3000" || 
    hostname === "127.0.0.1:3000" ||
    hostname.startsWith("localhost:") ||
    hostname.startsWith("127.0.0.1:");
  
  // If NOT localhost, BLOCK IMMEDIATELY
  if (!isLocalhost) {
    console.error("🚨 LAYOUT BLOCKED: Business accounts accessed from production:", hostname);
    redirect("/dashboard");
  }
  
  return <>{children}</>;
}
