import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";
import { generateQuestions } from "@/lib/geminiai";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Await the params since they're now a Promise in newer Next.js versions
    const { id } = await params;

    const sql = await getDbConnection();
    const [summary] = await sql`
      SELECT title, summary_text FROM pdf_summaries WHERE id = ${id}
    `;

    if (!summary) {
      return NextResponse.json({ error: "Summary not found" }, { status: 404 });
    }

    // Generate questions with better error handling
    let questions;
    try {
      questions = await generateQuestions(summary.summary_text);
    } catch (error) {
      console.error("Error generating questions:", error);
      return NextResponse.json(
        { error: "Failed to generate quiz questions. Please try again." },
        { status: 500 },
      );
    }

    // Validate questions before returning
    const validQuestions = questions.filter(
      (q) =>
        // @ts-expect-error because it works well
        q.question &&
        // @ts-expect-error because it works well
        q.question.trim() !== "" &&
        // @ts-expect-error
        q.answer &&
        // @ts-expect-error because it works well
        q.answer.trim() !== "",
    );

    if (validQuestions.length === 0) {
      return NextResponse.json(
        { error: "No valid questions could be generated from this summary." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      questions: validQuestions,
      summaryTitle: summary.title || "Untitled Summary",
    });
  } catch (error) {
    console.error("Error in quiz API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
