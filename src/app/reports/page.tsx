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
    return interviews.filter(i => {
      const matchesSearch = i.role.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (i.techStack && i.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesFilter = activeFilter === "all" || i.status === activeFilter;
      return matchesSearch && matchesFilter;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [interviews, searchQuery, activeFilter]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
      toast.success("Report deleted successfully");
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
                 className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-10 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-slate-600"
               />
               {searchQuery && (
                 <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded-full text-slate-500"
                 >
                    <X className="w-3 h-3" />
                 </button>
               )}
            </div>
            
            <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/5 w-full sm:w-auto">
               {(["all", "completed", "in-progress"] as const).map((filter) => (
                 <button
                   key={filter}
                   onClick={() => setActiveFilter(filter)}
                   className={cn(
                     "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex-1 sm:flex-none",
                     activeFilter === filter 
                       ? "bg-white/10 text-white shadow-lg" 
                       : "text-slate-500 hover:text-slate-300"
                   )}
                 >
                   {filter.replace("-", " ")}
                 </button>
               ))}
            </div>
         </div>
         
         <div className="flex items-center gap-4 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center justify-center gap-3 bg-white/5 px-6 py-3 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
               <Download className="w-4 h-4" /> Export All
            </button>
         </div>
      </div>

      {filteredReports.length === 0 ? (
        <GlassCard className="p-20 flex flex-col items-center justify-center text-center border-white/5 bg-white/[0.01]">
           <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center mb-8 relative">
              <BarChart3 className="w-10 h-10 text-slate-700" />
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                 <Search className="w-3 h-3 text-purple-400" />
              </div>
           </div>
           <h3 className="text-2xl font-black text-white mb-3 tracking-tight">No Reports Found</h3>
           <p className="text-slate-500 mb-10 max-w-sm leading-relaxed">
             {searchQuery || activeFilter !== "all" 
               ? "We couldn't find any sessions matching your current filters. Try adjusting your search criteria."
               : "You haven't completed any interviews yet. Start your first session to see your performance metrics."}
           </p>
           <Link href="/interview/setup" className="btn-primary py-3.5 px-10 text-xs font-black uppercase tracking-widest shadow-[0_0_30px_rgba(139,92,246,0.2)]">
             New Interview Session
           </Link>
        </GlassCard>
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
                    <GlassCard hoverable className="p-8 h-full flex flex-col group cursor-pointer border-white/5 hover:border-purple-500/30 bg-white/[0.01] transition-all duration-500">
                       <div className="flex justify-between items-start mb-8">
                          <div className="max-w-[70%]">
                             <div className="flex items-center gap-2 mb-2">
                                <span className={cn(
                                  "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                                  interview.status === "completed" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                )}>
                                   {interview.status}
                                </span>
                             </div>
                             <h3 className="text-xl font-black text-white mb-2 group-hover:text-purple-400 transition-colors tracking-tight leading-tight line-clamp-1">{interview.role}</h3>
                             <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-purple-500/50" /> {formatDate(interview.createdAt)}
                             </p>
                          </div>
                          <div 
                            className="w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center shadow-lg bg-black/20" 
                            style={{ borderColor: `${getScoreColor(interview.score || 0)}20`, color: getScoreColor(interview.score || 0) }}
                          >
                             <span className="text-lg font-black leading-none">{interview.score || 0}</span>
                             <span className="text-[7px] font-black uppercase tracking-widest mt-1 opacity-60">SCORE</span>
                          </div>
                       </div>
     
                       <div className="flex flex-wrap gap-2 mb-8">
                          {interview.techStack?.slice(0, 3).map(tech => (
                             <span key={tech} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                {tech}
                             </span>
                          ))}
                          {interview.techStack && interview.techStack.length > 3 && (
                             <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500">
                                +{interview.techStack.length - 3}
                             </span>
                          )}
                       </div>
     
                       <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] transition-colors">
                             <p className="text-[9px] uppercase font-black tracking-widest text-slate-600 mb-1.5 flex items-center gap-2">
                                <Clock className="w-3 h-3" /> Duration
                             </p>
                             <p className="text-xs font-black text-white">{Math.floor((interview.duration || 1200) / 60)}m { (interview.duration || 1200) % 60}s</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] transition-colors">
                             <p className="text-[9px] uppercase font-black tracking-widest text-slate-600 mb-1.5 flex items-center gap-2">
                                <Trophy className="w-3 h-3" /> Experience
                             </p>
                             <p className="text-xs font-black text-white capitalize">{interview.experienceLevel}</p>
                          </div>
                       </div>
     
                       <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 group-hover:text-purple-300 transition-colors">Analyze Performance</span>
                          <div className="flex items-center gap-3">
                             <button 
                              onClick={(e) => handleDelete(e, interview.id)}
                              className="p-2 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all">
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                             </div>
                          </div>
                       </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
           </AnimatePresence>
        </div>
      )}
    </DashboardLayout>
  );
}
