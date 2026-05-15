"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Mic, Code2, FileText, BarChart3, User, Settings,
  Brain, ChevronLeft, ChevronRight, Star, Shield, Zap, LogOut, Sparkles
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/interview/setup", icon: Mic, label: "New Interview" },
  { href: "/coding", icon: Code2, label: "Coding Round" },
  { href: "/resume", icon: FileText, label: "Resume Upload" },
  { href: "/reports", icon: BarChart3, label: "Reports" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, sidebarOpen, toggleSidebar, logout } = useAppStore();

  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-[#030303]/80 backdrop-blur-xl border-r border-white/10 flex flex-col z-50 overflow-hidden transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-3 w-full group overflow-hidden">
            <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black text-white tracking-tighter whitespace-nowrap">
              HireMind
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-8 flex flex-col gap-8 overflow-y-auto px-4">
           <div>
              <h4 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4 whitespace-nowrap">
                Platform
              </h4>
              <div className="space-y-1.5">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href}>
                      <div className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
                        isActive ? "bg-white/10 text-white" : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                      )}>
                        {isActive && (
                          <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-5 bg-purple-500 rounded-r-full" />
                        )}
                        <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-purple-400" : "group-hover:text-purple-400 transition-colors")} />
                        <span className="font-bold text-sm whitespace-nowrap">
                          {item.label}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
           </div>

           <div>
              <h4 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4 whitespace-nowrap">
                Account
              </h4>
              <div className="space-y-1.5">
                 <Link href="/settings">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-white/5 hover:text-slate-300 transition-all group">
                       <Settings className="w-5 h-5 flex-shrink-0 group-hover:text-purple-400 transition-colors" />
                       <span className="font-bold text-sm whitespace-nowrap">
                          Settings
                       </span>
                    </div>
                 </Link>
              </div>
           </div>
        </div>

        {/* Footer / User */}
        <div className="p-4 border-t border-white/10 relative">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-4">
             <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                   {user?.name?.[0] || "U"}
                </div>
                <div className="min-w-0">
                   <p className="text-sm font-bold text-white truncate">{user?.name || "User"}</p>
                   <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span className="text-[10px] font-black uppercase text-purple-400">Pro Tier</span>
                   </div>
                </div>
             </div>
             <button 
              onClick={handleLogout}
              className="w-full py-2 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
             >
                <LogOut className="w-3 h-3" /> Sign Out
             </button>
          </div>
        </div>
      </aside>
    </>
  );
}
