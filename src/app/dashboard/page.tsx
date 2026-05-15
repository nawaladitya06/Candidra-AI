"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard, StatCard } from "@/components/ui/GlassCard";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from "recharts";
import { 
  Trophy, Target, Zap, Clock, ChevronRight, 
  Play, Filter, Download, MoreHorizontal,
  Briefcase, MessageSquare, Code2, Sparkles, TrendingUp, Brain, ArrowRight
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatDate, getScoreColor, cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function DashboardPage() {
  const { user, interviews } = useAppStore();

  const stats = useMemo(() => {
    const completed = interviews.filter(i => i.status === "completed");
    const avgScore = completed.length > 0 
      ? Math.round(completed.reduce((acc, curr) => acc + (curr.score || 0), 0) / completed.length) 
      : 0;
    
    const avgConfidence = completed.length > 0
      ? Math.round(completed.reduce((acc, curr) => acc + (curr.confidenceScore || 0), 0) / completed.length)
      : 0;

    const totalDurationHours = Math.round(completed.reduce((acc, curr) => acc + (curr.duration || 0), 0) / 3600 * 10) / 10;

    return {
      completed: completed.length,
      avgScore,
      avgConfidence,
      totalDurationHours
    };
  }, [interviews]);

  const chartData = useMemo(() => {
    const completed = interviews
      .filter(i => i.status === "completed")
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    if (completed.length === 0) {
      return [
        { name: "No Data", score: 0 },
        { name: "Practice Now", score: 0 }
      ];
    }

    return completed.map(i => ({
      name: new Date(i.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: i.score || 0
    })).slice(-5); // Show last 5
  }, [interviews]);

  const skillMatrix = useMemo(() => {
    const completed = interviews.filter(i => i.status === "completed");
    if (completed.length === 0) {
      return [
        { label: "Communication", value: 0, icon: MessageSquare, color: "bg-purple-500" },
        { label: "Technical Depth", value: 0, icon: Code2, color: "bg-blue-500" },
        { label: "System Design", value: 0, icon: Target, color: "bg-cyan-500" },
        { label: "Problem Solving", value: 0, icon: Zap, color: "bg-pink-500" },
      ];
    }

    const avgComm = Math.round(completed.reduce((acc, curr) => acc + (curr.communicationScore || 0), 0) / completed.length);
    const avgTech = Math.round(completed.reduce((acc, curr) => acc + (curr.technicalScore || 0), 0) / completed.length);
    // Mocking system design and problem solving for now as they aren't explicitly in the schema yet
    return [
      { label: "Communication", value: avgComm, icon: MessageSquare, color: "bg-purple-500" },
      { label: "Technical Depth", value: avgTech, icon: Code2, color: "bg-blue-500" },
      { label: "System Design", value: Math.round((avgTech * 0.8)), icon: Target, color: "bg-cyan-500" },
      { label: "Problem Solving", value: Math.round((stats.avgScore + avgTech) / 2), icon: Zap, color: "bg-pink-500" },
    ];
  }, [interviews, stats.avgScore]);

  return (
    <DashboardLayout 
      title={`Welcome back, ${user?.name.split(' ')[0]}`}
      subtitle="Your interview readiness is looking strong this week."
      action={{ label: "New Interview Session", href: "/interview/setup" }}
    >
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          label="Interviews Completed" 
          value={stats.completed} 
          change={stats.completed > 0 ? `+${stats.completed}` : "0"} 
          positive={true}
          icon={<Briefcase className="w-5 h-5" />}
          color="purple"
        />
        <StatCard 
          label="Preparation Level" 
          value={`${stats.avgScore}%`} 
          change={stats.avgScore > 70 ? "Ready" : "Improving"} 
          positive={true}
          icon={<Trophy className="w-5 h-5" />}
          color="blue"
        />
        <StatCard 
          label="Learning Velocity" 
          value={`${stats.totalDurationHours}h`} 
          change="Time" 
          positive={true}
          icon={<TrendingUp className="w-5 h-5" />}
          color="cyan"
        />
        <StatCard 
          label="Confidence Score" 
          value={`${stats.avgConfidence}/100`} 
          change={stats.avgConfidence > 80 ? "Elite" : "Good"} 
          positive={true}
          icon={<Zap className="w-5 h-5" />}
          color="pink"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Analytics Chart */}
        <GlassCard className="lg:col-span-2 p-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 flex gap-3">
             <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">Week</button>
             <button className="text-[10px] font-black uppercase tracking-widest text-purple-400 bg-purple-400/10 px-3 py-1.5 rounded-lg border border-purple-500/20">Month</button>
          </div>
          
          <div className="mb-10">
             <h3 className="text-xl font-black text-white tracking-tight mb-1">Performance Insight</h3>
             <p className="text-sm text-slate-500 font-medium">Growth analysis over the last sessions</p>
          </div>

          <div className="h-[320px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={10} 
                  fontWeight={600}
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={10} 
                  fontWeight={600}
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(5, 5, 10, 0.95)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    fontSize: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ color: '#fff', fontWeight: 700 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8b5cf6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Skill Matrix Sidebar */}
        <GlassCard className="p-8">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-white tracking-tight">Skill Matrix</h3>
              <Sparkles className="w-5 h-5 text-purple-500" />
           </div>

           <div className="space-y-8">
              {skillMatrix.map((skill, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-3 group-hover:text-white transition-colors">
                      <skill.icon className="w-4 h-4" /> {skill.label}
                    </span>
                    <span className="text-xs font-black text-white">{skill.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.value}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={cn("h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]", skill.color)} 
                    />
                  </div>
                </div>
              ))}
           </div>

           <div className="mt-12 p-6 rounded-2xl bg-purple-500/5 border border-purple-500/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                 <Brain className="w-12 h-12" />
              </div>
              <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Zap className="w-3 h-3 fill-current" /> AI Action Required
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                {stats.completed > 0 
                  ? "Your technical depth is strong, but focus on articulating system design tradeoffs for your next session."
                  : "Start your first interview session to get personalized AI feedback on your performance."}
              </p>
           </div>
        </GlassCard>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-xl font-black text-white tracking-tight">Session History</h3>
           <Link href="/reports" className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-all flex items-center gap-2">
              Browse All <ChevronRight className="w-4 h-4" />
           </Link>
        </div>

        <GlassCard className="p-0 overflow-hidden border border-white/5">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                       <th className="px-8 py-5">Position & Difficulty</th>
                       <th className="px-8 py-5">Date</th>
                       <th className="px-8 py-5">Session Duration</th>
                       <th className="px-8 py-5">AI Score</th>
                       <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {interviews.length > 0 ? (
                      interviews.map((interview, i) => (
                        <motion.tr 
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          key={interview.id} 
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-slate-500 text-xs">
                                    {interview.role[0]}
                                 </div>
                                 <div>
                                    <p className="text-sm font-bold text-white mb-0.5">{interview.role}</p>
                                    <div className="flex items-center gap-2">
                                       <span className="text-[10px] font-black uppercase text-slate-500">{interview.experienceLevel}</span>
                                       <div className="w-1 h-1 rounded-full bg-slate-700" />
                                       <span className="text-[10px] font-black uppercase text-purple-500">Standard</span>
                                    </div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-sm font-bold text-slate-400">
                              {formatDate(interview.createdAt)}
                           </td>
                           <td className="px-8 py-6 text-sm font-bold text-slate-400">
                              {Math.floor((interview.duration || 1200) / 60)}m
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                 <div className="h-2 w-16 bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-purple-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]" 
                                      style={{ width: `${interview.score || 0}%` }} 
                                    />
                                 </div>
                                 <span className="text-xs font-black text-white">{interview.score || 0}%</span>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <Link href={`/reports/${interview.id}`}>
                                 <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                    <ArrowRight className="w-4 h-4" />
                                 </button>
                              </Link>
                           </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center">
                           <div className="flex flex-col items-center justify-center space-y-4">
                              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                                 <Briefcase className="w-8 h-8 text-slate-700" />
                              </div>
                              <div className="max-w-xs mx-auto">
                                 <h4 className="text-white font-bold mb-1">No session history found</h4>
                                 <p className="text-slate-500 text-sm">You haven't completed any interviews yet. Start your first session to see your progress.</p>
                              </div>
                              <Link href="/interview/setup" className="btn-primary py-2 px-6 text-xs">
                                 Start First Interview
                              </Link>
                           </div>
                        </td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
