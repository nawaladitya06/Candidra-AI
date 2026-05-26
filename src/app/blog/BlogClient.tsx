"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";

type Blog = {
  id: string;
  title: string;
  category: string;
  content: string;
  readTime: string;
  date: string;
  slug: string;
  createdAt: string;
};

interface BlogClientProps {
  initialBlogs: Blog[];
}

export default function BlogClient({ initialBlogs }: BlogClientProps) {
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
                Candidra Insights
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9] brutal-heading uppercase"
              >
                Candidra <span className="text-primary brutal-shadow">Journal.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-slate-400 font-bold leading-relaxed max-w-2xl mx-auto font-mono tracking-tight"
              >
                Deep dives into engineering, interview strategies, and AI developments from our core team.
              </motion.p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {initialBlogs.map((post, i) => (
                <div key={post.id} className="p-8 border-4 border-white/20 bg-black brutal-shadow hover:border-primary group flex flex-col cursor-pointer transition-transform hover:translate-x-[2px] hover:translate-y-[2px]">
                   <div className="flex items-center justify-between mb-8">
                      <span className="px-3 py-1 border-2 border-primary bg-primary/10 text-[10px] font-black uppercase tracking-widest text-primary font-mono">
                         {post.category}
                      </span>
                      <span className="text-xs font-bold text-slate-500 font-mono tracking-tight">{post.readTime}</span>
                   </div>
                   <h3 className="text-2xl font-black text-white mb-4 leading-tight group-hover:text-primary transition-colors uppercase font-mono">
                      {post.title}
                   </h3>
                   <p className="text-slate-400 text-xs font-mono line-clamp-3 mb-6 leading-relaxed">
                      {post.content}
                   </p>
                   <div className="mt-auto pt-4 flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-500 font-mono tracking-tight">{post.date}</span>
                      <div className="flex items-center gap-1.5 text-xs text-primary font-bold uppercase font-mono group-hover:underline">
                        <span>Read article</span>
                        <ArrowRight className="w-4 h-4 -translate-x-1 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
}
