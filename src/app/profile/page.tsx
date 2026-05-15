"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAppStore } from "@/lib/store";
import { 
  User, Mail, Briefcase, Calendar, 
  Settings, Shield, Bell, CreditCard,
  Edit2, Camera, Github, Linkedin, Twitter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user } = useAppStore();
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <DashboardLayout 
      title="User Profile" 
      subtitle="Manage your account settings and preferences."
    >
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
         {/* Navigation Sidebar */}
         <div className="w-full lg:w-64 space-y-2">
            {tabs.map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    activeTab === tab.id 
                      ? "bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_20px_rgba(139,92,246,0.1)]" 
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                  )}
               >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
               </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="flex-1 space-y-8">
            <GlassCard className="p-8">
               <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                  <div className="relative group">
                     <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl relative overflow-hidden">
                        {user?.name[0]}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                           <Camera className="w-8 h-8 text-white" />
                        </div>
                     </div>
                     <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-[#0a0a12] shadow-lg" />
                  </div>
                  
                  <div className="text-center md:text-left flex-1">
                     <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                        <span className="badge badge-purple uppercase text-[10px]">{user?.plan} Plan</span>
                     </div>
                     <p className="text-slate-500 text-sm mb-6 flex items-center justify-center md:justify-start gap-2">
                        <Mail className="w-4 h-4" /> {user?.email}
                     </p>
                     <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        <button className="btn-primary text-xs px-4 py-2 flex items-center gap-2">
                           <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                        </button>
                        <button className="btn-secondary text-xs px-4 py-2">View Public Resume</button>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                  <div className="space-y-6">
                     <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-purple-500" /> Professional Info
                     </h3>
                     <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                           <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Target Role</p>
                           <p className="text-sm text-white font-medium">{user?.role || "Senior Frontend Engineer"}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                           <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Member Since</p>
                           <p className="text-sm text-white font-medium">{user?.joinedAt || "Jan 2025"}</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <Settings className="w-4 h-4 text-blue-500" /> Connected Accounts
                     </h3>
                     <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                           <div className="flex items-center gap-3">
                              <Github className="w-5 h-5 text-white" />
                              <span className="text-sm text-slate-300 font-medium">GitHub</span>
                           </div>
                           <span className="text-[10px] font-bold text-green-500 uppercase">Connected</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                           <div className="flex items-center gap-3">
                              <Linkedin className="w-5 h-5 text-blue-500" />
                              <span className="text-sm text-slate-300 font-medium">LinkedIn</span>
                           </div>
                           <button className="text-[10px] font-bold text-purple-500 uppercase hover:text-purple-400">Connect</button>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                           <div className="flex items-center gap-3">
                              <Twitter className="w-5 h-5 text-cyan-400" />
                              <span className="text-sm text-slate-300 font-medium">Twitter</span>
                           </div>
                           <button className="text-[10px] font-bold text-purple-500 uppercase hover:text-purple-400">Connect</button>
                        </div>
                     </div>
                  </div>
               </div>
            </GlassCard>

            {/* Account Usage */}
            <GlassCard className="p-8">
               <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Subscription & Usage</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                     <p className="text-[10px] font-bold text-purple-400 uppercase mb-2">Current Plan</p>
                     <p className="text-xl font-bold text-white mb-1">PRO Yearly</p>
                     <p className="text-[10px] text-slate-500">Renews May 20, 2027</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                     <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Interviews</p>
                     <p className="text-xl font-bold text-white mb-1">12 / ∞</p>
                     <div className="h-1 w-full bg-white/5 rounded-full mt-2">
                        <div className="h-full bg-purple-500 w-[12%]" />
                     </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                     <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Cloud Storage</p>
                     <p className="text-xl font-bold text-white mb-1">420 MB / 5 GB</p>
                     <div className="h-1 w-full bg-white/5 rounded-full mt-2">
                        <div className="h-full bg-blue-500 w-[8%]" />
                     </div>
                  </div>
               </div>
               
               <div className="mt-8 flex justify-end gap-4">
                  <button className="text-xs font-bold text-slate-500 hover:text-white transition-colors">Cancel Subscription</button>
                  <button className="btn-primary text-xs px-6 py-2">Upgrade Plan</button>
               </div>
            </GlassCard>
         </div>
      </div>
    </DashboardLayout>
  );
}
