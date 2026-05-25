import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const db = getDb();
    
    // Create resumes table if it doesn't exist
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS \`resumes\` (
        \`id\` text PRIMARY KEY NOT NULL,
        \`userId\` text NOT NULL,
        \`fileName\` text NOT NULL,
        \`fileKey\` text NOT NULL,
        \`fileUrl\` text NOT NULL,
        \`parsedText\` text,
        \`createdAt\` text NOT NULL,
        FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
      );
    `);

    // Just in case, try adding missing columns if the table already existed but was outdated
    try {
      await db.run(sql`ALTER TABLE \`resumes\` ADD COLUMN \`parsedText\` text;`);
    } catch (e) {
      // Column might already exist, ignore error
    }

    return NextResponse.json({ success: true, message: "Database tables created/verified successfully!" });
  } catch (error: any) {
    console.error("DB Setup Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || "Unknown error",
      cause: error?.cause?.message || "No cause" 
    }, { status: 500 });
  }
}
