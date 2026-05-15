"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const POSTS = [
  { category: "Engineering", title: "How we built a real-time LLM pipeline with under 200ms latency", date: "May 10, 2026", readTime: "8 min read" },
  { category: "Interviews", title: "The 5 most common system design anti-patterns", date: "April 28, 2026", readTime: "12 min read" },
  { category: "Company", title: "HireMind secures Series A to redefine technical hiring", date: "April 15, 2026", readTime: "4 min read" },
  { category: "Guides", title: "Mastering the behavioral interview: A data-driven approach", date: "March 30, 2026", readTime: "15 min read" },
];

export default function BlogPage() {
  return (
    <div className="relative min-h-screen bg-[#030303] selection:bg-purple-500/30">
      <LandingNavbar />
      
      <main className="pt-40 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-custom relative z-10">
           <div className="max-w-4xl mx-auto text-center mb-24">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9]"
              >
                HireMind <span className="text-slate-500">Journal.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto"
              >
                Deep dives into engineering, interview strategies, and AI developments from our core team.
              </motion.p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {POSTS.map((post, i) => (
                <GlassCard key={i} delay={i * 0.1} hoverable className="p-8 border-white/5 hover:border-indigo-500/30 group flex flex-col cursor-pointer">
                   <div className="flex items-center justify-between mb-8">
                      <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                         {post.category}
                      </span>
                      <span className="text-xs font-bold text-slate-500">{post.readTime}</span>
                   </div>
                   <h3 className="text-2xl font-black text-white mb-4 leading-tight group-hover:text-indigo-400 transition-colors">
                      {post.title}
                   </h3>
                   <div className="mt-auto pt-8 flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-500">{post.date}</span>
                      <ArrowRight className="w-5 h-5 text-indigo-400 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                   </div>
                </GlassCard>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
}
