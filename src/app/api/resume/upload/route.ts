import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { resumes } from "@/db/schema";
import { getStorageProvider } from "@/lib/storage";

export async function POST(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    console.error("[Upload API] 401 Unauthorized - No session found", session);
    return NextResponse.json({ error: "Unauthorized", sessionDebug: session }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const parsedText = formData.get("parsedText") as string;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  
  if (!parsedText) {
    return NextResponse.json({ error: "No parsed text provided" }, { status: 400 });
  }

  try {
    const storage = getStorageProvider();
    const path = `resumes/${session.user.id}`;
    
    // Upload file
    const { url, key } = await storage.uploadFile(file, path);

    // The text has already been parsed on the client-side using pdfjs-dist.
    // This bypasses Vercel server timeouts and 1MB size limits.

    // Save metadata to D1
    const db = getDb();
    await db.insert(resumes).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      fileName: file.name,
      fileKey: key,
      fileUrl: url,
      parsedText: parsedText,
      createdAt: new Date().toISOString(),
    });
    
    return NextResponse.json({ 
      success: true, 
      fileKey: key,
      fileUrl: url,
      parsedText: parsedText,
      message: "Resume uploaded and parsed successfully" 
    });
  } catch (error: any) {
    console.error("Upload Error:", error);
    let msg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
    
    // We need to truncate it so the actual error reason is visible.
    if (msg.length > 500) {
      msg = msg.substring(0, 150) + "... [truncated] ..." + msg.substring(msg.length - 150);
    }
    
    let causeStr = "";
    if (error.cause) {
      causeStr = " | CAUSE: " + (error.cause?.message || JSON.stringify(error.cause));
    }
    
    return NextResponse.json({ error: `Upload Error: ${msg}${causeStr}`, sessionDebug: session }, { status: 500 });
  }
}
