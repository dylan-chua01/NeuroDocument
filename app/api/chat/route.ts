import { NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PromptTemplate } from "@langchain/core/prompts";
import { getVectorStore } from "@/lib/db";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { currentUser } from "@clerk/nextjs/server";
import { checkChatLimit, incrementChatUsage } from "@/lib/user";

const SYSTEM_PROMPT = `
You are an expert document assistant. Provide **clear, concise, and accurate answers** based strictly on the document contents.

Instructions:
- Keep responses under 150 words unless context demands more.
- Use bullet points where appropriate.
- Always cite the document with [p.X] where possible.
- Avoid repetition or generic analysis.

Format:
## Answer
<Concise, factual answer here>

## Source Evidence
- "Quoted text" [p.X]
- ...
`;

export async function POST(req: Request) {
  // 1. Authenticate user
  const user = await currentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2. Parse request body once
  let requestBody;
  try {
    requestBody = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { fileUrl, question, chatHistory = [] } = requestBody;

  // 3. Validate inputs
  if (!fileUrl || typeof fileUrl !== "string") {
    return NextResponse.json(
      { error: "Invalid file URL" },
      { status: 400 },
    );
  }

  if (!question?.trim() || typeof question !== "string") {
    return NextResponse.json(
      { error: "Invalid or missing question" },
      { status: 400 },
    );
  }

  // 4. Check chat limits - now properly enforced
  const limitCheck = await checkChatLimit(user.id, fileUrl);

  if (limitCheck.hasReachedLimit) {
    return NextResponse.json(
      {
        error: `You've reached your limit of ${limitCheck.chatLimit} messages for this document`,
        limit: limitCheck.chatLimit,
        currentUsage: limitCheck.currentUsage,
        upgradeUrl: "/pricing",
      },
      { status: 429 },
    );
  }

  try {
    // 5. Process PDF
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch PDF: ${fileResponse.statusText}`);
    }
    const fileData = await fileResponse.blob();

    // 6. Load and split document
    const loader = new PDFLoader(fileData, {
      splitPages: true,
      parsedItemSeparator: "\n\n",
    });
    const rawDocs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 200,
      separators: ["\n\n", "\n", "  ", " ", ""],
    });

    const docs = await textSplitter.splitDocuments(
      rawDocs.map((doc) => ({
        ...doc,
        metadata: {
          ...doc.metadata,
          pdfInfo: {
            totalPages: rawDocs.length,
            pageNumber: doc.metadata.loc?.pageNumber,
          },
        },
      })),
    );

    // 7. Vector store operations
    const vectorStore = await getVectorStore(fileUrl);
    await vectorStore.addDocuments(docs);

    const retriever = vectorStore.asRetriever({
      k: 3,
      searchType: "mmr",
      searchKwargs: {
        fetchK: 10,
        lambda: 0.5,
      },
    });

    // 8. Initialize Gemini
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      maxOutputTokens: 2048,
      temperature: 0.1,
      topP: 0.95,
      topK: 40,
      apiKey: process.env.GEMINI_API_KEY!,
    });

    // 9. Create QA chain with enhanced prompt
    const chain = ConversationalRetrievalQAChain.fromLLM(model, retriever, {
      returnSourceDocuments: true,
      qaChainOptions: {
        type: "stuff",
        prompt: new PromptTemplate({
          template: `${SYSTEM_PROMPT}
            
            Context:
            {context}
            
            Question: {question}
            
            Detailed Answer:`,
          inputVariables: ["context", "question"],
        }),
      },
      questionGeneratorChainOptions: {
        template: `Given this conversation and a follow up question:
            Chat History: {chat_history}
            Follow Up Input: {question}
            Standalone Question (include all key details):`,
      },
    });

    // 10. Format chat history
    const formattedHistory = chatHistory
      .map((msg: string, i: number) => [
        new HumanMessage(msg),
        new AIMessage(chatHistory[i + 1] || ""),
      ])
      .flat()
      .slice(0, -1);

    // 11. Get answer with retries
    const MAX_RETRIES = 2;
    let retries = 0;
    let response;

    while (retries <= MAX_RETRIES) {
      try {
        response = await chain.call({
          question: question.trim(),
          chat_history: formattedHistory,
        });
        break;
      } catch (error) {
        if (retries === MAX_RETRIES) throw error;
        retries++;
        await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
      }
    }

    // 12. Process answer
    const processAnswer = (text: string, sources: any[]) => {
      sources.forEach((doc) => {
        const page = doc.metadata.pdfInfo?.pageNumber;
        if (page) {
          const quote = doc.pageContent.substring(0, 100).trim();
          if (text.includes(quote)) {
            const safeQuote = quote.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            text = text.replace(
              new RegExp(safeQuote, "i"),
              `${quote} [p.${page}]`,
            );
          }
        }
      });

      if (text.length > 300) {
        const keyPoints = text
          .split("\n")
          .filter((line) =>
            line.match(/important|key|essential|note|summary/i),
          )
          .map((line) => `- ${line.replace(/\[p\.\d+\]/g, "").trim()}`)
          .slice(0, 5);

        if (keyPoints.length > 1) {
          text = `## Comprehensive Answer\n${text}\n\n### Key Takeaways\n${keyPoints.join("\n")}`;
        }
      }

      return text;
    };

    const processedAnswer = processAnswer(
      response.text,
      response.sourceDocuments,
    );

    // 13. Format sources
    const formattedSources = response.sourceDocuments.map((doc: any) => ({
      page: doc.metadata.pdfInfo?.pageNumber || 1,
      content:
        doc.pageContent
          .split("\n")
          .filter((line: string) => line.trim().length > 0)
          .slice(0, 3)
          .join(" ") + "...",
    }));

    // 14. Track successful chat usage
    await incrementChatUsage(user.id, fileUrl);

    // 15. Return response with usage information
    return NextResponse.json({
      answer: processedAnswer,
      sources: formattedSources,
      suggestedQuestions: generateFollowUps(question, processedAnswer),
      usage: limitCheck.currentUsage + 1,
      remaining: limitCheck.chatLimit - (limitCheck.currentUsage + 1),
    });
  } catch (error) {
    console.error("API error:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: "Failed to process question",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
        suggestion:
          "Try rephrasing your question or check the document format",
      },
      { status: 500 },
    );
  }
}

// Helper function
function generateFollowUps(question: string, answer: string): string[] {
  const questionTypes = [
    "Can you explain more about [key concept]?",
    "What are the implications of [point]?",
    "How does this compare to [related topic]?",
    "Are there any exceptions to [rule]?",
  ];

  const keyTerms =
    answer.match(/(?:\[p\.\d+\]|"([^"]+)"|'([^']+)'|`([^`]+)`)/g) || [];
  const uniqueTerms = [
    ...new Set(keyTerms.map((term) => term.replace(/\[p\.\d+\]|["'`]/g, ""))),
  ];

  return questionTypes
    .map((q) =>
      uniqueTerms.length > 0
        ? q.replace(
            /\[.*?\]/,
            uniqueTerms[Math.floor(Math.random() * uniqueTerms.length)],
          )
        : q,
    )
    .slice(0, 3);
}