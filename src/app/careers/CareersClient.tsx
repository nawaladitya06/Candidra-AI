"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Clock } from "lucide-react";

const JOBS = [
  { title: "Senior Applied AI Engineer", team: "Engineering", location: "San Francisco, CA (or Remote)", type: "Full-time" },
  { title: "Founding Product Designer", team: "Design", location: "Remote", type: "Full-time" },
  { title: "Developer Advocate", team: "DevRel", location: "New York, NY", type: "Full-time" },
  { title: "Full Stack Engineer (Next.js)", team: "Engineering", location: "Remote", type: "Full-time" },
];

export default function CareersClient() {
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
                Join The Team
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9] brutal-heading uppercase text-center"
              >
                Build the future of <br />
                <span className="text-primary brutal-shadow">hiring infrastructure.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-slate-400 font-bold leading-relaxed max-w-2xl mx-auto font-mono tracking-tight"
              >
                We are a small, intense, product-obsessed team. If you want to move fast and shape how engineers are evaluated globally, we want to talk.
              </motion.p>
           </div>

           <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-black text-white mb-8 uppercase font-mono tracking-tighter">Open Positions</h3>
              <div className="space-y-4">
                 {JOBS.map((job, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group p-6 md:p-8 border-4 border-white/20 bg-black brutal-shadow hover:border-primary transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 hover:translate-x-[2px] hover:translate-y-[2px]"
                    >
                       <div>
                          <h4 className="text-xl font-black text-white mb-3 group-hover:text-primary transition-colors uppercase font-mono">{job.title}</h4>
                          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 font-mono tracking-tight">
                             <span className="flex items-center gap-1.5"><span className="w-2 h-2 border-2 border-primary bg-black group-hover:bg-primary transition-colors" /> {job.team}</span>
                             <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" /> {job.location}</span>
                             <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> {job.type}</span>
                          </div>
                       </div>
                       <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-white/20 bg-black text-white font-black text-sm font-mono uppercase tracking-widest group-hover:bg-primary group-hover:text-black group-hover:border-black transition-colors brutal-shadow-sm">
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
