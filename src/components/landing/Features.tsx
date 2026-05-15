"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { 
  Brain, Mic, Code2, Shield, 
  BarChart3, Zap, Globe, Cpu, Search, Sparkles, AudioWaveform, Activity
} from "lucide-react";
import { motion } from "framer-motion";

export function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 auto-rows-[300px]">
      
      {/* Feature 1: Large Bento Card (Spans 2 columns) */}
      <GlassCard delay={0.1} className="md:col-span-2 flex flex-col md:flex-row gap-8 overflow-hidden group relative p-0 border-white/5 hover:border-purple-500/30">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="p-10 md:w-1/2 flex flex-col justify-center z-10">
           <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 shadow-xl">
              <Brain className="w-6 h-6 text-purple-400" />
           </div>
           <h3 className="text-2xl font-black text-white tracking-tight mb-4">Neural Interview Engine</h3>
           <p className="text-slate-400 font-medium leading-relaxed">
             Engage in lifelike, dynamic conversations. Our LLM pipeline adapts to your answers in real-time, pushing your technical depth and probing weak points exactly like a senior engineer would.
           </p>
        </div>
        <div className="md:w-1/2 relative min-h-[200px] md:min-h-full bg-black/40 border-l border-white/5 flex flex-col items-center justify-center overflow-hidden">
           {/* Decorative UI element inside card */}
           <div className="absolute inset-0 grid-pattern opacity-10" />
           <div className="relative w-full max-w-[80%] space-y-4">
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 shadow-2xl"
              >
                 <p className="text-[10px] font-black uppercase text-slate-500 mb-2">AI Interviewer</p>
                 <p className="text-sm font-medium text-slate-300">That's a solid high-level overview. Now, how would you handle race conditions if two instances try to write to that same database row simultaneously?</p>
              </motion.div>
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-[85%] bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 shadow-2xl ml-auto"
              >
                 <div className="flex items-center gap-2 mb-2">
                    <AudioWaveform className="w-3 h-3 text-purple-400" />
                    <p className="text-[10px] font-black uppercase text-purple-400">You (Speaking)</p>
                 </div>
                 <p className="text-sm font-medium text-white">I would implement optimistic concurrency control using a version column...</p>
              </motion.div>
           </div>
        </div>
      </GlassCard>

      {/* Feature 2: Tall Bento Card (Spans 2 rows) */}
      <GlassCard delay={0.2} className="md:row-span-2 flex flex-col group relative border-white/5 hover:border-blue-500/30 overflow-hidden p-8">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700" />
         <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 shadow-xl relative z-10">
            <BarChart3 className="w-6 h-6 text-blue-400" />
         </div>
         <h3 className="text-2xl font-black text-white tracking-tight mb-4 relative z-10">Actionable Analytics</h3>
         <p className="text-slate-400 font-medium leading-relaxed mb-8 relative z-10">
           Don't just practice; measure. Get instant, granular feedback on your communication style, filler word usage, and technical accuracy.
         </p>
         
         <div className="flex-1 rounded-2xl bg-black/40 border border-white/5 p-6 relative z-10 mt-auto">
            <div className="flex justify-between items-end mb-6">
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-500">Readiness</p>
                  <p className="text-3xl font-black text-white">88<span className="text-sm text-slate-500">%</span></p>
               </div>
               <Activity className="w-8 h-8 text-blue-500 mb-1 opacity-50" />
            </div>
            <div className="space-y-4">
               {[
                 { label: "Technical", val: "92%", color: "bg-blue-500" },
                 { label: "Delivery", val: "84%", color: "bg-purple-500" },
                 { label: "Confidence", val: "88%", color: "bg-cyan-500" },
               ].map((stat, i) => (
                 <div key={i}>
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
                       <span>{stat.label}</span>
                       <span className="text-white">{stat.val}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className={`h-full ${stat.color}`} style={{ width: stat.val }} />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </GlassCard>

      {/* Feature 3: Standard Square */}
      <GlassCard delay={0.3} className="flex flex-col group relative border-white/5 hover:border-cyan-500/30 p-8 overflow-hidden">
         <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[60px] rounded-full group-hover:bg-cyan-500/20 transition-all duration-700" />
         <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 shadow-xl relative z-10">
            <Code2 className="w-6 h-6 text-cyan-400" />
         </div>
         <h3 className="text-xl font-black text-white tracking-tight mb-4 relative z-10">Live Code Execution</h3>
         <p className="text-slate-400 font-medium leading-relaxed relative z-10 text-sm">
           Integrated Monaco editor with real-time evaluation. The AI watches your thought process, not just your final syntax.
         </p>
      </GlassCard>

      {/* Feature 4: Standard Square */}
      <GlassCard delay={0.4} className="flex flex-col group relative border-white/5 hover:border-green-500/30 p-8 overflow-hidden">
         <div className="absolute top-0 left-0 w-32 h-32 bg-green-500/10 blur-[60px] rounded-full group-hover:bg-green-500/20 transition-all duration-700" />
         <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 shadow-xl relative z-10">
            <Search className="w-6 h-6 text-green-400" />
         </div>
         <h3 className="text-xl font-black text-white tracking-tight mb-4 relative z-10">Resume Intelligence</h3>
         <p className="text-slate-400 font-medium leading-relaxed relative z-10 text-sm">
           Upload your CV. Our AI parses your experience and generates hyper-specific questions to bulletproof your past projects.
         </p>
      </GlassCard>

    </div>
  );
}
