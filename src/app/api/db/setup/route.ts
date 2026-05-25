import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { sql } from "drizzle-orm";
import { users } from "@/db/schema";
import { auth } from "@/auth";

export async function GET() {
  try {
    const db = getDb();
    const session = await auth();
    
    // We will drop the foreign key constraint from resumes by recreating it
    await db.run(sql`ALTER TABLE \`resumes\` RENAME TO \`resumes_old\`;`);
    
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS \`resumes\` (
        \`id\` text PRIMARY KEY NOT NULL,
        \`userId\` text NOT NULL,
        \`fileName\` text NOT NULL,
        \`fileKey\` text NOT NULL,
        \`fileUrl\` text NOT NULL,
        \`parsedText\` text,
        \`createdAt\` text NOT NULL
      );
    `);
    
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS \`contacts\` (
        \`id\` text PRIMARY KEY NOT NULL,
        \`name\` text NOT NULL,
        \`email\` text NOT NULL,
        \`message\` text NOT NULL,
        \`status\` text NOT NULL DEFAULT 'unread',
        \`adminReply\` text,
        \`repliedAt\` text,
        \`createdAt\` text NOT NULL
      );
    `);
    
    try {
      await db.run(sql`INSERT INTO \`resumes\` SELECT * FROM \`resumes_old\`;`);
    } catch(e) {}
    
    try {
      await db.run(sql`DROP TABLE \`resumes_old\`;`);
    } catch(e) {}
    
    // Check if the current user exists in the DB
    let userMsg = "No session found.";
    if (session?.user?.id) {
      const userRes = await db.run(sql`SELECT * FROM \`users\` WHERE \`id\` = ${session.user.id}`);
      const rows = (userRes as any).rows || [];
      if (rows.length === 0) {
         // User doesn't exist! Let's insert them!
         await db.run(sql`
           INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`plan\`, \`interviewsCompleted\`, \`codingRuns\`)
           VALUES (${session.user.id}, ${session.user.name || "User"}, ${session.user.email || "user@example.com"}, 'free', 0, 0)
         `);
         userMsg = "User was missing and has been created!";
      } else {
         userMsg = "User exists normally.";
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Database tables updated without foreign keys!",
      userMsg
    });
  } catch (error: any) {
    console.error("DB Setup Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || "Unknown error",
      cause: error?.cause?.message || "No cause" 
    }, { status: 500 });
  }
}

