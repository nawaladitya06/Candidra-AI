import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { resumes } from "@/db/schema";
import { getStorageProvider } from "@/lib/storage";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const POST = auth(async (req) => {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const storage = getStorageProvider();
    const path = `resumes/${req.auth.user.id}`;
    
    // Upload file
    const { url, key } = await storage.uploadFile(file, path);

    // Extract text from PDF using Gemini native vision OCR to avoid Vercel Web Worker crashes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
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
      userId: req.auth.user.id,
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
});
