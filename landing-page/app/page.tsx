import HeroSection from "@/components/HeroSection";
import AboutArchitectSection from "@/components/AboutArchitectSection";
import PhotoStripSection from "@/components/PhotoStripSection";
import MethodSection from "@/components/MethodSection";
import PortfolioSection from "@/components/PortfolioSection";
import ReviewsSection from "@/components/ReviewsSection";
import DoubleFunnelSection from "@/components/DoubleFunnelSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutArchitectSection />
      <PhotoStripSection />
      <MethodSection />
      <PortfolioSection />
      <ReviewsSection />
      <DoubleFunnelSection />
    </main>
  );
}
