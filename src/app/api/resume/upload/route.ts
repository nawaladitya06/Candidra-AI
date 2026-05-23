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

    // Extract text from PDF using Gemini (bypasses Vercel serverless worker issues with pdf-parse)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Dynamically import the Gemini SDK so it doesn't break if not available
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent([
      {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: "application/pdf"
        }
      },
      "Extract all the text from this resume PDF accurately. Ensure all contact info, skills, and experience are preserved. Output ONLY the raw text without any markdown or conversational filler."
    ]);
    
    const parsedText = result.response.text();

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
