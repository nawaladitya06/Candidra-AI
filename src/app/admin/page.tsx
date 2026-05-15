"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard, StatCard } from "@/components/ui/GlassCard";
import { 
  Users, Briefcase, Activity, ShieldCheck, 
  Search, Filter, MoreVertical, ChevronRight,
  TrendingUp, Globe, AlertCircle, Cpu
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from "recharts";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const statsData = [
  { name: 'Mon', users: 400, interviews: 240 },
  { name: 'Tue', users: 300, interviews: 139 },
  { name: 'Wed', users: 200, interviews: 980 },
  { name: 'Thu', users: 278, interviews: 390 },
  { name: 'Fri', users: 189, interviews: 480 },
  { name: 'Sat', users: 239, interviews: 380 },
  { name: 'Sun', users: 349, interviews: 430 },
];

export default function AdminDashboardPage() {
  const { user } = useAppStore();

  return (
    <DashboardLayout 
      title="Admin Command Center" 
      subtitle="System-wide analytics and management."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Total Users" 
          value="12,482" 
          change="+14%" 
          positive={true}
          icon={<Users className="w-5 h-5" />}
          color="purple"
        />
        <StatCard 
          label="Active Sessions" 
          value="1,204" 
          change="+8%" 
          positive={true}
          icon={<Activity className="w-5 h-5" />}
          color="blue"
        />
        <StatCard 
          label="Interviews Run" 
          value="45.2k" 
          change="+22%" 
          positive={true}
          icon={<Briefcase className="w-5 h-5" />}
          color="cyan"
        />
        <StatCard 
          label="Server Load" 
          value="34%" 
          change="Healthy" 
          positive={true}
          icon={<Cpu className="w-5 h-5" />}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
         {/* System Traffic */}
         <GlassCard className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-lg font-bold text-white">Platform Traffic</h3>
                  <p className="text-xs text-slate-500">Interviews and User Signups</p>
               </div>
               <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-purple-500" />
                     <span className="text-[10px] text-slate-500 font-bold uppercase">Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-cyan-500" />
                     <span className="text-[10px] text-slate-500 font-bold uppercase">Interviews</span>
                  </div>
               </div>
            </div>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={statsData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                     <XAxis 
                       dataKey="name" 
                       stroke="rgba(255,255,255,0.3)" 
                       fontSize={10} 
                       tickLine={false} 
                       axisLine={false}
                     />
                     <YAxis 
                       stroke="rgba(255,255,255,0.3)" 
                       fontSize={10} 
                       tickLine={false} 
                       axisLine={false}
                     />
                     <Tooltip 
                       contentStyle={{ 
                         background: 'rgba(15, 15, 25, 0.9)', 
                         border: '1px solid rgba(255,255,255,0.1)',
                         borderRadius: '10px',
                         fontSize: '12px'
                       }}
                       itemStyle={{ color: '#fff' }}
                     />
                     <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                     <Line type="monotone" dataKey="interviews" stroke="#06b6d4" strokeWidth={3} dot={false} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </GlassCard>

         {/* Distribution */}
         <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-white mb-6">User Distribution</h3>
            <div className="h-[250px] w-full mb-6">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                     { name: 'Frontend', value: 45 },
                     { name: 'Backend', value: 38 },
                     { name: 'Data', value: 24 },
                     { name: 'UX', value: 12 },
                     { name: 'DevOps', value: 18 },
                  ]}>
                     <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                     <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Most Popular Role</span>
                  <span className="text-white font-bold">Frontend Engineer</span>
               </div>
               <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Top Geo</span>
                  <span className="text-white font-bold flex items-center gap-2">
                     <Globe className="w-3 h-3 text-blue-500" /> United States
                  </span>
               </div>
            </div>
         </GlassCard>
      </div>

      {/* Recent Alerts & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <GlassCard className="lg:col-span-2 p-0 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
               <h3 className="text-lg font-bold text-white">Recent System Events</h3>
               <button className="text-xs text-purple-400 font-bold uppercase">View Logs</button>
            </div>
            <div className="divide-y divide-white/5">
               {[
                  { type: 'info', msg: 'New Pro subscription from user_8422', time: '2m ago' },
                  { type: 'warning', msg: 'API Latency spike detected in US-East', time: '14m ago' },
                  { type: 'success', msg: 'D1 Database backup completed', time: '1h ago' },
                  { type: 'error', msg: 'Failed GitHub OAuth attempt (ID: 942)', time: '3h ago' },
               ].map((event, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-white/2 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          event.type === 'error' ? 'bg-red-500' : 
                          event.type === 'warning' ? 'bg-orange-500' :
                          event.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        )} />
                        <span className="text-sm text-slate-300">{event.msg}</span>
                     </div>
                     <span className="text-xs text-slate-500">{event.time}</span>
                  </div>
               ))}
            </div>
         </GlassCard>

         <GlassCard className="p-6 bg-red-500/5 border-red-500/20">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-500" />
               </div>
               <h3 className="text-lg font-bold text-white">System Security</h3>
            </div>
            <div className="space-y-6">
               <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Pending Reviews</p>
                  <p className="text-2xl font-bold text-white">12</p>
               </div>
               <p className="text-xs text-slate-400 leading-relaxed">
                  12 user accounts have been flagged for suspicious activity or non-compliant content generation.
               </p>
               <button className="w-full py-3 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition-colors">
                  Investigate All
               </button>
            </div>
         </GlassCard>
      </div>
    </DashboardLayout>
  );
}
