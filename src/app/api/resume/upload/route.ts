import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { resumes } from "@/db/schema";
import { getStorageProvider } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";

export const runtime = "edge";

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
    // Get the storage provider (will fallback to local if BUCKET is missing)
    const storage = getStorageProvider((process.env as any));
    const path = `resumes/${session.user.id}`;
    
    const { url, key } = await storage.uploadFile(file, path);

    // Save metadata to D1 (Persistence)
    const db = getDb();
    await db.insert(resumes).values({
      id: uuidv4(),
      userId: session.user.id,
      fileName: file.name,
      fileKey: key,
      fileUrl: url,
      createdAt: new Date().toISOString(),
    });
    
    return NextResponse.json({ 
      success: true, 
      fileKey: key,
      fileUrl: url,
      message: "Resume uploaded successfully" 
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
