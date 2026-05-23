import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { interviews } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const GET = auth(async (req) => {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    const userInterviews = await db
      .select()
      .from(interviews)
      .where(eq(interviews.userId, req.auth.user.id))
      .orderBy(desc(interviews.createdAt));

    return NextResponse.json(userInterviews);
  } catch (error) {
    console.error("Failed to fetch interviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});

export const DELETE = auth(async (req) => {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Interview ID is required" }, { status: 400 });
    }

    const db = getDb();
    await db
      .delete(interviews)
      .where(
        eq(interviews.id, id)
      );

    return NextResponse.json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    console.error("Failed to delete interview:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
