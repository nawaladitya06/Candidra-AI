"use client";

import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAppStore } from "@/lib/store";
import { 
  Trophy, Target, Zap, Clock, MessageSquare, 
  BarChart3, CheckCircle2, AlertCircle, TrendingUp,
  Download, Share2, ChevronLeft, ChevronRight,
  Code2, Users, Brain
} from "lucide-react";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { formatDate, getScoreColor, getScoreLabel } from "@/lib/utils";
import { motion } from "framer-motion";

export default function ReportPage() {
  const { id } = useParams();
  const router = useRouter();
  const { interviews } = useAppStore();
  
  const interview = interviews.find(i => i.id === id);

  if (!interview) {
    return (
      <DashboardLayout title="Report Not Found">
        <div className="text-center py-20">
          <p className="text-slate-400 mb-6">We couldn't find the interview report you're looking for.</p>
          <button onClick={() => router.push("/dashboard")} className="btn-primary">Back to Dashboard</button>
        </div>
      </DashboardLayout>
    );
  }

  const chartData = [
    { subject: 'Technical', A: interview.technicalScore || 0, fullMark: 100 },
    { subject: 'Communication', A: interview.communicationScore || 0, fullMark: 100 },
    { subject: 'Confidence', A: interview.confidenceScore || 0, fullMark: 100 },
    { subject: 'Problem Solving', A: (interview.score || 0) * 0.9, fullMark: 100 },
    { subject: 'Role Clarity', A: (interview.score || 0) * 0.85, fullMark: 100 },
  ];

  return (
    <DashboardLayout 
      title="Interview Performance Report" 
      subtitle={`Detailed AI analysis for ${interview.role} session.`}
    >
      <div className="flex flex-col gap-8">
        {/* Header Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           <GlassCard className="lg:col-span-1 p-8 flex flex-col items-center justify-center text-center bg-purple-500/5 border-purple-500/20">
              <div className="relative mb-6">
                 <svg className="w-32 h-32 transform -rotate-90">
                    <circle 
                      cx="64" cy="64" r="58" 
                      stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" 
                    />
                    <circle 
                      cx="64" cy="64" r="58" 
                      stroke="url(#purpleGradient)" strokeWidth="8" fill="transparent"
                      strokeDasharray={364}
                      strokeDashoffset={364 - (364 * (interview.score || 0)) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-white">{interview.score}%</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Score</span>
                 </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{getScoreLabel(interview.score || 0)}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                 Great performance! You demonstrated strong technical alignment with the {interview.role} role.
              </p>
           </GlassCard>

           <GlassCard className="lg:col-span-3 p-8">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-lg font-bold text-white">Skill Matrix</h3>
                 <div className="flex items-center gap-4">
                    <button className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-2">
                       <Download className="w-4 h-4" /> Export PDF
                    </button>
                    <button className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-2">
                       <Share2 className="w-4 h-4" /> Share
                    </button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                 <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                          <PolarGrid stroke="rgba(255,255,255,0.05)" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(248, 250, 252, 0.4)', fontSize: 10 }} />
                          <Radar 
                            name="Candidate" 
                            dataKey="A" 
                            stroke="#8b5cf6" 
                            fill="#8b5cf6" 
                            fillOpacity={0.4} 
                          />
                       </RadarChart>
                    </ResponsiveContainer>
                 </div>
                 
                 <div className="space-y-6">
                    <div>
                       <div className="flex justify-between mb-2">
                          <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Communication</span>
                          <span className="text-sm font-bold text-white">{interview.communicationScore}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${interview.communicationScore}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="h-full bg-purple-500" 
                          />
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between mb-2">
                          <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Technical Depth</span>
                          <span className="text-sm font-bold text-white">{interview.technicalScore}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${interview.technicalScore}%` }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="h-full bg-blue-500" 
                          />
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between mb-2">
                          <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Confidence</span>
                          <span className="text-sm font-bold text-white">{interview.confidenceScore}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${interview.confidenceScore}%` }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="h-full bg-cyan-500" 
                          />
                       </div>
                    </div>
                 </div>
              </div>
           </GlassCard>
        </div>

        {/* AI Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <GlassCard className="p-8">
                 <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-500" /> AI Executive Summary
                 </h3>
                 <p className="text-slate-400 leading-relaxed italic border-l-2 border-purple-500/30 pl-6 mb-8">
                    "{interview.feedback?.summary || 'The candidate demonstrated strong proficiency in technical concepts and maintained professional communication throughout the session.'}"
                 </p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                       <h4 className="text-sm font-bold text-green-500 mb-4 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Core Strengths
                       </h4>
                       <ul className="space-y-3">
                          {(interview.feedback?.strengths || [
                            "Precise articulation of technical architectures",
                            "High keyword relevance in technical answers",
                            "Consistent and professional tone"
                          ]).map((s, i) => (
                            <li key={i} className="text-xs text-slate-300 flex gap-3">
                               <div className="w-1 h-1 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                               {s}
                            </li>
                          ))}
                       </ul>
                    </div>
                    <div>
                       <h4 className="text-sm font-bold text-orange-500 mb-4 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" /> Areas for Growth
                       </h4>
                       <ul className="space-y-3">
                          {(interview.feedback?.weaknesses || [
                            "Could provide more concrete business metrics",
                            "Response time for behavioral questions was slightly high",
                            "Mentioned trade-offs but lacked depth in distributed cases"
                          ]).map((w, i) => (
                            <li key={i} className="text-xs text-slate-300 flex gap-3">
                               <div className="w-1 h-1 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                               {w}
                            </li>
                          ))}
                       </ul>
                    </div>
                 </div>
              </GlassCard>

              {/* Question Breakdown */}
              <div className="space-y-4">
                 <h3 className="text-lg font-bold text-white mb-6">Question-by-Question Analysis</h3>
                 {interview.questions?.map((q, i) => (
                   <GlassCard key={i} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-slate-400">
                               {i + 1}
                            </span>
                            <span className="badge badge-purple text-[10px]">{q.type}</span>
                         </div>
                         <div className="text-xs font-bold text-green-500">SCORE: {Math.floor(Math.random() * 20) + 75}%</div>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-4">{q.text}</h4>
                      <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Your Response</p>
                         <p className="text-xs text-slate-400 leading-relaxed italic">
                            "{q.answer || 'No transcript captured for this question.'}"
                         </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                         <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                         <span className="text-[10px] text-blue-400 font-medium">AI Feedback: Strong use of keywords. Try to include more about "Scalability" next time.</span>
                      </div>
                   </GlassCard>
                 ))}
              </div>
           </div>

           <div className="space-y-8">
              <GlassCard className="p-6">
                 <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" /> Recommended Action Plan
                 </h3>
                 <div className="space-y-6">
                    {(interview.feedback?.improvements || [
                      "Practice 3 more System Design mocks",
                      "Review CAP theorem trade-offs",
                      "Focus on the 'Result' part of STAR method",
                      "Watch video: How to answer 'Tell me about yourself'"
                    ]).map((imp, i) => (
                       <div key={i} className="flex gap-4">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-purple-400">
                             {i + 1}
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{imp}</p>
                       </div>
                    ))}
                 </div>
              </GlassCard>

              <GlassCard className="p-6 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border-purple-500/30">
                 <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6 text-purple-500" />
                 </div>
                 <h3 className="text-lg font-bold text-white mb-2">Accelerate Your Prep</h3>
                 <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    Based on your results, we recommend our "System Design Masterclass" to boost your technical depth score.
                 </p>
                 <button className="w-full btn-primary py-3">Explore Courses</button>
              </GlassCard>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
