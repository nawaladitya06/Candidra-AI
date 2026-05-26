import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { subscriptions, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import crypto from "crypto";

const ADMIN_EMAILS = ["nawaladitya06@gmail.com"];

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = getDb();
    
    // Using raw SQL for the join since drizzle raw/proxy can sometimes struggle with complex joined typed queries depending on setup
    const result = await db.run(sql`
      SELECT 
        s.id, s.userId, s.plan, s.status, s.currentPeriodEnd, s.createdAt,
        u.name as userName, u.email as userEmail 
      FROM subscriptions s
      LEFT JOIN users u ON s.userId = u.id
      ORDER BY s.createdAt DESC
    `);
    
    // Map D1 raw results to array of objects
    let allSubscriptions = [];
    if ((result as any).rows) {
       allSubscriptions = (result as any).rows;
    } else if (Array.isArray(result)) {
       allSubscriptions = result;
    } else if ((result as any).results && (result as any).results.rows) {
       const cols = (result as any).results.columns;
       allSubscriptions = (result as any).results.rows.map((row: any[]) => {
         let obj: any = {};
         cols.forEach((col: string, i: number) => {
           obj[col] = row[i];
         });
         return obj;
       });
    } else {
       allSubscriptions = result as any;
    }

    return NextResponse.json({ subscriptions: allSubscriptions });
  } catch (error: any) {
    console.error("Admin Billing API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, plan, status, daysValid } = await req.json();

    if (!userId || !plan || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = getDb();
    
    // Check if subscription already exists for user
    const existing = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
    
    let currentPeriodEnd: Date | null = null;
    if (daysValid && parseInt(daysValid) > 0) {
       currentPeriodEnd = new Date(Date.now() + (parseInt(daysValid) * 24 * 60 * 60 * 1000));
    }

    // D1 integer timestamp columns need a Date object; drizzle handles the conversion
    // but we must make sure null is passed explicitly when no expiry is set
    if (existing.length > 0) {
      await db.update(subscriptions)
        .set({ plan, status, currentPeriodEnd: currentPeriodEnd ?? null })
        .where(eq(subscriptions.userId, userId));
    } else {
      await db.insert(subscriptions).values({
        id: crypto.randomUUID(),
        userId,
        plan,
        status,
        currentPeriodEnd: currentPeriodEnd ?? null,
        createdAt: new Date().toISOString()
      });
    }

    // Sync with users table
    await db.update(users).set({ plan }).where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin Billing API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, plan, status, currentPeriodEnd } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 });
    }

    const db = getDb();
    
    let parsedDate: Date | undefined;
    if (currentPeriodEnd) {
       parsedDate = new Date(currentPeriodEnd);
    }
    
    await db.update(subscriptions)
      .set({ 
        ...(plan && { plan }), 
        ...(status && { status }), 
        ...(parsedDate !== undefined && { currentPeriodEnd: parsedDate }) 
      })
      .where(eq(subscriptions.id, id));

    // If plan was updated, we need to sync it to the user. Fetch the user ID first.
    if (plan) {
      const sub = await db.select().from(subscriptions).where(eq(subscriptions.id, id)).limit(1);
      if (sub[0]) {
         await db.update(users).set({ plan }).where(eq(users.id, sub[0].userId));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin Billing API error:", error);
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
      return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 });
    }

    const db = getDb();
    
    const sub = await db.select().from(subscriptions).where(eq(subscriptions.id, id)).limit(1);
    if (sub[0]) {
       // Reset user plan to free
       await db.update(users).set({ plan: 'free' }).where(eq(users.id, sub[0].userId));
    }
    
    await db.delete(subscriptions).where(eq(subscriptions.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin Billing API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
