"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Users, Briefcase, Activity, ShieldCheck, 
  FileText, TrendingUp, Globe, AlertCircle, Cpu,
  Crown, UserCheck, BarChart3, Lock
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ADMIN_EMAILS = ["nawaladitya06@gmail.com"];

interface AdminStats {
  totalUsers: number;
  totalInterviews: number;
  completedInterviews: number;
  totalResumes: number;
  freeUsers: number;
  proUsers: number;
  avgScore: number;
  recentUsers: { id: string; name: string; email: string; plan: string; interviewsCompleted: number }[];
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || !isAdmin) {
      // Not admin — don't fetch
      setLoading(false);
      return;
    }

    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setStats(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [session, status, isAdmin]);

  // Access denied screen
  if (status !== "loading" && (!session || !isAdmin)) {
    return (
      <DashboardLayout title="Admin" subtitle="">
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 border-4 border-red-500 bg-red-500/10 flex items-center justify-center mb-8 brutal-shadow">
            <Lock className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-4xl font-black text-white uppercase font-mono tracking-tight mb-4">Access Denied</h2>
          <p className="text-slate-400 font-mono text-sm mb-8">You do not have permission to view this page.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="btn-primary px-8 py-3 text-xs font-mono"
          >
            Back to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Loading screen
  if (loading) {
    return (
      <DashboardLayout title="Admin Command Center" subtitle="Loading live data...">
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">Fetching live data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const planData = [
    { name: "Free", value: stats?.freeUsers ?? 0 },
    { name: "Pro", value: stats?.proUsers ?? 0 },
  ];
  const COLORS = ["#4b5563", "#f59e0b"];

  const completionRate = stats && stats.totalInterviews > 0
    ? Math.round((stats.completedInterviews / stats.totalInterviews) * 100)
    : 0;

  return (
    <DashboardLayout 
      title="Admin Command Center" 
      subtitle="Live system-wide analytics and management."
    >
      {/* Access badge */}
      <div className="flex items-center gap-3 mb-10 p-4 border-2 border-primary/30 bg-primary/5 w-fit">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <span className="text-xs font-black text-primary font-mono uppercase tracking-widest">
          Admin Access — {session?.user?.email}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Users", value: stats?.totalUsers ?? 0, icon: <Users className="w-6 h-6" />, color: "border-blue-500 text-blue-400" },
          { label: "Interviews Run", value: stats?.totalInterviews ?? 0, icon: <Briefcase className="w-6 h-6" />, color: "border-primary text-primary" },
          { label: "Resumes Uploaded", value: stats?.totalResumes ?? 0, icon: <FileText className="w-6 h-6" />, color: "border-purple-500 text-purple-400" },
          { label: "Avg. Score", value: `${stats?.avgScore ?? 0}%`, icon: <TrendingUp className="w-6 h-6" />, color: "border-green-500 text-green-400" },
        ].map((stat, i) => (
          <div key={i} className={`p-6 border-4 bg-black brutal-shadow flex flex-col gap-4 ${stat.color}`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-500">{stat.label}</span>
              <span className={stat.color}>{stat.icon}</span>
            </div>
            <p className="text-4xl font-black text-white font-mono">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Completion Rate */}
        <div className="p-8 border-4 border-white/20 bg-black brutal-shadow flex flex-col gap-6">
          <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">Interview Completion Rate</h3>
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="#f59e0b" strokeWidth="2"
                  strokeDasharray={`${completionRate} ${100 - completionRate}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white font-mono">{completionRate}%</span>
                <span className="text-[9px] text-slate-500 font-mono uppercase">Complete</span>
              </div>
            </div>
            <div className="flex gap-6 text-center w-full">
              <div className="flex-1 p-3 border-2 border-white/10">
                <p className="text-lg font-black text-primary font-mono">{stats?.completedInterviews ?? 0}</p>
                <p className="text-[9px] text-slate-500 font-mono uppercase">Done</p>
              </div>
              <div className="flex-1 p-3 border-2 border-white/10">
                <p className="text-lg font-black text-white font-mono">{(stats?.totalInterviews ?? 0) - (stats?.completedInterviews ?? 0)}</p>
                <p className="text-[9px] text-slate-500 font-mono uppercase">In Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="p-8 border-4 border-white/20 bg-black brutal-shadow flex flex-col gap-6">
          <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">Plan Distribution</h3>
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <PieChart width={160} height={160}>
                <Pie data={planData} cx={75} cy={75} innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                  {planData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="flex gap-6 w-full">
              <div className="flex-1 p-3 border-2 border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-gray-600" />
                  <span className="text-[9px] text-slate-500 font-mono uppercase">Free</span>
                </div>
                <p className="text-xl font-black text-white font-mono">{stats?.freeUsers ?? 0}</p>
              </div>
              <div className="flex-1 p-3 border-2 border-primary/30">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-3 h-3 text-primary" />
                  <span className="text-[9px] text-primary font-mono uppercase font-black">Pro</span>
                </div>
                <p className="text-xl font-black text-primary font-mono">{stats?.proUsers ?? 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="p-8 border-4 border-white/20 bg-black brutal-shadow flex flex-col gap-6">
          <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">System Status</h3>
          <div className="flex flex-col gap-4">
            {[
              { name: "Database (D1)", status: "Operational", ok: true },
              { name: "Auth (NextAuth)", status: "Operational", ok: true },
              { name: "AI (Gemini)", status: "Operational", ok: true },
              { name: "Storage (Cloudinary)", status: "Operational", ok: true },
              { name: "Hosting (Vercel)", status: "Operational", ok: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 border-2 border-white/5">
                <span className="text-xs font-bold text-slate-300 font-mono">{item.name}</span>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 border font-mono ${
                  item.ok ? "text-green-400 bg-green-500/10 border-green-500/20" : "text-red-400 bg-red-500/10 border-red-500/20"
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="border-4 border-white/20 bg-black brutal-shadow overflow-hidden">
        <div className="p-6 border-b-4 border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">Recent Registrations</h3>
          </div>
          <span className="text-[10px] text-slate-500 font-mono uppercase">Last 5 users</span>
        </div>
        <div className="divide-y divide-white/5">
          {(stats?.recentUsers ?? []).length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono text-sm">No users found</div>
          ) : (
            stats?.recentUsers.map((user, i) => (
              <div key={user.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border-2 border-white/20 bg-black flex items-center justify-center font-black text-sm text-white font-mono">
                    {(user.name || user.email || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white font-mono">{user.name || "Unnamed User"}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs font-black text-white font-mono">{user.interviewsCompleted}</p>
                    <p className="text-[9px] text-slate-500 font-mono uppercase">Interviews</p>
                  </div>
                  <span className={`text-[9px] font-black uppercase px-3 py-1 border font-mono ${
                    user.plan === "pro" ? "text-primary bg-primary/10 border-primary/30" : "text-slate-400 bg-white/5 border-white/10"
                  }`}>
                    {user.plan === "pro" ? "⭐ Pro" : "Free"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
