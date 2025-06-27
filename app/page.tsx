import BgGradient from "@/components/common/bg-gradient";
import HowItWorksSection from "@/components/home/how-it-works-section";
import HeroSection from "@/components/home/hero-section";
import PricingSection from "@/components/home/pricing-section";
import CTASection from "@/components/home/cta-section";
import { UseCasesSection } from "@/components/home/use-case-section";
import ChatWithPdfFeature from "@/components/home/conversation-section";
import QuizPromoSection from "@/components/home/quiz-section";

export default function Home() {
  return (
    <div className="relative w-full">
      <BgGradient />
      <div className="flex flex-col">
        <HeroSection />
        <HowItWorksSection />
        <ChatWithPdfFeature />
        <QuizPromoSection />
        <UseCasesSection />
        <PricingSection />
        <CTASection />
      </div>
    </div>
  );
}