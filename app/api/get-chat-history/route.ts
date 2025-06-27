import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fileUrl } = await req.json();

  if (!fileUrl) {
    return NextResponse.json({ error: "Missing fileUrl" }, { status: 400 });
  }

  try {
    const result = await db.query(
      `SELECT question, answer, created_at 
       FROM chat_history 
       WHERE user_id = $1 AND file_url = $2 
       ORDER BY created_at ASC`,
      [user.id, fileUrl]
    );

    return NextResponse.json({ history: result.rows });
  } catch (err) {
    console.error("Error fetching chat history:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
