"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hoverable?: boolean;
}

export function GlassCard({ children, className, delay = 0, hoverable = true }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "glass-card p-6 md:p-8",
        hoverable && "hover:translate-y-[-4px]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon?: ReactNode;
  color?: "purple" | "blue" | "cyan" | "pink" | "green";
}

export function StatCard({ label, value, change, positive, icon, color = "purple" }: StatCardProps) {
  const colorMap = {
    purple: "text-purple-500 bg-purple-500/10",
    blue: "text-blue-500 bg-blue-500/10",
    cyan: "text-cyan-500 bg-cyan-500/10",
    pink: "text-pink-500 bg-pink-500/10",
    green: "text-green-500 bg-green-500/10",
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2.5 rounded-xl", colorMap[color])}>
          {icon}
        </div>
        {change && (
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full border",
            positive ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
          )}>
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <h4 className="text-2xl font-bold text-white tracking-tight">{value}</h4>
      </div>
    </GlassCard>
  );
}
