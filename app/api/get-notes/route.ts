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
    const { fileUrl, userId } = await req.json();

    // 3. Validate inputs
    if (!fileUrl || typeof fileUrl !== "string") {
      return NextResponse.json({ error: "Invalid file URL" }, { status: 400 });
    }

    if (userId && userId !== user.id) {
      return NextResponse.json({ error: "User ID mismatch" }, { status: 403 });
    }

    // 4. Fetch notes from database
    const result = await db.query(
      `SELECT notes FROM user_notes 
       WHERE user_id = $1 AND file_url = $2`,
      [user.id, fileUrl],
    );

    // 5. Return notes (empty string if none exist)
    return NextResponse.json({
      notes: result.rows[0]?.notes || "",
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch notes",
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
