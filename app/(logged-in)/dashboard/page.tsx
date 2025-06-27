import BgGradient from "@/components/common/bg-gradient";
import { Button } from "@/components/ui/button";
import EmptySummaryState from "@/components/upload/summaries/empty-summary-state";
import { SummaryCard } from "@/components/upload/summaries/summary-card";
import { getSummaries } from "@/lib/summaries";
import { hasReachedUploadLimit } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowRight, Plus, FileText, Info, Filter } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MotionDiv } from "@/components/common/motion-wrapper";

export default async function DashboardPage() {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) return redirect("/sign-in");

  const { hasReachedLimit, uploadLimit } = await hasReachedUploadLimit(userId);
  const summaries = await getSummaries(userId);

  return (
    <main className="min-h-screen pb-16">
      {/* Background with subtle gradient */}
      <BgGradient className="from-[#006747]/5 via-white to-gray-50" />

      {/* Header Section */}
      <div className="relative py-12 mb-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <MotionDiv
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#006747]/10 text-[#006747] text-xs font-medium mb-3">
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                Dashboard
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-2">
                Your Summaries
              </h1>
              <p className="text-gray-600">
                Transform your documents into concise, actionable insights for
                better productivity
              </p>
            </MotionDiv>

            {!hasReachedLimit && (
              <MotionDiv
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#006747] to-[#008D5E] hover:shadow-lg hover:shadow-[#006747]/20 text-white transition-all duration-300 group"
                >
                  <Link href="/upload" className="flex items-center text-white">
                    <Plus className="w-5 h-5 mr-2" />
                    New Summary
                  </Link>
                </Button>
              </MotionDiv>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {/* Upload Limit Warning */}
        {hasReachedLimit && (
          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex items-start gap-4">
              <div className="flex-shrink-0">
                <Info className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-medium text-amber-800 mb-1">
                  Upload Limit Reached
                </h3>
                <p className="text-sm text-amber-700">
                  You&apos;ve reached the limit of {uploadLimit} uploads on the
                  Basic plan.
                </p>
                <Link
                  href="/#pricing"
                  className="mt-3 inline-flex items-center text-sm font-medium text-[#006747] hover:text-[#008D5E] transition-colors"
                >
                  Upgrade to Pro for unlimited uploads
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </div>
            </div>
          </MotionDiv>
        )}

        {/* Summaries Grid */}
        {summaries.length === 0 ? (
          <EmptySummaryState />
        ) : (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {summaries.map((summary, index) => (
                <MotionDiv
                  key={summary.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * (index % 3) }}
                >
                  <SummaryCard summary={summary} />
                </MotionDiv>
              ))}
            </div>
          </MotionDiv>
        )}

        {/* Pagination (if needed) */}
        {summaries.length > 9 && (
          <div className="mt-10 flex justify-center">
            <nav className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="w-8 h-8 p-0"
              >
                &lt;
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0 bg-[#006747]/10 text-[#006747] border-[#006747]/20"
              >
                1
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                2
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                3
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                &gt;
              </Button>
            </nav>
          </div>
        )}
      </div>
    </main>
  );
}