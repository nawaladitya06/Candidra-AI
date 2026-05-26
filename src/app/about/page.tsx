import AboutClient from "./AboutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Candidra AI — Democratizing Elite Engineering Prep",
  description: "Learn about the mission, values, and the core team behind Candidra AI. We are building the world's most advanced AI-powered technical interviewer.",
  keywords: ["Candidra about", "interview prep mission", "AI engineering team", "technical hiring AI", "about Candidra"],
};

export default function AboutPage() {
  return <AboutClient />;
}
