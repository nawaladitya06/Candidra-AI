"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const JOBS = [
  { title: "Senior Applied AI Engineer", team: "Engineering", location: "San Francisco, CA (or Remote)", type: "Full-time" },
  { title: "Founding Product Designer", team: "Design", location: "Remote", type: "Full-time" },
  { title: "Developer Advocate", team: "DevRel", location: "New York, NY", type: "Full-time" },
  { title: "Full Stack Engineer (Next.js)", team: "Engineering", location: "Remote", type: "Full-time" },
];

export default function CareersPage() {
  return (
    <div className="relative min-h-screen bg-[#030303] selection:bg-purple-500/30">
      <LandingNavbar />
      
      <main className="pt-40 pb-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
        
        <div className="container-custom relative z-10">
           <div className="max-w-4xl mx-auto text-center mb-24">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-8"
              >
                Join The Team
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9]"
              >
                Build the future of <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">hiring infrastructure.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto"
              >
                We are a small, intense, product-obsessed team. If you want to move fast and shape how engineers are evaluated globally, we want to talk.
              </motion.p>
           </div>

           <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-black text-white mb-8 tracking-tighter">Open Positions</h3>
              <div className="space-y-4">
                 {JOBS.map((job, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                       <div>
                          <h4 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{job.title}</h4>
                          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
                             <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500/50" /> {job.team}</span>
                             <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                             <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {job.type}</span>
                          </div>
                       </div>
                       <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-white font-bold text-sm group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                          Apply Now <ArrowRight className="w-4 h-4" />
                       </button>
                    </motion.div>
                 ))}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
