"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Mic, Code2, FileText, BarChart3, User, Settings,
  ChevronLeft, ChevronRight, Star, Shield, Zap, LogOut, Sparkles, Mail
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn, ROLES_BY_STREAM } from "@/lib/utils";

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
            className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-black border-r-2 border-white/20 flex flex-col z-50 overflow-hidden transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="h-20 flex items-center px-6 border-b-2 border-white/20">
          <Link href="/dashboard" className="flex items-center gap-3 w-full group overflow-hidden">
            <div className="w-10 h-10 flex-shrink-0 border-2 border-white/20 bg-black flex items-center justify-center brutal-shadow-sm overflow-hidden">
               <img src="/icon.png?v=6" alt="Candidra" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-black text-white uppercase font-mono tracking-tighter whitespace-nowrap">
              Candidra
            </span>
          </Link>
        </div>

         {/* Navigation */}
        <div className="flex-1 py-8 flex flex-col gap-8 overflow-y-auto px-4">
           <div>
              <h4 className="px-2 text-[10px] font-black uppercase tracking-widest text-primary mb-4 whitespace-nowrap font-mono">
                Platform
              </h4>
              <div className="space-y-2">
                {(() => {
                  const userRole = user?.role || "";
                  const isSoftware = !userRole || (ROLES_BY_STREAM["Software Engineering & IT"]?.includes(userRole));
                  const filteredNavItems = navItems.filter((item) => {
                    if (item.href === "/coding") return isSoftware;
                    if (item.href === "/interview/setup") return !isSoftware;
                    return true;
                  });

                  return filteredNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link key={item.href} href={item.href}>
                        <div className={cn(
                          "flex items-center gap-3 px-4 py-3 border-2 transition-all font-mono text-xs uppercase tracking-tight",
                          isActive 
                            ? "bg-primary text-black border-primary brutal-shadow-sm translate-x-[2px] translate-y-[2px]" 
                            : "bg-black text-white border-transparent hover:border-white/20 hover:bg-[#111]"
                        )}>
                          <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-black" : "text-white")} />
                          <span className="font-bold whitespace-nowrap">
                            {item.label}
                          </span>
                        </div>
                      </Link>
                    );
                  });
                })()}
              </div>
           </div>

           <div>
              <h4 className="px-2 text-[10px] font-black uppercase tracking-widest text-primary mb-4 whitespace-nowrap font-mono">
                Account
              </h4>
              <div className="space-y-2">
                 <Link href="/settings">
                    <div className={cn(
                        "flex items-center gap-3 px-4 py-3 border-2 transition-all font-mono text-xs uppercase tracking-tight",
                        pathname === "/settings" 
                          ? "bg-primary text-black border-primary brutal-shadow-sm translate-x-[2px] translate-y-[2px]" 
                          : "bg-black text-white border-transparent hover:border-white/20 hover:bg-[#111]"
                      )}>
                       <Settings className="w-4 h-4 flex-shrink-0" />
                       <span className="font-bold whitespace-nowrap">
                          Settings
                       </span>
                    </div>
                 </Link>
              </div>
           </div>

           {user?.email && ["nawaladitya06@gmail.com"].includes(user.email) && (
             <div>
                <h4 className="px-2 text-[10px] font-black uppercase tracking-widest text-primary mb-4 whitespace-nowrap font-mono">
                  Admin
                </h4>
                <div className="space-y-2">
                   <Link href="/admin">
                      <div className={cn(
                          "flex items-center gap-3 px-4 py-3 border-2 transition-all font-mono text-xs uppercase tracking-tight",
                          pathname === "/admin" 
                            ? "bg-primary text-black border-primary brutal-shadow-sm translate-x-[2px] translate-y-[2px]" 
                            : "bg-black text-white border-transparent hover:border-white/20 hover:bg-[#111]"
                        )}>
                         <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                         <span className="font-bold whitespace-nowrap">
                            Dashboard
                         </span>
                      </div>
                   </Link>
                   <Link href="/admin/users">
                      <div className={cn(
                          "flex items-center gap-3 px-4 py-3 border-2 transition-all font-mono text-xs uppercase tracking-tight",
                          pathname === "/admin/users" 
                            ? "bg-primary text-black border-primary brutal-shadow-sm translate-x-[2px] translate-y-[2px]" 
                            : "bg-black text-white border-transparent hover:border-white/20 hover:bg-[#111]"
                        )}>
                         <User className="w-4 h-4 flex-shrink-0" />
                         <span className="font-bold whitespace-nowrap">
                            Users
                         </span>
                      </div>
                   </Link>
                   <Link href="/admin/contacts">
                      <div className={cn(
                          "flex items-center gap-3 px-4 py-3 border-2 transition-all font-mono text-xs uppercase tracking-tight",
                          pathname === "/admin/contacts" 
                            ? "bg-primary text-black border-primary brutal-shadow-sm translate-x-[2px] translate-y-[2px]" 
                            : "bg-black text-white border-transparent hover:border-white/20 hover:bg-[#111]"
                        )}>
                         <Mail className="w-4 h-4 flex-shrink-0" />
                         <span className="font-bold whitespace-nowrap">
                            Contacts
                         </span>
                      </div>
                   </Link>
                </div>
             </div>
           )}
        </div>

        {/* Footer / User */}
        <div className="p-4 border-t-2 border-white/20 relative bg-black">
          <div className="p-4 bg-black border-2 border-white/20 mb-4 brutal-shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex-shrink-0 border-2 border-white/20 bg-primary flex items-center justify-center font-black text-black text-xs brutal-shadow-sm">
                   {user?.image ? (
                     <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover grayscale" />
                   ) : (
                     user?.name?.[0] || "U"
                   )}
                </div>
                <div className="min-w-0">
                   <p className="text-sm font-bold text-white truncate font-mono uppercase">{user?.name || "User"}</p>
                   <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary font-mono">Pro Tier</span>
                   </div>
                </div>
             </div>
             <button 
              onClick={handleLogout}
              className="w-full py-3 bg-red-600 text-white border-2 border-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-red-500 hover:border-red-500 transition-all flex items-center justify-center gap-2 font-mono"
             >
                <LogOut className="w-4 h-4" /> Sign Out
             </button>
          </div>
        </div>
      </aside>
    </>
  );
}
