import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Razorpay from "razorpay";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, currency = "INR", receipt } = await req.json();

    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Amount must be at least 100 paise" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: amount, 
      currency: currency,
      receipt: receipt || `receipt_${crypto.randomBytes(16).toString("hex")}`,
      notes: {
        userId: session.user.id
      }
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json({ 
      order_id: order.id, 
      amount: order.amount, 
      currency: order.currency 
    });
  } catch (error: any) {
    console.error("Razorpay Create Order Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
