"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Play, Brain, CheckCircle2, ChevronRight, BarChart3, Code2, Terminal } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "../ui/GlassCard";

export function Hero() {
  return (
    <section className="relative pt-28 pb-16 lg:pt-52 lg:pb-32 overflow-hidden bg-black border-b-4 border-white/10">
      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Left Column: Copy & CTA */}
          <div className="w-full lg:w-1/2 text-center lg:text-left pt-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 border-2 border-primary bg-primary/10 text-xs font-black uppercase tracking-[0.2em] text-primary mb-8 font-mono"
            >
              <div className="w-2 h-2 bg-primary animate-pulse" />
              <span>Candidra AI 2.0 Built for Devs</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="brutal-heading text-5xl sm:text-6xl lg:text-[88px] text-white mb-6 sm:mb-8 leading-[0.9]"
            >
              Interview <br className="hidden lg:block" />
              <span className="text-primary brutal-shadow">
                Intelligence.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-slate-400 mb-8 sm:mb-10 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0 font-mono"
            >
              The most advanced AI simulator for elite engineering roles. Master your communication, perfect your system design, and land the offer.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
            >
              <Link href="/register" className="btn-primary text-base px-8 py-4 w-full sm:w-auto">
                Start Preparing Free <ArrowRight className="ml-2 w-4 h-4 inline" />
              </Link>
              <button className="btn-secondary px-8 py-4 w-full sm:w-auto flex items-center justify-center gap-3">
                <Play className="w-4 h-4 fill-white" /> Watch Demo
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 sm:mt-12 flex items-center justify-center lg:justify-start gap-4 sm:gap-6 opacity-60 grayscale"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 font-mono">Used by engineers at</p>
              <div className="flex gap-6 font-bold text-white text-lg font-mono">
                <span>Vercel</span>
                <span>Stripe</span>
                <span>Linear</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Visual Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2 relative"
          >
            {/* Main Brutalist Panel */}
            <div className="relative z-10 w-full aspect-[4/3] border-4 border-white/20 bg-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] sm:shadow-[16px_16px_0px_0px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col p-4 sm:p-6">
               
               {/* Mock Top Bar */}
               <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-white/10">
                  <div className="flex gap-2">
                     <div className="w-4 h-4 border-2 border-white/20 bg-black" />
                     <div className="w-4 h-4 border-2 border-white/20 bg-black" />
                     <div className="w-4 h-4 border-2 border-white/20 bg-black" />
                  </div>
                  <div className="px-3 py-1 border-2 border-primary bg-primary/10 text-[10px] font-bold text-primary flex items-center gap-2 font-mono uppercase tracking-widest">
                     <div className="w-2 h-2 bg-primary animate-pulse" /> Live Session
                  </div>
               </div>

               {/* Mock Content */}
               <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Left Mock Panel */}
                  <div className="flex flex-col gap-6">
                     <div className="flex-1 bg-black border-2 border-white/20 p-5 relative overflow-hidden brutal-shadow">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 font-mono">Transcription</h4>
                        <div className="space-y-4">
                           <div className="h-2 w-[90%] bg-white/20" />
                           <div className="h-2 w-[70%] bg-white/20" />
                           <div className="h-2 w-[85%] bg-white/20" />
                        </div>
                     </div>
                     <div className="h-24 bg-black border-2 border-white/20 p-4 flex items-center justify-between brutal-shadow">
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 font-mono">Confidence</p>
                           <p className="text-3xl font-black text-white font-mono">94%</p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-primary" />
                     </div>
                  </div>
                  
                  {/* Right Mock Panel */}
                  <div className="flex flex-col gap-6">
                     <div className="h-32 bg-primary border-2 border-white/20 p-5 brutal-shadow">
                        <Terminal className="w-6 h-6 text-black mb-3" />
                        <h4 className="text-xs font-bold text-black mb-2 font-mono uppercase tracking-tight">System Design Focus</h4>
                        <p className="text-[10px] text-black/80 leading-relaxed font-mono font-medium">"Can you elaborate on how you would handle database sharding in this scenario?"</p>
                     </div>
                     <div className="flex-1 bg-black border-2 border-white/20 p-5 brutal-shadow">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 font-mono">Code Sandbox</h4>
                        <div className="space-y-2 font-mono text-[9px] text-white/60">
                           <p><span className="text-primary">function</span> <span className="text-white">optimize</span>(data) {'{'}</p>
                           <p className="pl-4">return data.map(x =&gt; x * 2);</p>
                           <p>{'}'}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Floating Orbs & Details */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="hidden md:block absolute -top-6 -right-6 lg:-right-12 z-20"
            >
              <div className="p-4 bg-black border-2 border-white/20 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] flex items-center gap-4">
                 <div className="w-10 h-10 border-2 border-white/20 bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Analysis</p>
                    <p className="text-xs font-bold text-white font-mono uppercase tracking-tight">Strong Architecture</p>
                 </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="hidden md:block absolute -bottom-10 -left-6 lg:-left-12 z-20"
            >
              <div className="p-4 bg-black border-2 border-white/20 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] flex items-center gap-4">
                 <div className="w-10 h-10 border-2 border-white/20 bg-primary/20 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-primary" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Technical Depth</p>
                    <p className="text-xs font-bold text-white font-mono uppercase tracking-tight">Advanced Concepts</p>
                 </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
