import CareersClient from "./CareersClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers at Candidra AI — Build the Future of Technical Hiring",
  description: "Join our intense, product-obsessed team to build elite AI interview simulators and developer tools. Explore open engineering, design, and DevRel roles.",
  keywords: ["Candidra careers", "AI engineer jobs", "work at Candidra", "remote developer roles", "founding designer jobs"],
};

export default function CareersPage() {
  return <CareersClient />;
}
