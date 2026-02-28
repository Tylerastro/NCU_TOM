import BackgroundEffects from "@/components/landing/BackgroundEffects";
import { HeroSection } from "@/components/landing/HeroSection";
import { Footer } from "@/components/landing/Footer";

export default async function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#030712]">
      {/* Background layers (contains client component StarField) */}
      <BackgroundEffects backgroundImage="/Dalle-observatory.png" />

      {/* Content */}
      <div className="relative z-10 pt-24 pb-16 px-6 sm:px-8 lg:px-12">
        <HeroSection />
        {/* <StatsSection /> */}
        {/* <FeaturesSection /> */}
        <Footer />
      </div>
    </main>
  );
}
