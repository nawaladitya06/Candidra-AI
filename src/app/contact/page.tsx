"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { motion } from "framer-motion";
import { Mail, MessageSquare, MapPin, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Message sent successfully! We'll get back to you soon.");
    setIsLoading(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="relative min-h-screen bg-[#030303] selection:bg-purple-500/30">
      <LandingNavbar />
      
      <main className="pt-40 pb-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-custom relative z-10">
           <div className="flex flex-col md:flex-row gap-16 max-w-6xl mx-auto">
              
              <div className="flex-1 pt-8">
                 <motion.h1 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9]"
                 >
                   Let's start a <br />
                   <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">conversation.</span>
                 </motion.h1>
                 <motion.p 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.1 }}
                   className="text-xl text-slate-400 font-medium leading-relaxed max-w-md mb-12"
                 >
                   Whether you are looking to deploy HireMind for your engineering team or just have a question, we are here to help.
                 </motion.p>

                 <div className="space-y-6">
                    <div className="flex items-center gap-4 text-slate-300 font-bold">
                       <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-cyan-400" />
                       </div>
                       hello@hiremind.ai
                    </div>
                    <div className="flex items-center gap-4 text-slate-300 font-bold">
                       <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-blue-400" />
                       </div>
                       Press inquiries: press@hiremind.ai
                    </div>
                    <div className="flex items-center gap-4 text-slate-300 font-bold">
                       <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-indigo-400" />
                       </div>
                       San Francisco, CA
                    </div>
                 </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="flex-1"
              >
                 <GlassCard className="p-8 md:p-12 border-white/10 shadow-[0_0_80px_rgba(6,182,212,0.1)]">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">First Name</label>
                             <input required type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Last Name</label>
                             <input required type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Work Email</label>
                          <input required type="email" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Message</label>
                          <textarea required rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors resize-none" />
                       </div>
                       <button 
                         type="submit"
                         disabled={isLoading}
                         className="w-full py-4 rounded-xl font-black text-white bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30 transition-all uppercase tracking-widest text-sm flex justify-center items-center gap-2 disabled:opacity-50"
                       >
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-cyan-400" /> : null}
                          {isLoading ? "Sending..." : "Send Message"}
                       </button>
                    </form>
                 </GlassCard>
              </motion.div>
              
           </div>
        </div>
      </main>
    </div>
  );
}
