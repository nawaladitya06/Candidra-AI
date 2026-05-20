"use client";

import { motion } from "framer-motion";
import { Github, Mail, ArrowRight, Chrome } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppStore } from "@/lib/store";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUser, setAuthenticated } = useAppStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid email or password.");
      } else {
        toast.success("Welcome back to Candidra AI!");
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 grid-pattern opacity-[0.05] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="p-10 bg-black border-4 border-white/20 brutal-shadow">
          <div className="flex flex-col items-center text-center mb-10">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 border-2 border-white/20 bg-black flex items-center justify-center brutal-shadow-sm overflow-hidden">
                <img src="/icon.png?v=6" alt="Candidra AI Logo" className="w-full h-full object-cover" />
              </div>
            </Link>
            <h1 className="text-3xl font-black text-white uppercase font-mono tracking-tighter mb-2">Welcome Back</h1>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Sign in to continue your preparation.</p>
          </div>

          <div className="space-y-3 mb-8">
            <button 
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 bg-black hover:bg-[#111] border-2 border-white/20 py-3 text-xs font-black text-white uppercase tracking-widest transition-all font-mono brutal-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px]"
            >
               <Chrome className="w-5 h-5" /> Sign in with Google
            </button>
            <button 
              type="button"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 bg-black hover:bg-[#111] border-2 border-white/20 py-3 text-xs font-black text-white uppercase tracking-widest transition-all font-mono brutal-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px]"
            >
               <Github className="w-5 h-5 text-white" /> Sign in with GitHub
            </button>
          </div>

          <div className="relative mb-8">
             <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-white/10"></div>
             </div>
             <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
                <span className="bg-black px-4 text-slate-600 font-mono">Or continue with</span>
             </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
               <label className="text-[10px] uppercase font-black text-primary mb-2 block ml-1 font-mono tracking-widest">Email Address</label>
               <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com" 
                className="w-full bg-black border-2 border-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors font-mono"
               />
            </div>
            <div>
               <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] uppercase font-black text-primary ml-1 font-mono tracking-widest">Password</label>
                  <Link href="#" className="text-[10px] uppercase font-black text-primary hover:text-white font-mono tracking-widest">Forgot?</Link>
               </div>
               <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-black border-2 border-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors font-mono"
               />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest disabled:opacity-50"
            >
               {isLoading ? (
                 <div className="w-5 h-5 border-2 border-black/30 border-t-black animate-spin" />
               ) : (
                 <>Sign In <ArrowRight className="w-4 h-4" /></>
               )}
            </button>
          </form>

          <p className="text-center mt-10 text-xs text-slate-500 font-mono">
             Don&apos;t have an account? <Link href="/register" className="text-primary font-black hover:text-white uppercase">Sign Up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
