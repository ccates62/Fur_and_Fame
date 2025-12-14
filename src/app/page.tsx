import Hero from "@/components/Hero";
import PortraitGallery from "@/components/PortraitGallery";

// DEPLOYMENT: Dec 14 2024 - Fixed Stripe API version and ESLint
export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <PortraitGallery />
    </main>
  );
}
