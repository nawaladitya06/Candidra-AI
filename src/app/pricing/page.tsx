"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { Pricing } from "@/components/landing/Pricing";
import { AnimatedBg } from "@/components/ui/AnimatedBg";
import { motion } from "framer-motion";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#050508] relative overflow-hidden">
      <AnimatedBg />
      <LandingNavbar />
      
      <main className="pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 text-center mb-16">
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-4xl lg:text-6xl font-extrabold text-white mb-6"
           >
              Simple, transparent <span className="gradient-text">pricing</span>.
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-lg text-slate-400"
           >
              Choose the plan that's right for your career stage. No hidden fees.
           </motion.p>
        </div>
        
        <Pricing />
        
        <div className="max-w-4xl mx-auto px-4 mt-20">
           <div className="glass p-8 rounded-2xl border-white/5">
              <h2 className="text-xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                 {[
                   { q: "Is there a student discount?", a: "Yes! Students with a valid .edu email get 50% off our Pro plan." },
                   { q: "Can I cancel anytime?", a: "Absolutely. You can cancel your subscription from your profile at any time." },
                   { q: "Do interviews expire?", a: "Free interviews expire at the end of the month. Pro interviews are unlimited." },
                   { q: "How accurate is the AI?", a: "Gemini 1.5 Pro provides human-like feedback with over 95% accuracy in technical evaluations." }
                 ].map((faq, i) => (
                   <div key={i}>
                      <h4 className="text-white font-bold mb-2 text-sm">{faq.q}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">{faq.a}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </main>

      <footer className="py-12 border-t border-white/5 text-center text-slate-600 text-xs relative z-10">
         © 2026 HireMind AI Inc.
      </footer>
    </div>
  );
}
