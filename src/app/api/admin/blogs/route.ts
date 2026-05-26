import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { blogs } from "@/db/schema";
import crypto from "crypto";
import { eq, sql } from "drizzle-orm";

const ADMIN_EMAILS = ["nawaladitya06@gmail.com"];

const SEED_BLOGS = [
  {
    title: "How we built a real-time LLM pipeline with under 200ms latency",
    category: "Engineering",
    content: "Building real-time interactive voice applications with LLMs requires extreme performance tuning. Here is how we achieved under 200ms audio-to-audio roundtrip latency using streaming responses and custom caching strategies...",
    readTime: "8 min read",
    date: "May 10, 2026",
    slug: "llm-pipeline-latency",
  },
  {
    title: "The 5 most common system design anti-patterns",
    category: "Interviews",
    content: "When interviewing for senior roles, knowing what NOT to do is as important as knowing what to do. Let's break down the 5 most destructive system design mistakes and how to fix them...",
    readTime: "12 min read",
    date: "April 28, 2026",
    slug: "system-design-anti-patterns",
  },
  {
    title: "Candidra secures Series A to redefine technical hiring",
    category: "Company",
    content: "We are thrilled to announce our $12M Series A funding round to scale our intelligent mock interview platform and expand our core product engineering team...",
    readTime: "4 min read",
    date: "April 15, 2026",
    slug: "candidra-series-a",
  },
  {
    title: "Mastering the behavioral interview: A data-driven approach",
    category: "Guides",
    content: "Most software engineers fail their behavioral interviews because they do not structure their answers. Using the STAR framework, we show how to frame your engineering leadership experience with measurable impact...",
    readTime: "15 min read",
    date: "March 30, 2026",
    slug: "mastering-behavioral-interview",
  },
];

export async function GET() {
  try {
    const db = getDb();
    
    let allBlogs = await db.select().from(blogs).orderBy(sql`createdAt DESC`);

    // Proactive seeding if database is empty
    if (allBlogs.length === 0) {
      console.log("Seeding initial blogs to D1 database...");
      for (const item of SEED_BLOGS) {
        await db.insert(blogs).values({
          id: `blog_${crypto.randomUUID()}`,
          title: item.title,
          slug: item.slug,
          category: item.category,
          content: item.content,
          readTime: item.readTime,
          date: item.date,
          createdAt: new Date().toISOString(),
        });
      }
      allBlogs = await db.select().from(blogs).orderBy(sql`createdAt DESC`);
    }

    return NextResponse.json({ blogs: allBlogs });
  } catch (error: any) {
    console.error("GET Blogs API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, category, content, readTime, date, slug } = await req.json();

    if (!title || !category || !content || !readTime || !date || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = getDb();

    // Check slug uniqueness
    const [existingBlog] = await db.select().from(blogs).where(eq(blogs.slug, slug)).limit(1);
    if (existingBlog) {
      return NextResponse.json({ error: "A blog with this slug already exists" }, { status: 409 });
    }

    const newBlog = {
      id: `blog_${crypto.randomUUID()}`,
      title,
      category,
      content,
      readTime,
      date,
      slug,
      createdAt: new Date().toISOString(),
    };

    await db.insert(blogs).values(newBlog);

    return NextResponse.json({ success: true, blog: newBlog });
  } catch (error: any) {
    console.error("POST Blog API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, title, category, content, readTime, date, slug } = await req.json();

    if (!id || !title || !category || !content || !readTime || !date || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = getDb();

    // Verify uniqueness of slug for different posts
    const existingBlog = await db.select().from(blogs).where(eq(blogs.slug, slug)).limit(1);
    if (existingBlog.length > 0 && existingBlog[0].id !== id) {
      return NextResponse.json({ error: "A blog with this slug already exists" }, { status: 409 });
    }

    await db
      .update(blogs)
      .set({
        title,
        category,
        content,
        readTime,
        date,
        slug,
      })
      .where(eq(blogs.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PUT Blog API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const db = getDb();
    await db.delete(blogs).where(eq(blogs.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Blog API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
