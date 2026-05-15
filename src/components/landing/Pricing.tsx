"use client";

import { motion } from "framer-motion";
import { Check, Zap, Star, Shield, ArrowRight } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Foundation",
    price: "$0",
    description: "Ideal for students starting their tech journey.",
    icon: <Star className="w-6 h-6" />,
    features: [
      "3 AI Interviews per month",
      "Core Performance Score",
      "Community Access",
      "Public Coding Sandbox"
    ],
    cta: "Start Free",
    popular: false
  },
  {
    name: "Professional",
    price: "$24",
    description: "Engineered for active career growth and job seekers.",
    icon: <Zap className="w-6 h-6" />,
    features: [
      "Unlimited AI Interviews",
      "Full Communication Matrix",
      "Resume-First Questioning",
      "Advanced Coding Round",
      "Gemini 1.5 Pro Access"
    ],
    cta: "Upgrade to Professional",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Scalable solutions for elite engineering teams.",
    icon: <Shield className="w-6 h-6" />,
    features: [
      "Custom Role Definitions",
      "Team Management Dashboard",
      "Dedicated API Infrastructure",
      "SSO & Custom Security",
      "24/7 Priority Support"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

export function Pricing() {
  return (
    <div className="relative">
      <div className="text-center mb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 mb-8"
        >
          Investment
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[0.9]"
        >
          Simple, honest <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">pricing.</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-slate-400 font-medium text-lg md:text-xl max-w-2xl mx-auto"
        >
          No complex tiers. Choose the plan that aligns with your current career trajectory.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1200px] mx-auto items-center">
        {PLANS.map((plan, index) => (
          <GlassCard 
            key={index} 
            delay={index * 0.1} 
            hoverable={false}
            className={cn(
              "flex flex-col relative transition-all duration-500",
              plan.popular 
                ? 'p-12 border-purple-500/40 shadow-[0_0_80px_rgba(139,92,246,0.15)] bg-purple-900/[0.05] lg:scale-105 z-10' 
                : 'p-10 border-white/5 bg-white/[0.01] hover:border-white/10'
            )}
          >
            {plan.popular && (
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500" />
            )}

            <div className="mb-10">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-xl",
                plan.popular ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white" : "bg-white/5 text-slate-400"
              )}>
                {plan.icon}
              </div>
              <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">{plan.name}</h3>
              <p className="text-slate-400 font-medium leading-relaxed mb-6 min-h-[48px]">{plan.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-black text-white tracking-tighter">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-slate-500 font-bold text-lg">/mo</span>}
              </div>
            </div>

            <div className="space-y-5 mb-12 flex-1">
              {plan.features.map((feature, fIndex) => (
                <div key={fIndex} className="flex items-start gap-4">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg",
                    plan.popular ? "bg-purple-500/20 text-purple-400" : "bg-white/5 text-slate-400"
                  )}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-slate-300">{feature}</span>
                </div>
              ))}
            </div>

            <button className={cn(
              "w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group",
              plan.popular 
              ? 'btn-primary shadow-[0_0_40px_rgba(139,92,246,0.3)]' 
              : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
            )}>
              {plan.cta}
              {plan.popular && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
