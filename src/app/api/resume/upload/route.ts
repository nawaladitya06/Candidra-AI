import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { resumes } from "@/db/schema";
import { getStorageProvider } from "@/lib/storage";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const storage = getStorageProvider();
    const path = `resumes/${session.user.id}`;
    
    // Upload file
    const { url, key } = await storage.uploadFile(file, path);

    // Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Dynamically require pdf-parse to prevent build-time evaluation errors
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const pdfData = await parser.getText();
    const parsedText = pdfData.text;

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
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
