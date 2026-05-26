import PricingClient from "./PricingClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Candidra AI Pricing — Simple, Transparent Plans for Every Developer",
  description: "Find the perfect plan for your career growth. From free mock interviews to unlimited AI-driven technical evaluations and coding simulator tools.",
  keywords: ["Candidra pricing", "mock interview cost", "AI interviewer price", "coding practice plans"],
};

export default function PricingPage() {
  return <PricingClient />;
}
