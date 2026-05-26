import { getDb } from "@/db";
import { blogs as blogsSchema } from "@/db/schema";
import { sql } from "drizzle-orm";
import BlogClient from "./BlogClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Candidra Journal — Technical, Coding, & Interview Preparation Guides",
  description: "Explore expert insights, low-latency LLM architectures, system design anti-patterns, and data-driven guides to landing your dream software engineering job.",
  keywords: ["Candidra blog", "system design guides", "coding interview prep", "LLM latency engineering", "tech career blog"],
};

export const revalidate = 0; // Disable static cache to ensure admin updates are seen immediately

export default async function BlogPage() {
  let allBlogs: any[] = [];
  try {
    const db = getDb();
    allBlogs = await db.select().from(blogsSchema).orderBy(sql`createdAt DESC`);
  } catch (error) {
    console.error("Failed to fetch blogs in server component:", error);
  }

  // Fallback if empty
  if (allBlogs.length === 0) {
    allBlogs = [
      {
        id: "1",
        title: "How we built a real-time LLM pipeline with under 200ms latency",
        category: "Engineering",
        content: "Building real-time interactive voice applications with LLMs requires extreme performance tuning. Here is how we achieved under 200ms audio-to-audio roundtrip latency using streaming responses and custom caching strategies...",
        readTime: "8 min read",
        date: "May 10, 2026",
        slug: "llm-pipeline-latency",
      },
      {
        id: "2",
        title: "The 5 most common system design anti-patterns",
        category: "Interviews",
        content: "When interviewing for senior roles, knowing what NOT to do is as important as knowing what to do. Let's break down the 5 most destructive system design mistakes and how to fix them...",
        readTime: "12 min read",
        date: "April 28, 2026",
        slug: "system-design-anti-patterns",
      },
      {
        id: "3",
        title: "Candidra secures Series A to redefine technical hiring",
        category: "Company",
        content: "We are thrilled to announce our $12M Series A funding round to scale our intelligent mock interview platform and expand our core product engineering team...",
        readTime: "4 min read",
        date: "April 15, 2026",
        slug: "candidra-series-a",
      },
      {
        id: "4",
        title: "Mastering the behavioral interview: A data-driven approach",
        category: "Guides",
        content: "Most software engineers fail their behavioral interviews because they do not structure their answers. Using the STAR framework, we show how to frame your engineering leadership experience with measurable impact...",
        readTime: "15 min read",
        date: "March 30, 2026",
        slug: "mastering-behavioral-interview",
      },
    ];
  }

  return <BlogClient initialBlogs={allBlogs} />;
}
