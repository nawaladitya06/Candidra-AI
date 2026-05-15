"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: { label: string; href: string };
}

export function DashboardLayout({ children, title, subtitle, action }: DashboardLayoutProps) {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-[#030303] text-foreground flex">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 grid-pattern opacity-[0.15] pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-600/5 blur-[120px]" />
         <div className="absolute bottom-[-20%] right-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px]" />
      </div>

      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen relative z-10 lg:ml-64 pt-20">
        <TopBar />
        
        <main className="flex-1 p-6 md:p-8 lg:p-10 mt-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
             {(title || action) && (
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                     <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-2">
                        {title}
                     </h1>
                     {subtitle && (
                       <p className="text-slate-500 font-medium">{subtitle}</p>
                     )}
                  </motion.div>
                  
                  {action && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                       <a href={action.href} className="btn-primary py-3 px-8 text-sm inline-flex items-center gap-2">
                          {action.label}
                       </a>
                    </motion.div>
                  )}
               </div>
             )}
             
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: 0.2 }}
             >
                {children}
             </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
