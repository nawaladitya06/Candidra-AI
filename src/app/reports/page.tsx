"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAppStore } from "@/lib/store";
import { formatDate, getScoreColor, cn } from "@/lib/utils";
import Link from "next/link";
import { 
  BarChart3, Calendar, Clock, Trophy, ArrowRight,
  Filter, Search, Download, Trash2, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";

export default function ReportsIndexPage() {
  const { interviews } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "completed" | "in-progress">("all");

  const filteredReports = useMemo(() => {
    return (interviews || []).filter(i => {
      const roleStr = i.role || "Unknown Role";
      const matchesSearch = roleStr.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (i.techStack && i.techStack.some(t => (t || "").toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesFilter = activeFilter === "all" || i.status === activeFilter;
      return matchesSearch && matchesFilter;
    }).sort((a, b) => new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime());
  }, [interviews, searchQuery, activeFilter]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
      try {
        const res = await fetch(`/api/interviews?id=${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete report");
        
        useAppStore.getState().deleteInterview(id);
        toast.success("Report deleted successfully");
      } catch (err) {
        toast.error("Could not delete report");
        console.error(err);
      }
    }
  };

  return (
    <DashboardLayout 
      title="Interview Reports" 
      subtitle="View all your past AI interview sessions and performance analyses."
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
         <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-80">
               <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search by role or tech stack..." 
                 className="w-full bg-black border-4 border-white/20 pl-12 pr-10 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all placeholder:text-slate-600 font-mono brutal-shadow-sm"
               />
               {searchQuery && (
                 <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 text-slate-500 hover:text-white transition-colors"
                 >
                    <X className="w-4 h-4" />
                 </button>
               )}
            </div>
            
            <div className="flex bg-black p-1 border-4 border-white/20 w-full sm:w-auto brutal-shadow-sm">
               {(["all", "completed", "in-progress"] as const).map((filter) => (
                 <button
                   key={filter}
                   onClick={() => setActiveFilter(filter)}
                   className={cn(
                     "px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all flex-1 sm:flex-none border-2 font-mono",
                     activeFilter === filter 
                       ? "bg-primary text-black border-black brutal-shadow-sm translate-x-[2px] translate-y-[2px]" 
                       : "bg-black text-white border-transparent hover:border-white/20 hover:bg-white/5"
                   )}
                 >
                   {filter.replace("-", " ")}
                 </button>
               ))}
            </div>
         </div>
         
         <div className="flex items-center gap-4 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-3 bg-black px-6 py-3 border-4 border-white/20 hover:bg-white hover:text-black transition-colors brutal-shadow-sm font-mono">
               <Download className="w-4 h-4" /> Export All
            </button>
         </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="p-20 flex flex-col items-center justify-center text-center border-4 border-white/20 bg-black brutal-shadow">
           <div className="w-24 h-24 border-4 border-white bg-primary flex items-center justify-center mb-8 relative brutal-shadow-sm">
              <BarChart3 className="w-10 h-10 text-black" />
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-black border-2 border-white flex items-center justify-center brutal-shadow-sm">
                 <Search className="w-4 h-4 text-white" />
              </div>
           </div>
           <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase font-mono">No Reports Found</h3>
           <p className="text-slate-400 mb-10 max-w-sm font-bold font-mono text-sm leading-relaxed">
             {searchQuery || activeFilter !== "all" 
               ? "We couldn't find any sessions matching your current filters. Try adjusting your search criteria."
               : "You haven't completed any interviews yet. Start your first session to see your performance metrics."}
           </p>
           <Link href="/interview/setup" className="btn-primary py-4 px-10 text-xs font-black uppercase tracking-widest font-mono">
             New Interview Session
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <AnimatePresence mode="popLayout">
              {filteredReports.map((interview, i) => (
                <motion.div
                  layout
                  key={interview.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/reports/${interview.id}`}>
                    <div className="p-8 h-full flex flex-col group cursor-pointer border-4 border-white/20 hover:border-primary bg-black brutal-shadow transition-all duration-300 hover:-translate-y-2">
                       <div className="flex justify-between items-start mb-8">
                          <div className="max-w-[70%]">
                             <div className="flex items-center gap-2 mb-4">
                                <span className={cn(
                                  "px-3 py-1 text-[9px] font-black uppercase tracking-widest font-mono border-2",
                                  interview.status === "completed" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" : "bg-primary/20 text-primary border-primary/50"
                                )}>
                                   {interview.status}
                                </span>
                             </div>
                             <h3 className="text-2xl font-black text-white mb-3 group-hover:text-primary transition-colors tracking-tighter uppercase font-mono leading-tight line-clamp-2">{interview.role}</h3>
                             <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 flex items-center gap-2 font-mono">
                                <Calendar className="w-4 h-4 text-primary" /> {formatDate(interview.createdAt)}
                             </p>
                          </div>
                          <div 
                            className="w-16 h-16 border-4 bg-black flex flex-col items-center justify-center brutal-shadow-sm transition-colors group-hover:bg-primary group-hover:border-black" 
                            style={{ borderColor: getScoreColor(interview.score || 0) }}
                          >
                             <span className="text-xl font-black leading-none group-hover:text-black" style={{ color: getScoreColor(interview.score || 0) }}>{interview.score || 0}</span>
                             <span className="text-[8px] font-black uppercase tracking-widest mt-1 opacity-80 group-hover:text-black font-mono">SCORE</span>
                          </div>
                       </div>
     
                       <div className="flex flex-wrap gap-2 mb-8">
                          {interview.techStack?.slice(0, 3).map((tech, idx) => (
                             <span key={tech || idx} className="px-3 py-1.5 bg-black border-2 border-white/20 text-[10px] font-black uppercase tracking-widest text-white font-mono brutal-shadow-sm">
                                {tech || "Unknown"}
                             </span>
                          ))}
                          {interview.techStack && interview.techStack.length > 3 && (
                             <span className="px-3 py-1.5 bg-black border-2 border-white/20 text-[10px] font-black uppercase tracking-widest text-primary font-mono brutal-shadow-sm">
                                +{interview.techStack.length - 3}
                             </span>
                          )}
                       </div>
     
                       <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="p-4 bg-black border-2 border-white/20 transition-colors brutal-shadow-sm">
                             <p className="text-[10px] uppercase font-black tracking-widest text-primary mb-2 flex items-center gap-2 font-mono">
                                <Clock className="w-4 h-4" /> Duration
                             </p>
                             <p className="text-sm font-black text-white font-mono">{Math.floor((interview.duration || 1200) / 60)}m { (interview.duration || 1200) % 60}s</p>
                          </div>
                          <div className="p-4 bg-black border-2 border-white/20 transition-colors brutal-shadow-sm">
                             <p className="text-[10px] uppercase font-black tracking-widest text-primary mb-2 flex items-center gap-2 font-mono">
                                <Trophy className="w-4 h-4" /> Experience
                             </p>
                             <p className="text-sm font-black text-white font-mono uppercase">{interview.experienceLevel}</p>
                          </div>
                       </div>
     
                       <div className="mt-auto pt-6 border-t-4 border-white/20 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white group-hover:text-primary transition-colors font-mono">Analyze Performance</span>
                          <div className="flex items-center gap-4">
                             <button 
                              onClick={(e) => handleDelete(e, interview.id)}
                              className="p-2 border-2 border-transparent hover:border-red-500 text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 brutal-shadow-sm"
                             >
                                <Trash2 className="w-5 h-5" />
                             </button>
                             <div className="w-10 h-10 border-2 border-white/20 bg-black flex items-center justify-center group-hover:bg-primary group-hover:border-black group-hover:text-black text-white transition-all brutal-shadow-sm">
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                             </div>
                          </div>
                       </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
           </AnimatePresence>
        </div>
      )}
    </DashboardLayout>
  );
}
