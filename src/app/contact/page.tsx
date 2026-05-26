import ContactClient from "./ContactClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Candidra AI — Get in Touch with Our Team",
  description: "Have questions about Candidra, enterprise deployments, or custom pricing? Reach out to our team. We'd love to chat and support your journey.",
  keywords: ["contact Candidra", "Candidra sales", "interview prep support", "enterprise AI hiring"],
};

export default function ContactPage() {
  return <ContactClient />;
}
