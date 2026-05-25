import { NextResponse } from "next/server";
import { auth } from "@/auth";
import crypto from "crypto";
import { getDb } from "@/db";
import { subscriptions, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing verification parameters" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Payment is valid! Upgrade the user to 'pro'
    const db = getDb();
    
    // Check if user already has a subscription
    const existing = await db.select().from(subscriptions).where(eq(subscriptions.userId, session.user.id)).limit(1);
    
    // Valid for 30 days
    const currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (existing.length > 0) {
      await db.update(subscriptions)
        .set({ 
          plan: "pro", 
          status: "active", 
          currentPeriodEnd 
        })
        .where(eq(subscriptions.userId, session.user.id));
    } else {
      await db.insert(subscriptions).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        plan: "pro",
        status: "active",
        currentPeriodEnd,
        createdAt: new Date().toISOString()
      });
    }

    // Update user plan
    await db.update(users).set({ plan: "pro" }).where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true, message: "Payment verified successfully" });
  } catch (error: any) {
    console.error("Razorpay Verify Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
