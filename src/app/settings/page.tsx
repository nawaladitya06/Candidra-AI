"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAppStore } from "@/lib/store";
import { useState } from "react";
import toast from "react-hot-toast";
import { 
  User, Mail, Shield, Bell, CreditCard, 
  Sparkles, CheckCircle2, ChevronRight, Loader2
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Profile updated successfully!");
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
       setIsDeleting(true);
       await new Promise(resolve => setTimeout(resolve, 2000));
       toast.success("Account deleted.");
       window.location.href = "/";
    }
  };

  return (
    <DashboardLayout 
      title="Settings" 
      subtitle="Manage your account preferences, billing, and system configurations."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column: Navigation/Overview */}
         <div className="lg:col-span-1 space-y-6">
            <GlassCard className="p-6 border-white/5">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-black text-white text-2xl shadow-xl">
                     {user?.name?.[0] || "U"}
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-white">{user?.name || "User"}</h3>
                     <p className="text-xs font-bold text-slate-500">{user?.email || "user@example.com"}</p>
                  </div>
               </div>
               
               <div className="space-y-1">
                  <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 text-white font-bold text-sm">
                     <span className="flex items-center gap-3"><User className="w-4 h-4 text-purple-400" /> General</span>
                     <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                  <button onClick={() => toast("Security settings coming soon.", { icon: "🔒" })} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-bold text-sm transition-colors">
                     <span className="flex items-center gap-3"><Shield className="w-4 h-4" /> Security</span>
                     <ChevronRight className="w-4 h-4 opacity-0" />
                  </button>
                  <button onClick={() => toast("Notification preferences coming soon.", { icon: "🔔" })} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-bold text-sm transition-colors">
                     <span className="flex items-center gap-3"><Bell className="w-4 h-4" /> Notifications</span>
                     <ChevronRight className="w-4 h-4 opacity-0" />
                  </button>
                  <button onClick={() => toast("Billing portal coming soon.", { icon: "💳" })} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-bold text-sm transition-colors">
                     <span className="flex items-center gap-3"><CreditCard className="w-4 h-4" /> Billing</span>
                     <ChevronRight className="w-4 h-4 opacity-0" />
                  </button>
               </div>
            </GlassCard>

            <GlassCard className="p-6 border-purple-500/20 bg-purple-500/5 relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 blur-[30px] rounded-full" />
               <h4 className="text-xs font-black uppercase tracking-widest text-purple-400 flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Current Plan
               </h4>
               <p className="text-2xl font-black text-white tracking-tighter mb-4 capitalize">{user?.plan || "Pro"} Tier</p>
               <button onClick={() => toast("Stripe integration coming soon.", { icon: "⚡" })} className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-colors shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                  Manage Subscription
               </button>
            </GlassCard>
         </div>

         {/* Right Column: Settings Form */}
         <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-8 border-white/5">
               <h3 className="text-xl font-bold text-white mb-6">Profile Information</h3>
               
               <form className="space-y-6" onSubmit={handleSave}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Name</label>
                        <input 
                           type="text" 
                           defaultValue={user?.name || ""}
                           required
                           className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Address</label>
                        <div className="relative">
                           <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                           <input 
                              type="email" 
                              defaultValue={user?.email || ""}
                              required
                              className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors disabled:opacity-50" 
                           />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Target Role</label>
                     <input 
                        type="text" 
                        defaultValue={user?.role || "Software Engineer"}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors" 
                     />
                  </div>

                  <div className="pt-4 border-t border-white/5 flex justify-end">
                     <button 
                       type="submit"
                       disabled={isLoading}
                       className="px-6 py-3 rounded-xl bg-white text-black font-black text-sm hover:bg-slate-200 transition-colors flex items-center gap-2 disabled:opacity-70"
                     >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} 
                        {isLoading ? "Saving..." : "Save Changes"}
                     </button>
                  </div>
               </form>
            </GlassCard>

            <GlassCard className="p-8 border-red-500/10 bg-red-500/5">
               <h3 className="text-xl font-bold text-red-400 mb-2">Danger Zone</h3>
               <p className="text-sm text-slate-400 mb-6">Permanently delete your account and all associated interview data. This action cannot be undone.</p>
               <button 
                 onClick={handleDelete}
                 disabled={isDeleting}
                 className="px-6 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-black text-sm hover:bg-red-500/20 transition-colors disabled:opacity-50 flex items-center gap-2"
               >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isDeleting ? "Deleting..." : "Delete Account"}
               </button>
            </GlassCard>
         </div>
      </div>
    </DashboardLayout>
  );
}
