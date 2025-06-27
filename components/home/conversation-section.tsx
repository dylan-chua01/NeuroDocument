"use client";

import { MessageSquareText, FileText, Sparkles } from "lucide-react";

const ChatWithPdfFeature = () => {
  return (
    <section className="w-full bg-gradient-to-b from-white to-emerald-50 py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-700">
            Talk to Your PDF
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Ask questions, get instant answers, and dive deep into your
            documents — like chatting with an expert who&apos;s read it for
            you.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-10">
          {/* Feature Box 1 */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 text-left border border-gray-100 hover:shadow-xl transition-all duration-300">
            <FileText className="text-emerald-500 h-8 w-8 mb-4" />
            <h3 className="text-xl font-semibold text-emerald-800 mb-2">
              Upload Any PDF
            </h3>
            <p className="text-gray-600">
              Just drag and drop — we&apos;ll handle the rest. Your document is
              instantly parsed and ready for chat.
            </p>
          </div>

          {/* Feature Box 2 */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 text-left border border-gray-100 hover:shadow-xl transition-all duration-300">
            <MessageSquareText className="text-emerald-500 h-8 w-8 mb-4" />
            <h3 className="text-xl font-semibold text-emerald-800 mb-2">
              Ask Anything
            </h3>
            <p className="text-gray-600">
              From summaries to details — ask your document anything.
              We&apos;ll give you contextual, accurate answers instantly.
            </p>
          </div>

          {/* Feature Box 3 */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 text-left border border-gray-100 hover:shadow-xl transition-all duration-300">
            <Sparkles className="text-emerald-500 h-8 w-8 mb-4" />
            <h3 className="text-xl font-semibold text-emerald-800 mb-2">
              Smart + Personal
            </h3>
            <p className="text-gray-600">
              Every chat is tailored to your file. Whether it&apos;s legal,
              academic, or business — our assistant adapts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatWithPdfFeature;