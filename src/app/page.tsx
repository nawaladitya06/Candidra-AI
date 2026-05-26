import HomeClient from "./HomeClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Candidra AI — Ace Your Next Technical & Coding Interview",
  description: "Supercharge your interview prep with Candidra. Practice realistic AI-powered technical interviews, dynamic coding challenges, and get real-time actionable feedback.",
  keywords: [
    "AI interview prep",
    "job interview practice",
    "technical interview",
    "coding interview",
    "Candidra",
    "AI coding platform",
    "software engineer prep",
    "system design practice",
  ],
  authors: [{ name: "Candidra AI" }],
  openGraph: {
    title: "Candidra AI — Ace Your Next Interview",
    description: "AI-powered interview preparation platform with voice interviews, coding rounds, and personalized feedback.",
    type: "website",
    url: "https://candidra.ai",
    siteName: "Candidra AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Candidra AI — Ace Your Next Interview",
    description: "AI-powered interview preparation platform with voice interviews, coding rounds, and personalized feedback.",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
