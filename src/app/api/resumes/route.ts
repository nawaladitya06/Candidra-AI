import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { resumes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    const userResumes = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, session.user.id))
      .orderBy(desc(resumes.createdAt));

    return NextResponse.json(userResumes);
  } catch (error) {
    console.error("Failed to fetch resumes:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
