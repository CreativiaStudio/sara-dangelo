import HeroSection from "@/components/HeroSection";
import AboutArchitectSection from "@/components/AboutArchitectSection";
import MethodSection from "@/components/MethodSection";
import PortfolioSection from "@/components/PortfolioSection";
import ReviewsSection from "@/components/ReviewsSection";
import FAQSection from "@/components/FAQSection";
import DoubleFunnelSection from "@/components/DoubleFunnelSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutArchitectSection />
      <MethodSection />
      <PortfolioSection />
      <ReviewsSection />
      <FAQSection />
      <DoubleFunnelSection />
    </main>
  );
}
