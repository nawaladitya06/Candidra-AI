"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-[#030303] selection:bg-purple-500/30">
      <LandingNavbar />
      
      <main className="pt-40 pb-24 relative overflow-hidden">
        <div className="container-custom max-w-4xl mx-auto relative z-10">
           <div className="mb-16">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">Privacy Policy</h1>
              <p className="text-slate-400 font-medium">Last updated: May 15, 2026</p>
           </div>

           <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-black text-white tracking-tighter mb-4">1. Introduction</h2>
                <p className="text-slate-400 leading-relaxed">At HireMind AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our AI interview simulation platform.</p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white tracking-tighter mb-4">2. Information We Collect</h2>
                <p className="text-slate-400 leading-relaxed mb-4">We collect information that you voluntarily provide to us when you register on the platform. This includes:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-400">
                   <li>Personal Information (Name, Email address)</li>
                   <li>Professional Information (Resume data, Experience level)</li>
                   <li>Interview Data (Audio recordings, Transcripts, Code submissions)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white tracking-tighter mb-4">3. How We Use Your Information</h2>
                <p className="text-slate-400 leading-relaxed mb-4">The core of our service relies on analyzing your interview performance. Your data is used exclusively to:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-400">
                   <li>Generate dynamic, personalized AI interview questions.</li>
                   <li>Provide detailed feedback and scoring on your technical and communication skills.</li>
                   <li>Improve the accuracy of our machine learning models (only with explicit opt-in consent).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white tracking-tighter mb-4">4. Data Security</h2>
                <p className="text-slate-400 leading-relaxed">We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white tracking-tighter mb-4">5. Contact Us</h2>
                <p className="text-slate-400 leading-relaxed">If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@hiremind.ai" className="text-purple-400 hover:text-purple-300">privacy@hiremind.ai</a></p>
              </section>
           </div>
        </div>
      </main>
    </div>
  );
}
