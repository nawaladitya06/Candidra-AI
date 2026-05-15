"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { motion } from "framer-motion";
import { Brain, Users, Sparkles, Code2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#030303] selection:bg-purple-500/30">
      <LandingNavbar />
      
      <main className="pt-40 pb-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 mesh-gradient opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-custom relative z-10">
           <div className="max-w-4xl mx-auto text-center mb-24">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 mb-8"
              >
                Our Mission
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9]"
              >
                Democratizing <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">Elite Engineering.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto"
              >
                We believe that access to high-quality interview preparation shouldn't be gated by who you know. We're building the world's most advanced AI interviewer to level the playing field.
              </motion.p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { icon: Brain, title: "AI-First", desc: "Built natively on advanced LLMs to simulate real human interaction." },
                { icon: Code2, title: "Technical Depth", desc: "Evaluating not just syntax, but architectural decision making." },
                { icon: Users, title: "For Everyone", desc: "Accessible pricing to ensure talent isn't restricted by capital." },
                { icon: Sparkles, title: "Continuous Evolution", desc: "Our models learn and adapt to the latest industry interview standards." }
              ].map((val, i) => (
                <GlassCard key={i} delay={i * 0.1} className="p-8 border-white/5 hover:border-purple-500/30 group">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors text-slate-400 group-hover:text-purple-400">
                      <val.icon className="w-6 h-6" />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">{val.title}</h3>
                   <p className="text-sm text-slate-400 font-medium leading-relaxed">{val.desc}</p>
                </GlassCard>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
}
