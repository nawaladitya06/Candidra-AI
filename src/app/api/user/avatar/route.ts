import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getStorageProvider } from "@/lib/storage";

export const POST = auth(async (req) => {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  // Validate size (e.g., max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File must be less than 5MB" }, { status: 400 });
  }

  try {
    const storage = getStorageProvider();
    const path = `avatars/${req.auth.user.id}`;
    
    // Upload file
    const { url } = await storage.uploadFile(file, path);

    // Update user profile in database
    const db = getDb();
    await db.update(users)
      .set({ image: url })
      .where(eq(users.id, req.auth.user.id));
    
    return NextResponse.json({ 
      success: true, 
      url,
      message: "Avatar updated successfully" 
    });
  } catch (error) {
    console.error("Avatar Upload Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
});
