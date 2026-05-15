"use client";

import { motion } from "framer-motion";
import { Brain, Github, Mail, ArrowRight, Chrome, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { AnimatedBg } from "@/components/ui/AnimatedBg";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppStore } from "@/lib/store";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const router = useRouter();
  const { setUser, setAuthenticated } = useAppStore();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API registration
    setTimeout(() => {
      setIsLoading(false);
      
      setUser({
        id: `user-${Date.now()}`,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        plan: "free",
        joinedAt: new Date().toISOString(),
        interviewsCompleted: 0,
        avgScore: 0,
        role: "New User",
      });
      setAuthenticated(true);

      toast.success("Account created successfully! Welcome to HireMind.");
      router.push("/dashboard");
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6 relative overflow-hidden">
      <AnimatedBg />
      
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
         {/* Branding Side */}
         <div className="hidden lg:block space-y-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
               <Brain className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight">
               Build your future <br /> with <span className="gradient-text">HireMind AI</span>.
            </h1>
            <p className="text-lg text-slate-400 max-w-md">
               The platform used by top engineers to practice, refine, and master the interview process.
            </p>
            <div className="space-y-4">
               {[
                 "Free tier available for students",
                 "Gemini 1.5 Powered feedback",
                 "Voice & Coding simulations",
                 "Detailed performance analytics"
               ].map((text, i) => (
                 <div key={i} className="flex items-center gap-3 text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                       <Check className="w-3 h-3 text-purple-500" />
                    </div>
                    <span className="text-sm">{text}</span>
                 </div>
               ))}
            </div>
         </div>

         {/* Form Side */}
         <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5 }}
           className="w-full max-w-md mx-auto"
         >
           <div className="glass p-10 rounded-[2rem] border-white/10 glow-purple shadow-2xl">
             <div className="mb-10 lg:hidden text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                <p className="text-sm text-slate-500">Join the future of recruitment.</p>
             </div>

             <div className="space-y-4 mb-8">
               <button className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 py-3 rounded-xl text-sm font-bold text-slate-300 transition-all">
                  <Chrome className="w-5 h-5 text-blue-500" /> Sign up with Google
               </button>
             </div>

             <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                   <span className="bg-[#0c0c16] px-4 text-slate-600">Or use email</span>
                </div>
             </div>

             <form onSubmit={handleRegister} className="space-y-5">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block ml-1">First Name</label>
                     <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} placeholder="Alex" className="input-field" />
                  </div>
                  <div>
                     <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block ml-1">Last Name</label>
                     <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} placeholder="Johnson" className="input-field" />
                  </div>
               </div>
               <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block ml-1">Email Address</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="alex@example.com" className="input-field" />
               </div>
               <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block ml-1">Password</label>
                  <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="input-field" />
               </div>

               <button 
                 type="submit"
                 disabled={isLoading}
                 className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-base mt-2 disabled:opacity-50"
               >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Create Account <ArrowRight className="w-4 h-4" /></>
                  )}
               </button>
             </form>

             <p className="text-center mt-10 text-xs text-slate-500">
                Already have an account? <Link href="/login" className="text-purple-500 font-bold hover:text-purple-400">Sign In</Link>
             </p>
           </div>
         </motion.div>
      </div>
    </div>
  );
}
