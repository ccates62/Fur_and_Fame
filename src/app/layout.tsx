import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Fur & Fame - Turn Your Pet Into a Legend",
  description:
    "Transform your pet into a masterpiece with AI-powered portraits. Choose from 20+ styles including Renaissance Royal, Disney Pixar, Marvel Superhero, and more. Museum-quality prints delivered to your door.",
  keywords: [
    "AI pet portraits",
    "pet art",
    "custom pet portraits",
    "AI-generated pet art",
    "pet canvas prints",
    "Fur and Fame",
  ],
  openGraph: {
    title: "Fur & Fame - Turn Your Pet Into a Legend",
    description:
      "Royal portraits, superhero poses, Disney magic – instantly. Transform your pet with AI-powered portraits.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        {googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

