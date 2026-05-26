import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Candidra AI",
  description: "Read the Terms of Service governing your use of Candidra AI, our AI interview simulation, and developer tools.",
  keywords: ["Candidra terms of service", "legal agreement"],
};

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-[#030303] selection:bg-primary/30">
      <LandingNavbar />
      
      <main className="pt-40 pb-24 relative overflow-hidden">
        <div className="container-custom max-w-4xl mx-auto relative z-10">
           <div className="mb-16">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">Terms of Service</h1>
              <p className="text-slate-400 font-medium">Last updated: May 15, 2026</p>
           </div>

           <div className="space-y-12">
              <section>
                 <h2 className="text-2xl font-black text-white tracking-tighter mb-4">1. Agreement to Terms</h2>
                 <p className="text-slate-400 leading-relaxed">By accessing or using Candidra AI, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.</p>
              </section>

              <section>
                 <h2 className="text-2xl font-black text-white tracking-tighter mb-4">2. Intellectual Property Rights</h2>
                 <p className="text-slate-400 leading-relaxed">Other than the content you own, under these Terms, Candidra AI and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.</p>
              </section>

              <section>
                 <h2 className="text-2xl font-black text-white tracking-tighter mb-4">3. Acceptable Use</h2>
                 <p className="text-slate-400 leading-relaxed">You agree not to use the Service in any way that is unlawful, or harms Candidra AI, its service providers, suppliers or any other user. You agree not to attempt to reverse engineer the AI models, access unauthorized data, or abuse the free tiers of the platform.</p>
              </section>

              <section>
                 <h2 className="text-2xl font-black text-white tracking-tighter mb-4">4. Limitation of Liability</h2>
                 <p className="text-slate-400 leading-relaxed">In no event shall Candidra AI, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Candidra AI shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>
              </section>

              <section>
                 <h2 className="text-2xl font-black text-white tracking-tighter mb-4">5. Contact Us</h2>
                 <p className="text-slate-400 leading-relaxed">If you have any questions about these Terms, please contact us at: <a href="mailto:legal@candidra.ai" className="text-primary hover:text-white">legal@candidra.ai</a></p>
              </section>
           </div>
        </div>
      </main>
    </div>
  );
}
