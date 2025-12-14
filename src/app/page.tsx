import Hero from "@/components/Hero";
import PortraitGallery from "@/components/PortraitGallery";

// DEPLOYMENT: Dec 13 2024 - Pushing to GitHub to trigger Vercel
// This comment ensures we have a new commit on GitHub
export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <PortraitGallery />
    </main>
  );
}
