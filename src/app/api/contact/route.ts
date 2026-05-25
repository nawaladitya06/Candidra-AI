import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { contacts } from "@/db/schema";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = getDb();
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await db.insert(contacts).values({
      id,
      name,
      email,
      message,
      status: "unread",
      createdAt,
    });

    return NextResponse.json({ success: true, message: "Contact saved successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
