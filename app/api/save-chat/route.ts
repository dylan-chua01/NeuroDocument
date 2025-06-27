import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { currentUser } from "@clerk/nextjs/server";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    const { fileUrl, question, answer, sources } = await req.json();

    // Validate inputs
    if (!fileUrl || !question || !answer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Properly format and validate sources
    let formattedSources = [];
    try {
      formattedSources = Array.isArray(sources) ? sources : [];

      // Ensure each source has required fields
      formattedSources = formattedSources.map((source) => ({
        page: source.page || 1,
        content: source.content || "",
        ...source,
      }));
    } catch (e) {
      console.warn("Invalid sources format, using empty array", e);
      formattedSources = [];
    }

    // Insert with proper JSON handling
    const result = await sql`
      INSERT INTO chat_history (
        file_url, 
        question, 
        answer, 
        sources,
        user_id
      )
      VALUES (
        ${fileUrl}, 
        ${question}, 
        ${answer}, 
        ${JSON.stringify(formattedSources)}::jsonb,
        ${user?.id || null}
      )
      RETURNING id;
    `;

    return NextResponse.json({
      success: true,
      chatId: result[0]?.id,
    });
  } catch (error) {
    console.error("Database operation failed:", error);
    return NextResponse.json(
      {
        error: "Failed to save chat",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 },
    );
  }
}
