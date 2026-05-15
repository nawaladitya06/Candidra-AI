"use client";

import { motion } from "framer-motion";
import { Brain, Github, Mail, ArrowRight, Chrome } from "lucide-react";
import Link from "next/link";
import { AnimatedBg } from "@/components/ui/AnimatedBg";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppStore } from "@/lib/store";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUser, setAuthenticated } = useAppStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API Auth
    setTimeout(() => {
      setIsLoading(false);
      
      setUser({
        id: `user-${Date.now()}`,
        name: email.split("@")[0] || "User",
        email: email,
        plan: "pro",
        joinedAt: new Date().toISOString(),
        interviewsCompleted: 0,
        avgScore: 0,
        role: "Software Engineer",
      });
      setAuthenticated(true);
      
      toast.success("Welcome back to HireMind AI!");
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6 relative overflow-hidden">
      <AnimatedBg />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass p-10 rounded-[2rem] border-white/10 glow-purple shadow-2xl">
          <div className="flex flex-col items-center text-center mb-10">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-sm text-slate-500">Sign in to continue your preparation.</p>
          </div>

          <div className="space-y-4 mb-8">
            <button className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 py-3 rounded-xl text-sm font-bold text-slate-300 transition-all">
               <Chrome className="w-5 h-5 text-blue-500" /> Sign in with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 py-3 rounded-xl text-sm font-bold text-slate-300 transition-all">
               <Github className="w-5 h-5 text-white" /> Sign in with GitHub
            </button>
          </div>

          <div className="relative mb-8">
             <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
             </div>
             <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className="bg-[#0c0c16] px-4 text-slate-600">Or continue with</span>
             </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
               <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block ml-1">Email Address</label>
               <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com" 
                className="input-field"
               />
            </div>
            <div>
               <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Password</label>
                  <Link href="#" className="text-[10px] uppercase font-bold text-purple-500 hover:text-purple-400">Forgot?</Link>
               </div>
               <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="input-field"
               />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-base disabled:opacity-50"
            >
               {isLoading ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               ) : (
                 <>Sign In <ArrowRight className="w-4 h-4" /></>
               )}
            </button>
          </form>

          <p className="text-center mt-10 text-xs text-slate-500">
             Don't have an account? <Link href="/register" className="text-purple-500 font-bold hover:text-purple-400">Sign Up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
