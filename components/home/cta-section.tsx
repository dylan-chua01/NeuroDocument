import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight, Clock, FileText, Brain } from "lucide-react";
import { MotionDiv } from "../common/motion-wrapper";

export default function CTASection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute top-12 left-6 w-24 h-24 rounded-full bg-green-400 blur-xl"></div>
        <div className="absolute bottom-12 right-6 w-32 h-32 rounded-full bg-blue-500 blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-28 h-28 rounded-full bg-purple-400 blur-xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left content area */}
            <div className="md:w-3/5 p-8 md:p-12">
              <MotionDiv
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#006747]/10 text-[#006747] text-sm font-medium mb-6"
              >
                Transform Your Reading Experience
              </MotionDiv>

              <MotionDiv
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-[#006747]">
                  Ready to Save Hours of Reading Time?
                </h2>

                <p className="text-gray-600 text-lg mb-8">
                  Transform lengthy documents into clear, actionable insights
                  with our AI-powered summariser.
                </p>
              </MotionDiv>

              {/* Benefits */}
              <MotionDiv
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#006747]/10 flex items-center justify-center mr-3">
                    <Clock className="h-5 w-5 text-[#006747]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Save Time</h3>
                    <p className="text-sm text-gray-500">
                      Extract key points in seconds
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#006747]/10 flex items-center justify-center mr-3">
                    <FileText className="h-5 w-5 text-[#006747]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Any Document</h3>
                    <p className="text-sm text-gray-500">
                      Works with all PDF document
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#006747]/10 flex items-center justify-center mr-3">
                    <Brain className="h-5 w-5 text-[#006747]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">AI-Powered</h3>
                    <p className="text-sm text-gray-500">
                      Smart insights you can trust
                    </p>
                  </div>
                </div>
              </MotionDiv>

              {/* CTA Button */}
              <MotionDiv
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/#pricing">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-[#006747] to-[#008D5E] hover:shadow-lg hover:shadow-[#006747]/20 text-white px-8 py-6 rounded-lg transition-all duration-300"
                  >
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </MotionDiv>
            </div>

            {/* Right image/illustration area */}
            <div className="md:w-2/5 bg-gradient-to-br from-[#006747]/90 to-[#008D5E] p-8 md:p-12 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <FileText className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  Try it free for 7 days
                </h3>
                <p className="text-white/80 mb-6">
                  No credit card required. Cancel anytime.
                </p>
                <div className="px-4 py-3 bg-white/10 rounded-lg inline-block">
                  <Button>
                    <Link href="/#pricing" className="text-sm font-medium">
                      Join now!
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial or social proof */}
        <div className="mt-8 text-center"></div>
      </div>
    </section>
  );
}