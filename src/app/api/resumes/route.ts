import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { resumes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getStorageProvider } from "@/lib/storage";

export const GET = auth(async (req) => {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    const userResumes = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, req.auth.user.id))
      .orderBy(desc(resumes.createdAt));

    return NextResponse.json(userResumes);
  } catch (error) {
    console.error("Failed to fetch resumes:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});

export const DELETE = auth(async (req) => {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Resume ID is required" }, { status: 400 });
    }

    const db = getDb();
    
    // First get the resume to find the storage key
    const [resume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, id))
      .limit(1);

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Verify ownership
    if (resume.userId !== req.auth.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete from storage
    if (resume.fileKey) {
      const storage = getStorageProvider();
      await storage.deleteFile(resume.fileKey);
    }

    // Delete from DB
    await db.delete(resumes).where(eq(resumes.id, id));

    return NextResponse.json({ success: true, message: "Resume deleted" });
  } catch (error) {
    console.error("Failed to delete resume:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
