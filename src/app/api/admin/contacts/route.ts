import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { contacts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

const ADMIN_EMAILS = ["nawaladitya06@gmail.com"];

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = getDb();
    const allContacts = await db.select().from(contacts).orderBy(sql`createdAt DESC`);

    return NextResponse.json({ contacts: allContacts });
  } catch (error: any) {
    console.error("Admin Contacts API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, status, adminReply } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Contact ID is required" }, { status: 400 });
    }

    const db = getDb();
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (adminReply !== undefined) {
      updateData.adminReply = adminReply;
      updateData.repliedAt = new Date().toISOString();
      updateData.status = "replied"; // Auto-update status to replied
    }
    
    await db
      .update(contacts)
      .set(updateData)
      .where(eq(contacts.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin Contacts API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
