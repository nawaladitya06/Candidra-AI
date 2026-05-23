import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { codingSubmissions } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    const submissions = await db
      .select()
      .from(codingSubmissions)
      .where(
        and(
          eq(codingSubmissions.userId, session.user.id),
          eq(codingSubmissions.status, "passed")
        )
      );

    const totalPoints = submissions.length * 100;

    return NextResponse.json({
      success: true,
      totalPoints,
      submissionsCount: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error("Failed to fetch coding submissions/points:", error);
    return NextResponse.json({ error: "Failed to fetch points" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { language, code, status, runtime, memory, score } = await req.json();

    const db = getDb();
    await db.insert(codingSubmissions).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      language,
      code,
      status,
      runtime,
      memory,
      score,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Submission saved successfully" });
  } catch (error) {
    console.error("Submission Error:", error);
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }
}
