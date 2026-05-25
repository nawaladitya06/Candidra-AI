import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { users, subscriptions } from "@/db/schema";
import crypto from "crypto";
import { eq, sql } from "drizzle-orm";

const ADMIN_EMAILS = ["nawaladitya06@gmail.com"];

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = getDb();
    const allUsers = await db.select().from(users).orderBy(sql`createdAt DESC`);

    return NextResponse.json({ users: allUsers });
  } catch (error: any) {
    console.error("Admin Users API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, name, plan } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const db = getDb();
    
    await db
      .update(users)
      .set({
        name: name !== undefined ? name : undefined,
        plan: plan !== undefined ? plan : undefined,
      })
      .where(eq(users.id, id));
      
    if (plan !== undefined) {
      const existingSub = await db.select().from(subscriptions).where(eq(subscriptions.userId, id)).limit(1);
      if (existingSub.length > 0) {
        await db.update(subscriptions).set({ plan, status: 'active' }).where(eq(subscriptions.userId, id));
      } else {
        await db.insert(subscriptions).values({
          id: crypto.randomUUID(),
          userId: id,
          plan,
          status: 'active',
          createdAt: new Date().toISOString()
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin Users API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const db = getDb();
    
    // SQLite with Drizzle cascade should handle related tables,
    // but just in case, we can manually delete or rely on foreign keys.
    await db.delete(users).where(eq(users.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin Users API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
