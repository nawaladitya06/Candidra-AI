"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Play, Brain, CheckCircle2, ChevronRight, BarChart3, Code2 } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "../ui/GlassCard";

export function Hero() {
  return (
    <section className="relative pt-40 pb-20 lg:pt-52 lg:pb-32 overflow-hidden bg-[#030303]">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none z-0" />
      <div className="absolute top-0 w-full h-[800px] pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[40%] h-[60%] rounded-full bg-purple-600/15 blur-[160px] animate-pulse" />
        <div className="absolute top-[10%] right-[5%] w-[40%] h-[60%] rounded-full bg-indigo-600/15 blur-[160px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
          
          {/* Left Column: Copy & CTA */}
          <div className="w-full lg:w-1/2 text-center lg:text-left pt-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 mb-8 shadow-2xl backdrop-blur-md"
            >
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span>HireMind AI 2.0 is Live</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl sm:text-7xl lg:text-[88px] font-black tracking-tighter text-white mb-8 leading-[0.9]"
            >
              Interview <br className="hidden lg:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-slate-500">
                Intelligence.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0"
            >
              The most advanced AI simulator for elite engineering roles. Master your communication, perfect your system design, and land the offer.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link href="/register" className="btn-primary text-base px-8 py-4 w-full sm:w-auto shadow-[0_0_40px_rgba(139,92,246,0.3)]">
                Start Preparing Free <ArrowRight className="ml-2 w-4 h-4 inline" />
              </Link>
              <button className="px-8 py-4 w-full sm:w-auto rounded-full font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-3">
                <Play className="w-4 h-4 fill-white" /> Watch Product Demo
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 flex items-center justify-center lg:justify-start gap-6 opacity-60 grayscale"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Used by engineers at</p>
              <div className="flex gap-6 font-bold text-white text-lg">
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
            {/* Main Holographic Panel */}
            <div className="relative z-10 w-full aspect-square md:aspect-[4/3] rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_0_80px_rgba(139,92,246,0.15)] overflow-hidden flex flex-col p-6">
               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
               
               {/* Mock Top Bar */}
               <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500/50" />
                     <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                     <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-slate-400 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" /> Live Session
                  </div>
               </div>

               {/* Mock Content */}
               <div className="flex-1 grid grid-cols-2 gap-4">
                  {/* Left Mock Panel */}
                  <div className="flex flex-col gap-4">
                     <div className="flex-1 rounded-2xl bg-white/[0.02] border border-white/5 p-5 relative overflow-hidden">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Transcription</h4>
                        <div className="space-y-3">
                           <div className="h-2 w-[90%] bg-white/10 rounded-full" />
                           <div className="h-2 w-[70%] bg-white/10 rounded-full" />
                           <div className="h-2 w-[85%] bg-white/10 rounded-full" />
                        </div>
                        <div className="absolute bottom-5 left-5 right-5 h-8 rounded-lg bg-gradient-to-r from-purple-500/20 to-transparent border border-purple-500/20 flex items-center px-3">
                           <div className="w-full flex items-center gap-1 opacity-50">
                              {[45, 80, 30, 90, 60, 40, 75, 50, 85].map((h, i) => (
                                <div key={i} className="w-1 bg-purple-400 rounded-full animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                              ))}
                           </div>
                        </div>
                     </div>
                     <div className="h-24 rounded-2xl bg-white/[0.02] border border-white/5 p-4 flex items-center justify-between">
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">AI Confidence</p>
                           <p className="text-2xl font-black text-white">94%</p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-purple-500 opacity-50" />
                     </div>
                  </div>
                  
                  {/* Right Mock Panel */}
                  <div className="flex flex-col gap-4">
                     <div className="h-32 rounded-2xl bg-gradient-to-br from-purple-600/20 to-indigo-600/10 border border-purple-500/20 p-5">
                        <Brain className="w-6 h-6 text-purple-400 mb-3" />
                        <h4 className="text-xs font-bold text-white mb-2">System Design Focus</h4>
                        <p className="text-[10px] text-purple-200/60 leading-relaxed">"Can you elaborate on how you would handle database sharding in this scenario?"</p>
                     </div>
                     <div className="flex-1 rounded-2xl bg-white/[0.02] border border-white/5 p-5">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Code Sandbox</h4>
                        <div className="space-y-2 font-mono text-[8px] text-slate-500 opacity-50">
                           <p><span className="text-purple-400">function</span> <span className="text-blue-400">optimize</span>(data) {'{'}</p>
                           <p className="pl-4">return data.map(x =&gt; x * 2);</p>
                           <p>{'}'}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Floating Orbs & Details */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 lg:-right-12 z-20"
            >
              <GlassCard className="p-4 backdrop-blur-xl border-white/20 shadow-2xl flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                 </div>
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Analysis</p>
                    <p className="text-xs font-bold text-white">Strong Architecture</p>
                 </div>
              </GlassCard>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -left-6 lg:-left-12 z-20"
            >
              <GlassCard className="p-4 backdrop-blur-xl border-white/20 shadow-2xl flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Code2 className="w-4 h-4 text-blue-500" />
                 </div>
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Technical Depth</p>
                    <p className="text-xs font-bold text-white">Advanced concepts detected</p>
                 </div>
              </GlassCard>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
