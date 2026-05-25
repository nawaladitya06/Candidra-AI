import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { sql } from "drizzle-orm";

const ADMIN_EMAILS = ["nawaladitya06@gmail.com"];

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = getDb();

    // Total users
    const usersRes = await db.run(sql`SELECT COUNT(*) as count FROM \`users\``);
    const totalUsers = (usersRes as any).rows?.[0]?.count ?? 0;

    // Total interviews
    const interviewsRes = await db.run(sql`SELECT COUNT(*) as count FROM \`interviews\``);
    const totalInterviews = (interviewsRes as any).rows?.[0]?.count ?? 0;

    // Completed interviews
    const completedRes = await db.run(sql`SELECT COUNT(*) as count FROM \`interviews\` WHERE \`status\` = 'completed'`);
    const completedInterviews = (completedRes as any).rows?.[0]?.count ?? 0;

    // Total resumes uploaded
    const resumesRes = await db.run(sql`SELECT COUNT(*) as count FROM \`resumes\``);
    const totalResumes = (resumesRes as any).rows?.[0]?.count ?? 0;

    // Users by plan
    const freeUsersRes = await db.run(sql`SELECT COUNT(*) as count FROM \`users\` WHERE \`plan\` = 'free'`);
    const proUsersRes = await db.run(sql`SELECT COUNT(*) as count FROM \`users\` WHERE \`plan\` = 'pro'`);
    const freeUsers = (freeUsersRes as any).rows?.[0]?.count ?? 0;
    const proUsers = (proUsersRes as any).rows?.[0]?.count ?? 0;

    // Recent users (last 5)
    const recentUsersRes = await db.run(sql`SELECT \`id\`, \`name\`, \`email\`, \`plan\`, \`interviewsCompleted\` FROM \`users\` ORDER BY \`createdAt\` DESC LIMIT 5`);
    const recentUsers = (recentUsersRes as any).rows ?? [];

    // Average interview score
    const avgScoreRes = await db.run(sql`SELECT AVG(\`score\`) as avg FROM \`interviews\` WHERE \`score\` IS NOT NULL`);
    const avgScore = Math.round((avgScoreRes as any).rows?.[0]?.avg ?? 0);

    return NextResponse.json({
      totalUsers,
      totalInterviews,
      completedInterviews,
      totalResumes,
      freeUsers,
      proUsers,
      recentUsers,
      avgScore,
    });
  } catch (error: any) {
    console.error("Admin Stats Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
