import { ArrowRight, Sparkles, Lock, Check, Crown } from "lucide-react";
import BgGradient from "./bg-gradient";
import { Button } from "../ui/button";
import Link from "next/link";
import { MotionDiv, MotionP } from "../common/motion-wrapper";

export default function UpgradeRequired() {
  return (
    <div className="relative min-h-[60vh] flex items-center">
      {/* Cathay-themed background gradient */}
      <BgGradient className="from-[#006747]/10 via-[#007A53]/10 to-[#008D5E]/10" />

      {/* Floating decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-[#006747]/20 blur-sm animate-float"></div>
      <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-[#008D5E]/30 blur-sm animate-float-delay"></div>

      <div className="container px-4 py-16">
        <div className="flex flex-col items-center justify-center gap-10 text-center max-w-3xl mx-auto">
          {/* Premium badge */}
          <MotionDiv
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#006747]/10 text-[#006747] border border-[#006747]/20"
          >
            <Crown className="w-5 h-5 fill-amber-500 stroke-[#006747]" />
            <span className="text-sm font-medium uppercase tracking-wider">
              Premium Exclusive
            </span>
          </MotionDiv>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Unlock{" "}
            <span className="bg-gradient-to-r from-[#006747] to-[#008D5E] bg-clip-text text-transparent">
              NeuroDoc
            </span>
          </h1>

          {/* Benefit-focused message */}
          <MotionP
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl leading-8 text-gray-600 max-w-2xl"
          >
            Upgrade to summarise your{" "}
            <span className="font-semibold text-[#006747]">first PDF.</span>
          </MotionP>

          {/* Value pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-6">
            {[
              {
                icon: <Sparkles className="w-5 h-5 text-[#006747]" />,
                text: "Priority processing",
              },
              {
                icon: <Lock className="w-5 h-5 text-[#006747]" />,
                text: "Advanced security",
              },
              {
                icon: <Check className="w-5 h-5 text-[#006747]" />,
                text: "Unlimited access",
              },
            ].map((item, index) => (
              <MotionDiv
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-white border border-[#006747]/10 shadow-sm hover:shadow-md transition-all"
              >
                {item.icon}
                <span className="text-gray-700 font-medium">{item.text}</span>
              </MotionDiv>
            ))}
          </div>

          {/* CTAs with Cathay colors */}
          <MotionDiv
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#006747] to-[#008D5E] hover:from-[#005a3e] hover:to-[#007a53] text-white px-8 py-6 rounded-lg hover:shadow-lg hover:shadow-[#006747]/30 transition-all group"
            >
              <Link href="/#pricing" className="flex gap-2 items-center">
                <span className="group-hover:scale-105 transition-transform">
                  Upgrade Now
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-[#006747]/30 text-[#006747] hover:bg-[#006747]/5 px-8 py-6 rounded-lg transition-all"
            >
              <Link href="/" className="flex gap-2 items-center">
                Explore Features
              </Link>
            </Button>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
}