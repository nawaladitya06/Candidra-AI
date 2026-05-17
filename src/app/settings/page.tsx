"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAppStore } from "@/lib/store";
import { useState } from "react";
import toast from "react-hot-toast";
import { 
  User, Mail, Shield, Bell, CreditCard, 
  Sparkles, CheckCircle2, ChevronRight, Loader2,
  Lock, Laptop, Smartphone, Check, Download, AlertTriangle
} from "lucide-react";

type TabType = 'general' | 'security' | 'notifications' | 'billing';

export default function SettingsPage() {
  const { user, setUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // General Settings State
  const [fullName, setFullName] = useState(user?.name || "");
  const [emailAddress, setEmailAddress] = useState(user?.email || "");
  const [targetRole, setTargetRole] = useState(user?.role || "Software Engineer");

  // Security Settings State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);

  // Notification Preferences State
  const [emailProgress, setEmailProgress] = useState(true);
  const [emailRecommend, setEmailRecommend] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [alertReady, setAlertReady] = useState(true);
  const [alertCoding, setAlertCoding] = useState(true);

  // Billing Interval State
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        if (user) {
          setUser({
            ...user,
            image: reader.result as string
          });
          toast.success("Avatar updated successfully!", { icon: "📸" });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneralSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user) {
      setUser({
        ...user,
        name: fullName,
        email: emailAddress,
        role: targetRole
      });
    }
    
    toast.success("Profile details updated successfully!");
    setIsLoading(false);
  };

  const handleSecuritySave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    toast.success("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsLoading(false);
  };

  const handleNotificationSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    toast.success("Notification preferences saved!");
    setIsLoading(false);
  };

  const handlePlanUpgrade = async (plan: 'free' | 'pro' | 'enterprise') => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (user) {
      setUser({
        ...user,
        plan: plan
      });
    }
    
    toast.success(`Subscription successfully changed to ${plan.toUpperCase()}!`, {
      icon: '🎉'
    });
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
                   <div className="relative group w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-black text-white text-2xl shadow-xl border border-white/10 cursor-pointer">
                      {user?.image ? (
                         <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                      ) : (
                         user?.name?.[0] || "U"
                      )}
                      
                      {/* Hover overlay to change avatar */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                         <span className="text-[9px] font-black uppercase tracking-wider text-white">Change</span>
                         <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                         />
                      </div>
                   </div>
                  <div>
                     <h3 className="text-lg font-bold text-white truncate max-w-[150px]">{user?.name || "User"}</h3>
                     <p className="text-xs font-bold text-slate-500 truncate max-w-[150px]">{user?.email || "user@example.com"}</p>
                  </div>
               </div>
               
               <div className="space-y-1">
                  <button 
                    onClick={() => setActiveTab('general')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'general' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                  >
                     <span className="flex items-center gap-3">
                       <User className={`w-4 h-4 ${activeTab === 'general' ? 'text-purple-400' : ''}`} /> General
                     </span>
                     <ChevronRight className={`w-4 h-4 ${activeTab === 'general' ? 'text-purple-400' : 'opacity-0'}`} />
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'security' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                  >
                     <span className="flex items-center gap-3">
                       <Shield className={`w-4 h-4 ${activeTab === 'security' ? 'text-purple-400' : ''}`} /> Security
                     </span>
                     <ChevronRight className={`w-4 h-4 ${activeTab === 'security' ? 'text-purple-400' : 'opacity-0'}`} />
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'notifications' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                  >
                     <span className="flex items-center gap-3">
                       <Bell className={`w-4 h-4 ${activeTab === 'notifications' ? 'text-purple-400' : ''}`} /> Notifications
                     </span>
                     <ChevronRight className={`w-4 h-4 ${activeTab === 'notifications' ? 'text-purple-400' : 'opacity-0'}`} />
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('billing')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'billing' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                  >
                     <span className="flex items-center gap-3">
                       <CreditCard className={`w-4 h-4 ${activeTab === 'billing' ? 'text-purple-400' : ''}`} /> Billing
                     </span>
                     <ChevronRight className={`w-4 h-4 ${activeTab === 'billing' ? 'text-purple-400' : 'opacity-0'}`} />
                  </button>
               </div>
            </GlassCard>

            <GlassCard className="p-6 border-purple-500/20 bg-purple-500/5 relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 blur-[30px] rounded-full" />
               <h4 className="text-xs font-black uppercase tracking-widest text-purple-400 flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Current Plan
               </h4>
               <p className="text-2xl font-black text-white tracking-tighter mb-4 capitalize">{user?.plan || "Pro"} Tier</p>
               <button onClick={() => setActiveTab('billing')} className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-colors shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                  Change Plan
               </button>
            </GlassCard>
         </div>

         {/* Right Column: Settings Form Panels */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <>
                <GlassCard className="p-8 border-white/5">
                   <h3 className="text-xl font-bold text-white mb-6">Profile Information</h3>
                   
                   <form className="space-y-6" onSubmit={handleGeneralSave}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Name</label>
                            <input 
                               type="text" 
                               value={fullName}
                               onChange={(e) => setFullName(e.target.value)}
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
                                  value={emailAddress}
                                  onChange={(e) => setEmailAddress(e.target.value)}
                                  required
                                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors disabled:opacity-50" 
                               />
                            </div>
                         </div>
                      </div>

                       {/* Profile Photo Row */}
                       <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Avatar Image</label>
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-md">
                                {user?.image ? (
                                   <img src={user.image} alt="Avatar Preview" className="w-full h-full object-cover" />
                                ) : (
                                   fullName?.[0] || "U"
                                )}
                             </div>
                             <div className="flex gap-2">
                                <label className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer transition-colors shadow-md">
                                   Upload Photo
                                   <input 
                                      type="file" 
                                      accept="image/*"
                                      onChange={handleAvatarChange}
                                      className="hidden" 
                                   />
                                </label>
                                {user?.image && (
                                   <button 
                                      type="button"
                                      onClick={() => {
                                         if (user) {
                                            setUser({ ...user, image: undefined });
                                            toast.success("Avatar removed");
                                         }
                                      }}
                                      className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-xs transition-colors border border-red-500/20"
                                   >
                                      Remove
                                   </button>
                                )}
                             </div>
                          </div>
                       </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Target Role</label>
                         <input 
                            type="text" 
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
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
              </>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <>
                <GlassCard className="p-8 border-white/5">
                   <h3 className="text-xl font-bold text-white mb-6">Update Password</h3>
                   
                   <form className="space-y-6" onSubmit={handleSecuritySave}>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Current Password</label>
                         <div className="relative">
                            <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input 
                               type="password" 
                               value={currentPassword}
                               onChange={(e) => setCurrentPassword(e.target.value)}
                               placeholder="••••••••"
                               required
                               className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors" 
                            />
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">New Password</label>
                            <div className="relative">
                               <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                               <input 
                                  type="password" 
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  placeholder="••••••••"
                                  required
                                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors" 
                               />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Confirm New Password</label>
                            <div className="relative">
                               <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                               <input 
                                  type="password" 
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  placeholder="••••••••"
                                  required
                                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors" 
                               />
                            </div>
                         </div>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex justify-end">
                         <button 
                           type="submit"
                           disabled={isLoading}
                           className="px-6 py-3 rounded-xl bg-white text-black font-black text-sm hover:bg-slate-200 transition-colors flex items-center gap-2 disabled:opacity-70"
                         >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />} 
                            {isLoading ? "Updating..." : "Update Password"}
                         </button>
                      </div>
                   </form>
                </GlassCard>

                <GlassCard className="p-8 border-white/5">
                   <div className="flex items-center justify-between">
                      <div>
                         <h3 className="text-xl font-bold text-white mb-2">Two-Factor Authentication</h3>
                         <p className="text-sm text-slate-400">Add an extra layer of security to your account by requiring an OTP token.</p>
                      </div>
                      <button 
                        onClick={() => {
                          setTwoFactor(!twoFactor);
                          toast.success(`Two-Factor Authentication ${!twoFactor ? 'enabled' : 'disabled'}`);
                        }}
                        className={`w-14 h-8 rounded-full transition-colors flex items-center p-1 ${twoFactor ? 'bg-purple-600 justify-end' : 'bg-slate-800 justify-start'}`}
                      >
                         <span className="w-6 h-6 rounded-full bg-white shadow-md block" />
                      </button>
                   </div>
                </GlassCard>

                <GlassCard className="p-8 border-white/5">
                   <h3 className="text-xl font-bold text-white mb-6">Active Sessions</h3>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                         <div className="flex items-center gap-4">
                            <Laptop className="w-8 h-8 text-purple-400" />
                            <div>
                               <p className="text-sm font-bold text-white">Chrome on Windows (Current)</p>
                               <p className="text-[10px] font-bold text-slate-500">Noida, India • Active Now</p>
                            </div>
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">Current Session</span>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 opacity-70">
                         <div className="flex items-center gap-4">
                            <Smartphone className="w-8 h-8 text-slate-400" />
                            <div>
                               <p className="text-sm font-bold text-white">Safari on iPhone 15 Pro</p>
                               <p className="text-[10px] font-bold text-slate-500">Mumbai, India • 2 hours ago</p>
                            </div>
                         </div>
                         <button onClick={() => toast.success("Session revoked")} className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300">Revoke</button>
                      </div>
                   </div>
                </GlassCard>
              </>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <GlassCard className="p-8 border-white/5">
                 <h3 className="text-xl font-bold text-white mb-2">Notification Preferences</h3>
                 <p className="text-sm text-slate-400 mb-8">Configure when and where you would like to be notified.</p>

                 <form className="space-y-8" onSubmit={handleNotificationSave}>
                    <div className="space-y-4">
                       <h4 className="text-xs font-black uppercase tracking-widest text-purple-400 border-b border-white/5 pb-2">Email Notifications</h4>
                       
                       <div className="flex items-center justify-between py-1">
                          <div>
                             <p className="text-sm font-bold text-white">Weekly Progress Report</p>
                             <p className="text-xs text-slate-500">Receive a weekly digest of your coding performance and interview scores.</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setEmailProgress(!emailProgress)}
                            className={`w-12 h-7 rounded-full transition-colors flex items-center p-0.5 ${emailProgress ? 'bg-purple-600 justify-end' : 'bg-slate-800 justify-start'}`}
                          >
                             <span className="w-6 h-6 rounded-full bg-white shadow-md block" />
                          </button>
                       </div>

                       <div className="flex items-center justify-between py-1">
                          <div>
                             <p className="text-sm font-bold text-white">Interview Recommendations</p>
                             <p className="text-xs text-slate-500">Get suggestions for interview rooms tailored to your target role.</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setEmailRecommend(!emailRecommend)}
                            className={`w-12 h-7 rounded-full transition-colors flex items-center p-0.5 ${emailRecommend ? 'bg-purple-600 justify-end' : 'bg-slate-800 justify-start'}`}
                          >
                             <span className="w-6 h-6 rounded-full bg-white shadow-md block" />
                          </button>
                       </div>

                       <div className="flex items-center justify-between py-1">
                          <div>
                             <p className="text-sm font-bold text-white">Product Updates</p>
                             <p className="text-xs text-slate-500">Stay informed about new coding rounds, languages, and features.</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setEmailUpdates(!emailUpdates)}
                            className={`w-12 h-7 rounded-full transition-colors flex items-center p-0.5 ${emailUpdates ? 'bg-purple-600 justify-end' : 'bg-slate-800 justify-start'}`}
                          >
                             <span className="w-6 h-6 rounded-full bg-white shadow-md block" />
                          </button>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-xs font-black uppercase tracking-widest text-purple-400 border-b border-white/5 pb-2">Platform Alerts</h4>
                       
                       <div className="flex items-center justify-between py-1">
                          <div>
                             <p className="text-sm font-bold text-white">Evaluation Ready Notifications</p>
                             <p className="text-xs text-slate-500">Get notified immediately when your AI interview evaluation report is ready.</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setAlertReady(!alertReady)}
                            className={`w-12 h-7 rounded-full transition-colors flex items-center p-0.5 ${alertReady ? 'bg-purple-600 justify-end' : 'bg-slate-800 justify-start'}`}
                          >
                             <span className="w-6 h-6 rounded-full bg-white shadow-md block" />
                          </button>
                       </div>

                       <div className="flex items-center justify-between py-1">
                          <div>
                             <p className="text-sm font-bold text-white">Coding Feedback</p>
                             <p className="text-xs text-slate-500">Alerts when code execution is resolved or static analysis completes.</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setAlertCoding(!alertCoding)}
                            className={`w-12 h-7 rounded-full transition-colors flex items-center p-0.5 ${alertCoding ? 'bg-purple-600 justify-end' : 'bg-slate-800 justify-start'}`}
                          >
                             <span className="w-6 h-6 rounded-full bg-white shadow-md block" />
                          </button>
                       </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-end">
                       <button 
                         type="submit"
                         disabled={isLoading}
                         className="px-6 py-3 rounded-xl bg-white text-black font-black text-sm hover:bg-slate-200 transition-colors flex items-center gap-2 disabled:opacity-70"
                       >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} 
                          {isLoading ? "Saving Preferences..." : "Save Preferences"}
                       </button>
                    </div>
                 </form>
              </GlassCard>
            )}

            {/* BILLING TAB */}
            {activeTab === 'billing' && (
              <>
                <GlassCard className="p-8 border-white/5">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                      <div>
                         <h3 className="text-xl font-bold text-white">Subscription & Plans</h3>
                         <p className="text-sm text-slate-400">Scale your preparations as you practice for your dream jobs.</p>
                      </div>
                      
                      {/* Interval Switcher */}
                      <div className="flex items-center bg-white/5 border border-white/5 p-1 rounded-xl">
                         <button 
                           onClick={() => setBillingInterval('monthly')}
                           className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${billingInterval === 'monthly' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                         >
                           Monthly
                         </button>
                         <button 
                           onClick={() => setBillingInterval('yearly')}
                           className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${billingInterval === 'yearly' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                         >
                           Yearly <span className="bg-emerald-500/20 text-emerald-400 font-black px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider">Save 20%</span>
                         </button>
                      </div>
                   </div>

                   {/* Pricing Cards */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* FREE PLAN */}
                      <div className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${user?.plan === 'free' ? 'border-purple-500/50 bg-purple-500/5 shadow-[0_0_25px_rgba(147,51,234,0.1)]' : 'border-white/5 bg-white/5'}`}>
                         <div>
                            <h4 className="text-base font-bold text-white mb-1">Free Tier</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-4">Trial Plan</p>
                            <p className="text-3xl font-black text-white tracking-tighter mb-4">$0</p>
                            <ul className="space-y-3 mb-6">
                               <li className="flex items-center gap-2 text-xs text-slate-300">
                                  <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" /> 1 AI Interview
                               </li>
                               <li className="flex items-center gap-2 text-xs text-slate-300">
                                  <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" /> Basic Score metrics
                               </li>
                               <li className="flex items-center gap-2 text-xs text-slate-300">
                                  <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" /> 5 Coding submissions
                               </li>
                            </ul>
                         </div>
                         <button 
                           onClick={() => handlePlanUpgrade('free')}
                           disabled={user?.plan === 'free'}
                           className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors ${user?.plan === 'free' ? 'bg-purple-500/20 text-purple-400 cursor-default border border-purple-500/30' : 'bg-white/5 hover:bg-white/10 text-white'}`}
                         >
                            {user?.plan === 'free' ? "Active Plan" : "Downgrade"}
                         </button>
                      </div>

                      {/* PRO PLAN */}
                      <div className={`p-6 rounded-2xl border flex flex-col justify-between relative transition-all ${user?.plan === 'pro' || !user?.plan ? 'border-purple-500/70 bg-purple-500/10 shadow-[0_0_35px_rgba(147,51,234,0.15)] scale-105' : 'border-white/5 bg-white/5'}`}>
                         <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Most Popular</div>
                         <div>
                            <h4 className="text-base font-bold text-white mb-1">Pro Tier</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-4">Unlimited Prep</p>
                            <p className="text-3xl font-black text-white tracking-tighter mb-4">
                              {billingInterval === 'monthly' ? "$19" : "$15"}<span className="text-xs text-slate-500 font-bold">/mo</span>
                            </p>
                            <ul className="space-y-3 mb-6">
                               <li className="flex items-center gap-2 text-xs text-slate-300">
                                  <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" /> Unlimited AI Interviews
                               </li>
                               <li className="flex items-center gap-2 text-xs text-slate-300">
                                  <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" /> Advanced AI Feedback
                               </li>
                               <li className="flex items-center gap-2 text-xs text-slate-300">
                                  <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" /> Unlimited Code runs
                               </li>
                               <li className="flex items-center gap-2 text-xs text-slate-300">
                                  <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" /> Priority Support
                               </li>
                            </ul>
                         </div>
                         <button 
                           onClick={() => handlePlanUpgrade('pro')}
                           disabled={user?.plan === 'pro' || !user?.plan}
                           className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors ${user?.plan === 'pro' || !user?.plan ? 'bg-purple-600 text-white cursor-default shadow-md' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
                         >
                            {user?.plan === 'pro' || !user?.plan ? "Active Plan" : "Upgrade to Pro"}
                         </button>
                      </div>

                      {/* ENTERPRISE PLAN */}
                      <div className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${user?.plan === 'enterprise' ? 'border-purple-500/50 bg-purple-500/5 shadow-[0_0_25px_rgba(147,51,234,0.1)]' : 'border-white/5 bg-white/5'}`}>
                         <div>
                            <h4 className="text-base font-bold text-white mb-1">Enterprise</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-4">For Teams</p>
                            <p className="text-3xl font-black text-white tracking-tighter mb-4">
                              {billingInterval === 'monthly' ? "$99" : "$79"}<span className="text-xs text-slate-500 font-bold">/mo</span>
                            </p>
                            <ul className="space-y-3 mb-6">
                               <li className="flex items-center gap-2 text-xs text-slate-300">
                                  <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" /> Custom Rubrics & Roles
                               </li>
                               <li className="flex items-center gap-2 text-xs text-slate-300">
                                  <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" /> Team Performance Dash
                               </li>
                               <li className="flex items-center gap-2 text-xs text-slate-300">
                                  <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" /> Dedicated Account Manager
                               </li>
                            </ul>
                         </div>
                         <button 
                           onClick={() => handlePlanUpgrade('enterprise')}
                           disabled={user?.plan === 'enterprise'}
                           className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors ${user?.plan === 'enterprise' ? 'bg-purple-500/20 text-purple-400 cursor-default border border-purple-500/30' : 'bg-white/5 hover:bg-white/10 text-white'}`}
                         >
                            {user?.plan === 'enterprise' ? "Active Plan" : "Upgrade Tier"}
                         </button>
                      </div>
                   </div>
                </GlassCard>

                <GlassCard className="p-8 border-white/5">
                   <h3 className="text-xl font-bold text-white mb-6">Billing History</h3>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-300">
                         <thead className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/10">
                            <tr>
                               <th className="pb-3">Date</th>
                               <th className="pb-3">Invoice ID</th>
                               <th className="pb-3">Amount</th>
                               <th className="pb-3">Status</th>
                               <th className="pb-3 text-right">Receipt</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                            <tr>
                               <td className="py-4 font-bold text-white">May 15, 2026</td>
                               <td className="py-4 text-slate-400">INV-2026-042</td>
                               <td className="py-4 font-black">$19.00</td>
                               <td className="py-4">
                                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Paid</span>
                               </td>
                               <td className="py-4 text-right">
                                  <button onClick={() => toast.success("Receipt downloaded!")} className="text-purple-400 hover:text-purple-300 font-bold inline-flex items-center gap-1"><Download className="w-3.5 h-3.5" /> PDF</button>
                               </td>
                            </tr>
                            <tr>
                               <td className="py-4 font-bold text-white">Apr 15, 2026</td>
                               <td className="py-4 text-slate-400">INV-2026-018</td>
                               <td className="py-4 font-black">$19.00</td>
                               <td className="py-4">
                                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Paid</span>
                               </td>
                               <td className="py-4 text-right">
                                  <button onClick={() => toast.success("Receipt downloaded!")} className="text-purple-400 hover:text-purple-300 font-bold inline-flex items-center gap-1"><Download className="w-3.5 h-3.5" /> PDF</button>
                               </td>
                            </tr>
                         </tbody>
                      </table>
                   </div>
                </GlassCard>
              </>
            )}

         </div>
      </div>
    </DashboardLayout>
  );
}
