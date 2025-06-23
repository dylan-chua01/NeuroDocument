import BgGradient from "@/components/common/bg-gradient";
import ChatSidebar from "@/components/common/chat-side-bar";
import NotesSection from "@/components/common/notes";
import { SourceInfo } from "@/components/upload/summaries/source-info";
import { SummaryHeader } from "@/components/upload/summaries/summary-header";
import { SummaryViewer } from "@/components/upload/summaries/summary-viewer";
import { getSummaryById } from "@/lib/summaries";
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { ArrowRightCircle, BookOpen, Brain } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function SummaryPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const { id } = params;
  const summary = await getSummaryById(id);
  const user = await currentUser();
  
  if (!summary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Summary not found</h2>
          <p className="text-gray-600">The requested summary could not be located.</p>
        </div>
      </div>
    );
  }

  const { 
    title, 
    summary_text, 
    file_name, 
    word_count, 
    created_at, 
    original_file_url,
  } = summary;

  const readingTime = Math.ceil((word_count || 0) / 200);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Enhanced background with multiple gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-teal-600/5"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent"></div>
      <BgGradient className="from-[#006747]/10 via-[#007A53]/8 to-[#008D5E]/5" />
      
      <div className="relative container mx-auto px-4 py-8 md:py-12 flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Main Content - Left Column */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Summary Content Card */}
          <div className="relative overflow-hidden group">
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
            
            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 md:p-10 hover:shadow-2xl transition-all duration-300">
              {/* Header with enhanced styling */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10 rounded-xl -m-2"></div>
                <div className="relative">
                  <SummaryHeader 
                    title={title} 
                    //@ts-ignore created_at is already a variable
                    createdAt={created_at} 
                    readingTime={readingTime} 
                  />
                </div>
              </div>
              
              {/* Source Info Section */}
              {file_name && (
                <div className="mb-8">
                  <div className="relative overflow-hidden group/source">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-xl"></div>
                    <div className="relative p-6 border border-gray-100/50 rounded-xl bg-white/60 backdrop-blur-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <SourceInfo  
                            title={title}
                            summaryText={summary_text}
                            fileName={file_name}
                            createdAt={created_at}
                            originalFileUrl={original_file_url}
                          />
                        </div>
                        
                        {/* Quiz Button */}
                        {original_file_url && (
                          <div className="transition-all duration-300 transform translate-y-2">
                            <Button
                              asChild
                              className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transition-all duration-200 rounded-xl px-4 py-2 text-sm font-medium border-0 group/button"
                            >
                              <Link href={`${summary.id}/quiz`}>
                                {/* Animated background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 transition-opacity duration-200"></div>
                                
                                <div className="relative flex items-center gap-2">
                                  <Brain className="w-4 h-4" />
                                  <span>Test Knowledge</span>
                                  <ArrowRightCircle className="w-4 h-4 transition-transform" />
                                </div>
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Summary Content */}
              <div className="relative">
                {/* Content header */}
                <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white shadow-lg">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Document Summary</h3>
                      <p className="text-sm text-gray-600">AI-generated insights and key points</p>
                    </div>
                  </div>
                </div>

                <Suspense fallback={
                  <div className="h-64 w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <div className="text-gray-600 font-medium">Loading summary...</div>
                      <div className="text-sm text-gray-500 mt-1">Processing document content</div>
                    </div>
                  </div>
                }>
                  <div className="prose-enhanced">
                    <SummaryViewer summary={summary_text} />
                  </div>
                </Suspense>
              </div>
            </div>
          </div>

          {/* Notes Section Card */}
          <div className="relative overflow-hidden group">
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
            
            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
              {/* Notes header */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                
                <div className="relative p-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Personal Notes</h3>
                      <p className="text-white/80 text-sm">Add your thoughts and insights</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 text-sm text-white/70">
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Rich editing</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                      <span>Auto-save</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes content */}
              <div className="p-6">
                <NotesSection 
                  fileUrl={original_file_url} 
                  userId={user?.id}
                  className="min-h-[350px] bg-gray-50/30 rounded-xl border border-gray-100/50" 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat Sidebar - Right Column */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="sticky top-6">
            {/* Enhanced container with gradient border */}
            <div className="relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
              
              <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden hover:shadow-3xl transition-all duration-300">
                <ChatSidebar 
                  fileUrl={original_file_url} 
                  userId={user?.id}
                  //@ts-ignore it is already defined
                  className="h-[650px]" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements for visual enhancement */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="fixed bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-teal-400/10 to-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
}