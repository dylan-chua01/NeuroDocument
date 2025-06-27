import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    // 1. Authenticate user
    const user = await currentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Parse request body
    const { fileUrl, userId, notes } = await req.json();

    // 3. Validate inputs
    if (!fileUrl || typeof fileUrl !== "string") {
      return NextResponse.json({ error: "Invalid file URL" }, { status: 400 });
    }

    if (userId && userId !== user.id) {
      return NextResponse.json({ error: "User ID mismatch" }, { status: 403 });
    }

    // 4. Save or update notes in database
    const result = await db.query(
      `INSERT INTO user_notes (user_id, file_url, notes)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, file_url) 
       DO UPDATE SET notes = $3, updated_at = NOW()
       RETURNING *`,
      [user.id, fileUrl, notes],
    );

    // 5. Return success response
    return NextResponse.json({
      success: true,
      notes: result.rows[0]?.notes,
    });
  } catch (error) {
    console.error("Error saving notes:", error);
    return NextResponse.json(
      {
        error: "Failed to save notes",
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
