"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Star, Shield, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Script from "next/script";

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
    price: "₹2400",
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
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoadingPlan("Professional");
    try {
      // 1. Create order
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 240000, currency: "INR" }) // ₹2400.00
      });

      const data = await res.json();
      
      if (!res.ok) {
         if (res.status === 401) {
            toast.error("Please login first to upgrade.");
            router.push("/login");
            return;
         }
         throw new Error(data.error || "Failed to create order");
      }

      // 2. Open Razorpay modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: data.amount,
        currency: data.currency,
        name: "Candidra AI",
        description: "Professional Plan Upgrade",
        order_id: data.order_id,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
             toast.success("Payment successful! You are now on the Professional plan.");
             router.push("/dashboard");
          } else {
             toast.error(verifyData.error || "Payment verification failed.");
          }
        },
        theme: {
          color: "#3b82f6"
        }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
         toast.error(response.error.description || "Payment failed");
      });
      rzp.open();

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingPlan(null);
    }
  };

  const onPlanClick = (planName: string) => {
    if (planName === "Professional") {
      handleCheckout();
    } else if (planName === "Foundation") {
      router.push("/register");
    } else {
      router.push("/contact");
    }
  };

  return (
    <div className="relative">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="text-center mb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="badge badge-blue mb-8"
        >
          Investment
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="brutal-heading text-4xl sm:text-5xl md:text-7xl text-white mb-6 leading-[0.9]"
        >
          Simple, honest <br className="hidden md:block" />
          <span className="text-primary brutal-shadow">pricing.</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-slate-400 font-bold font-mono text-base sm:text-lg md:text-xl max-w-2xl mx-auto uppercase tracking-tight"
        >
          No complex tiers. Choose the plan that aligns with your current career trajectory.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1200px] mx-auto items-center">
        {PLANS.map((plan, index) => (
          <div 
            key={index} 
            className={cn(
              "flex flex-col relative transition-transform duration-300 bg-black border-4 brutal-shadow p-6 sm:p-10",
              plan.popular 
                ? 'border-primary lg:scale-105 z-10 shadow-[16px_16px_0px_0px_rgba(59,130,246,1)]' 
                : 'border-white/20 hover:translate-x-[2px] hover:translate-y-[2px]'
            )}
          >
            {plan.popular && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-black font-black uppercase text-[10px] tracking-widest px-4 py-1 border-2 border-black">
                Most Popular
              </div>
            )}

            <div className="mb-10">
              <div className={cn(
                "w-14 h-14 border-2 border-white/20 flex items-center justify-center mb-8 brutal-shadow-sm",
                plan.popular ? "bg-primary text-black" : "bg-black text-white"
              )}>
                {plan.icon}
              </div>
              <h3 className="brutal-heading text-3xl text-white mb-4 tracking-tighter">{plan.name}</h3>
              <p className="text-slate-400 font-medium font-mono text-sm leading-relaxed mb-6 min-h-[48px] uppercase tracking-tight">{plan.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-black text-white tracking-tighter font-mono">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-primary font-bold text-lg font-mono">/mo</span>}
              </div>
            </div>

            <div className="space-y-5 mb-12 flex-1">
              {plan.features.map((feature, fIndex) => (
                <div key={fIndex} className="flex items-start gap-4">
                  <div className={cn(
                    "w-6 h-6 border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                    plan.popular ? "bg-primary border-black text-black" : "bg-black border-white/20 text-white"
                  )}>
                    <Check className="w-4 h-4 font-black" strokeWidth={3} />
                  </div>
                  <span className="font-bold font-mono text-xs uppercase tracking-tight text-white">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => onPlanClick(plan.name)}
              disabled={loadingPlan === plan.name}
              className={cn(
              "w-full py-5 font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group border-2 font-mono",
              plan.popular 
              ? 'bg-primary text-black border-black hover:bg-white' 
              : 'bg-black text-white hover:bg-white hover:text-black border-white/20'
            )}>
              {loadingPlan === plan.name ? (
                 <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                 <>
                   {plan.cta}
                   {plan.popular && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                 </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
