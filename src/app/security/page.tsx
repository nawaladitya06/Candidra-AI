"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";

export default function SecurityPage() {
  return (
    <div className="relative min-h-screen bg-[#030303] selection:bg-purple-500/30">
      <LandingNavbar />
      
      <main className="pt-40 pb-24 relative overflow-hidden">
        <div className="container-custom max-w-4xl mx-auto relative z-10">
           <div className="mb-16">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">Security</h1>
              <p className="text-slate-400 font-medium">Enterprise-grade security for your engineering data.</p>
           </div>

           <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-black text-white tracking-tighter mb-4">1. Data Encryption</h2>
                <p className="text-slate-400 leading-relaxed">
                  All data in transit is encrypted using TLS 1.3 or higher. Data at rest, including interview transcripts, code submissions, and personal information, is encrypted using AES-256. We utilize AWS Key Management Service (KMS) for robust key rotation and management.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white tracking-tighter mb-4">2. Infrastructure Security</h2>
                <p className="text-slate-400 leading-relaxed">
                  Our infrastructure is hosted on Cloudflare and AWS, leveraging their world-class security perimeters. We employ strict network segmentation, Web Application Firewalls (WAF), and automated DDoS protection. 
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white tracking-tighter mb-4">3. AI & LLM Privacy</h2>
                <p className="text-slate-400 leading-relaxed">
                  We use isolated inference environments for our language models. Your proprietary code and interview responses are never used to train base models. Any fine-tuning operations (if explicitly opted-in) occur in heavily anonymized, aggregated, and siloed environments.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white tracking-tighter mb-4">4. Access Control</h2>
                <p className="text-slate-400 leading-relaxed">
                  We strictly enforce the principle of least privilege. All employee access to production systems requires Multi-Factor Authentication (MFA) and is routed through a secure VPN. Access logs are immutable and continuously audited.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-white tracking-tighter mb-4">5. Vulnerability Disclosure</h2>
                <p className="text-slate-400 leading-relaxed">
                  If you believe you've discovered a vulnerability, we encourage you to report it immediately. We review all reports and will do our best to address issues rapidly. Contact our security team at <a href="mailto:security@hiremind.ai" className="text-purple-400 hover:text-purple-300">security@hiremind.ai</a>.
                </p>
              </section>
           </div>
        </div>
      </main>
    </div>
  );
}
