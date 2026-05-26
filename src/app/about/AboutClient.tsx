"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { motion } from "framer-motion";
import { Brain, Users, Sparkles, Code2 } from "lucide-react";

export default function AboutClient() {
  return (
    <div className="relative min-h-screen bg-black selection:bg-primary/30">
      <LandingNavbar />
      
      <main className="pt-40 pb-24 relative overflow-hidden">
        <div className="container-custom relative z-10">
           <div className="max-w-4xl mx-auto text-center mb-24">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex px-4 py-1.5 border-2 border-primary bg-primary/10 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8 font-mono"
              >
                Our Mission
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9] brutal-heading uppercase text-center"
              >
                Democratizing <br />
                <span className="text-primary brutal-shadow">Elite Engineering.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-slate-400 font-bold leading-relaxed max-w-2xl mx-auto font-mono tracking-tight"
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
                <div key={i} className="p-8 border-4 border-white/20 bg-black brutal-shadow group transition-transform hover:translate-x-[2px] hover:translate-y-[2px]">
                   <div className="w-12 h-12 border-2 border-white/20 bg-black flex items-center justify-center mb-6 brutal-shadow-sm group-hover:bg-primary group-hover:border-black transition-colors">
                      <val.icon className="w-6 h-6 text-white group-hover:text-black transition-colors" />
                   </div>
                   <h3 className="text-xl font-black text-white mb-3 uppercase font-mono">{val.title}</h3>
                   <p className="text-sm text-slate-400 font-bold leading-relaxed font-mono tracking-tight">{val.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
}
