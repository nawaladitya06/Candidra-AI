import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { users, interviews, resumes } from "@/db/schema";
import { count, avg, eq, sql } from "drizzle-orm";

const ADMIN_EMAILS = ["nawaladitya06@gmail.com"];

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = getDb();

    // Use Drizzle ORM query builder — avoids raw SQL row format issues
    const [totalUsersRow]       = await db.select({ value: count() }).from(users);
    const [totalInterviewsRow]  = await db.select({ value: count() }).from(interviews);
    const [completedRow]        = await db.select({ value: count() }).from(interviews).where(eq(interviews.status, "completed"));
    const [totalResumesRow]     = await db.select({ value: count() }).from(resumes);
    const [freeUsersRow]        = await db.select({ value: count() }).from(users).where(eq(users.plan, "free"));
    const [proUsersRow]         = await db.select({ value: count() }).from(users).where(eq(users.plan, "pro"));
    const [avgScoreRow]         = await db.select({ value: avg(interviews.score) }).from(interviews);

    const recentUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        plan: users.plan,
        interviewsCompleted: users.interviewsCompleted,
      })
      .from(users)
      .orderBy(sql`rowid DESC`)
      .limit(5);

    return NextResponse.json({
      totalUsers:          totalUsersRow?.value      ?? 0,
      totalInterviews:     totalInterviewsRow?.value ?? 0,
      completedInterviews: completedRow?.value       ?? 0,
      totalResumes:        totalResumesRow?.value     ?? 0,
      freeUsers:           freeUsersRow?.value        ?? 0,
      proUsers:            proUsersRow?.value         ?? 0,
      avgScore:            Math.round(Number(avgScoreRow?.value ?? 0)),
      recentUsers,
    });
  } catch (error: any) {
    console.error("Admin Stats Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
