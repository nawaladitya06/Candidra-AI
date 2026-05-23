import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { interviews, questions } from "@/db/schema";
import { eq } from "drizzle-orm";

export const POST = auth(async (req) => {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const db = getDb();

    // Check if interview exists
    const [existing] = await db.select().from(interviews).where(eq(interviews.id, data.id)).limit(1);

    if (existing) {
      // Update
      await db.update(interviews).set({
        status: data.status,
        score: data.score,
        communicationScore: data.communicationScore,
        technicalScore: data.technicalScore,
        confidenceScore: data.confidenceScore,
        duration: data.duration,
        feedback: data.feedback ? JSON.stringify(data.feedback) : null,
        completedAt: data.completedAt,
      }).where(eq(interviews.id, data.id));
    } else {
      // Insert
      await db.insert(interviews).values({
        id: data.id,
        userId: req.auth.user.id,
        role: data.role,
        experienceLevel: data.experienceLevel,
        techStack: JSON.stringify(data.techStack),
        status: data.status,
        createdAt: data.createdAt,
      });
    }

    // Upsert questions
    if (data.questions && data.questions.length > 0) {
      for (const q of data.questions) {
        const [existingQ] = await db.select().from(questions).where(eq(questions.id, q.id)).limit(1);
        if (existingQ) {
          await db.update(questions).set({
            answer: q.answer,
          }).where(eq(questions.id, q.id));
        } else {
          await db.insert(questions).values({
            id: q.id,
            interviewId: data.id,
            text: q.text,
            type: q.type,
            answer: q.answer,
          });
        }
      }
    }

    return NextResponse.json({ success: true, message: "Interview saved successfully" });
  } catch (error) {
    console.error("Interview Save Error:", error);
    return NextResponse.json({ error: "Failed to save interview" }, { status: 500 });
  }
});
