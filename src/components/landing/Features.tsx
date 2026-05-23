"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { 
  Brain, Mic, Code2, Shield, 
  BarChart3, Zap, Globe, Cpu, Search, Sparkles, AudioWaveform, Activity
} from "lucide-react";
import { motion } from "framer-motion";

export function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 md:auto-rows-[300px]">
      
      {/* Feature 1: Large Bento Card (Spans 2 columns) */}
      <div className="md:col-span-2 flex flex-col md:flex-row gap-0 group relative p-0 border-4 border-white/20 bg-black brutal-shadow overflow-hidden transition-transform duration-300 hover:translate-x-[2px] hover:translate-y-[2px]">
        <div className="p-10 md:w-1/2 flex flex-col justify-center z-10 border-b-4 md:border-b-0 md:border-r-4 border-white/20 bg-black">
           <div className="w-12 h-12 border-2 border-white/20 bg-primary flex items-center justify-center mb-6 brutal-shadow-sm">
              <Brain className="w-6 h-6 text-black" />
           </div>
           <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4 font-mono">Neural Interview Engine</h3>
           <p className="text-slate-400 font-medium leading-relaxed font-mono text-sm">
             Engage in lifelike, dynamic conversations. Our LLM pipeline adapts to your answers in real-time, pushing your technical depth and probing weak points exactly like a senior engineer would.
           </p>
        </div>
        <div className="md:w-1/2 relative min-h-[200px] md:min-h-full bg-[#111] flex flex-col items-center justify-center p-6">
           <div className="relative w-full max-w-[90%] space-y-4">
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full bg-black border-2 border-white/20 p-4 brutal-shadow-sm"
              >
                 <p className="text-[10px] font-black uppercase text-primary mb-2 font-mono">AI Interviewer</p>
                 <p className="text-xs font-bold text-white font-mono">That's a solid high-level overview. Now, how would you handle race conditions if two instances try to write to that same database row simultaneously?</p>
              </motion.div>
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-[85%] bg-primary border-2 border-black p-4 brutal-shadow-sm ml-auto"
              >
                 <div className="flex items-center gap-2 mb-2">
                    <AudioWaveform className="w-3 h-3 text-black" />
                    <p className="text-[10px] font-black uppercase text-black font-mono">You (Speaking)</p>
                 </div>
                 <p className="text-xs font-bold text-black font-mono">I would implement optimistic concurrency control using a version column...</p>
              </motion.div>
           </div>
        </div>
      </div>

      {/* Feature 2: Tall Bento Card (Spans 2 rows) */}
      <div className="md:row-span-2 flex flex-col group relative border-4 border-white/20 bg-black brutal-shadow overflow-hidden p-8 transition-transform duration-300 hover:translate-x-[2px] hover:translate-y-[2px]">
         <div className="w-12 h-12 border-2 border-white/20 bg-primary flex items-center justify-center mb-6 brutal-shadow-sm relative z-10">
            <BarChart3 className="w-6 h-6 text-black" />
         </div>
         <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4 relative z-10 font-mono">Actionable Analytics</h3>
         <p className="text-slate-400 font-medium leading-relaxed mb-8 relative z-10 text-sm font-mono">
           Don't just practice; measure. Get instant, granular feedback on your communication style, filler word usage, and technical accuracy.
         </p>
         
         <div className="flex-1 bg-[#111] border-2 border-white/20 p-6 relative z-10 mt-auto brutal-shadow-sm">
            <div className="flex justify-between items-end mb-6">
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-primary font-mono">Readiness</p>
                  <p className="text-4xl font-black text-white font-mono">88<span className="text-xl text-primary">%</span></p>
               </div>
               <Activity className="w-8 h-8 text-primary mb-1" />
            </div>
            <div className="space-y-4">
               {[
                 { label: "Technical", val: "92%", color: "bg-primary" },
                 { label: "Delivery", val: "84%", color: "bg-white" },
                 { label: "Confidence", val: "88%", color: "bg-slate-400" },
               ].map((stat, i) => (
                 <div key={i}>
                    <div className="flex justify-between text-[10px] font-black uppercase text-white mb-2 font-mono">
                       <span>{stat.label}</span>
                       <span className="text-primary">{stat.val}</span>
                    </div>
                    <div className="h-2 w-full border border-white/20 bg-black overflow-hidden">
                       <div className={`h-full ${stat.color}`} style={{ width: stat.val }} />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Feature 3: Standard Square */}
      <div className="flex flex-col group relative border-4 border-white/20 bg-black brutal-shadow p-8 overflow-hidden transition-transform duration-300 hover:translate-x-[2px] hover:translate-y-[2px]">
         <div className="w-12 h-12 border-2 border-white/20 bg-primary flex items-center justify-center mb-6 brutal-shadow-sm relative z-10">
            <Code2 className="w-6 h-6 text-black" />
         </div>
         <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4 relative z-10 font-mono">Live Code Execution</h3>
         <p className="text-slate-400 font-medium leading-relaxed relative z-10 text-sm font-mono">
           Integrated Monaco editor with real-time evaluation. The AI watches your thought process, not just your final syntax.
         </p>
      </div>

      {/* Feature 4: Standard Square */}
      <div className="flex flex-col group relative border-4 border-white/20 bg-black brutal-shadow p-8 overflow-hidden transition-transform duration-300 hover:translate-x-[2px] hover:translate-y-[2px]">
         <div className="w-12 h-12 border-2 border-white/20 bg-primary flex items-center justify-center mb-6 brutal-shadow-sm relative z-10">
            <Search className="w-6 h-6 text-black" />
         </div>
         <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4 relative z-10 font-mono">Resume Intelligence</h3>
         <p className="text-slate-400 font-medium leading-relaxed relative z-10 text-sm font-mono">
           Upload your CV. Our AI parses your experience and generates hyper-specific questions to bulletproof your past projects.
         </p>
      </div>

    </div>
  );
}
