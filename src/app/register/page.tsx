"use client";

import { motion } from "framer-motion";
import { Github, ArrowRight, Chrome, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppStore } from "@/lib/store";
import { signIn } from "next-auth/react";

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      const signInRes = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInRes?.error) {
        toast.error("Account created, but sign in failed. Please login manually.");
        router.push("/login");
      } else {
        toast.success("Account created successfully! Welcome to Candidra.");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 grid-pattern opacity-[0.05] pointer-events-none" />
      
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
         {/* Branding Side */}
         <div className="hidden lg:block space-y-8">
            <div className="w-14 h-14 bg-black border-2 border-white/20 flex items-center justify-center brutal-shadow-sm overflow-hidden">
               <img src="/icon.png?v=4" alt="Candidra AI Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-5xl font-black text-white leading-tight uppercase font-mono tracking-tighter">
               Build your future <br />with <span className="text-primary">Candidra AI</span>.
            </h1>
            <p className="text-sm text-slate-400 max-w-md font-mono">
               The platform used by top engineers to practice, refine, and master the interview process.
            </p>
            <div className="space-y-4">
               {[
                 "Free tier available for students",
                 "Gemini 1.5 Powered feedback",
                 "Voice & Coding simulations",
                 "Detailed performance analytics"
               ].map((text, i) => (
                 <div key={i} className="flex items-center gap-3 text-white">
                    <div className="w-6 h-6 border-2 border-primary bg-primary/20 flex items-center justify-center flex-shrink-0">
                       <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-xs font-bold font-mono uppercase tracking-tight">{text}</span>
                 </div>
               ))}
            </div>
         </div>

         {/* Form Side */}
         <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.4 }}
           className="w-full max-w-md mx-auto"
         >
           <div className="p-10 bg-black border-4 border-white/20 brutal-shadow">
             <div className="mb-10 lg:hidden text-center">
                <h1 className="text-3xl font-black text-white uppercase font-mono tracking-tighter mb-2">Create Account</h1>
                <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Join the future of recruitment.</p>
             </div>

             <div className="space-y-3 mb-8">
               <button 
                 type="button"
                 onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                 className="w-full flex items-center justify-center gap-3 bg-black hover:bg-[#111] border-2 border-white/20 py-3 text-xs font-black text-white uppercase tracking-widest transition-all font-mono brutal-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px]"
               >
                  <Chrome className="w-5 h-5" /> Sign up with Google
               </button>
               <button 
                 type="button"
                 onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                 className="w-full flex items-center justify-center gap-3 bg-black hover:bg-[#111] border-2 border-white/20 py-3 text-xs font-black text-white uppercase tracking-widest transition-all font-mono brutal-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px]"
               >
                  <Github className="w-5 h-5 text-white" /> Sign up with GitHub
               </button>
             </div>

             <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t-2 border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
                   <span className="bg-black px-4 text-slate-600 font-mono">Or use email</span>
                </div>
             </div>

             <form onSubmit={handleRegister} className="space-y-5">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-[10px] uppercase font-black text-primary mb-2 block ml-1 font-mono tracking-widest">First Name</label>
                     <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} placeholder="Alex" className="w-full bg-black border-2 border-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors font-mono" />
                  </div>
                  <div>
                     <label className="text-[10px] uppercase font-black text-primary mb-2 block ml-1 font-mono tracking-widest">Last Name</label>
                     <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} placeholder="Johnson" className="w-full bg-black border-2 border-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors font-mono" />
                  </div>
               </div>
               <div>
                  <label className="text-[10px] uppercase font-black text-primary mb-2 block ml-1 font-mono tracking-widest">Email Address</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="alex@example.com" className="w-full bg-black border-2 border-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors font-mono" />
               </div>
               <div>
                  <label className="text-[10px] uppercase font-black text-primary mb-2 block ml-1 font-mono tracking-widest">Password</label>
                  <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full bg-black border-2 border-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors font-mono" />
               </div>

               <button 
                 type="submit"
                 disabled={isLoading}
                 className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest mt-2 disabled:opacity-50"
               >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Create Account <ArrowRight className="w-4 h-4" /></>
                  )}
               </button>
             </form>

             <p className="text-center mt-10 text-xs text-slate-500 font-mono">
                Already have an account? <Link href="/login" className="text-primary font-black hover:text-white uppercase">Sign In</Link>
             </p>
           </div>
         </motion.div>
      </div>
    </div>
  );
}
