"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { motion } from "framer-motion";
import { Mail, MessageSquare, MapPin, Loader2 } from "lucide-react";
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
    <div className="relative min-h-screen bg-black selection:bg-primary/30">
      <LandingNavbar />
      
      <main className="pt-40 pb-24 relative overflow-hidden">
        <div className="container-custom relative z-10">
           <div className="flex flex-col md:flex-row gap-16 max-w-6xl mx-auto">
              
              <div className="flex-1 pt-8">
                 <motion.h1 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9] brutal-heading uppercase"
                 >
                   Let's start a <br />
                   <span className="text-primary brutal-shadow">conversation.</span>
                 </motion.h1>
                 <motion.p 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.1 }}
                   className="text-xl text-slate-400 font-bold leading-relaxed max-w-md mb-12 font-mono tracking-tight"
                 >
                   Whether you are looking to deploy Candidra for your engineering team or just have a question, we are here to help.
                 </motion.p>

                 <div className="space-y-6">
                    <div className="flex items-center gap-4 text-white font-bold font-mono tracking-tight">
                       <div className="w-12 h-12 border-2 border-white/20 bg-black flex items-center justify-center brutal-shadow-sm">
                          <Mail className="w-5 h-5 text-primary" />
                       </div>
                       <a href="mailto:nawaladitya06@gmail.com" className="hover:text-primary transition-colors">nawaladitya06@gmail.com</a>
                    </div>
                    <div className="flex items-center gap-4 text-white font-bold font-mono tracking-tight">
                       <div className="w-12 h-12 border-2 border-white/20 bg-black flex items-center justify-center brutal-shadow-sm">
                          <MessageSquare className="w-5 h-5 text-primary" />
                       </div>
                       <a href="tel:+918591336819" className="hover:text-primary transition-colors">+91 85913 36819</a>
                    </div>
                    <div className="flex items-center gap-4 text-white font-bold font-mono tracking-tight">
                       <div className="w-12 h-12 border-2 border-white/20 bg-black flex items-center justify-center brutal-shadow-sm">
                          <MapPin className="w-5 h-5 text-primary" />
                       </div>
                       Mumbai, Maharashtra, India
                    </div>
                 </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="flex-1"
              >
                 <div className="p-8 md:p-12 border-4 border-white/20 bg-black brutal-shadow">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-primary font-mono">First Name</label>
                             <input required type="text" className="w-full bg-black border-2 border-white/20 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors brutal-shadow-sm font-mono" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-primary font-mono">Last Name</label>
                             <input required type="text" className="w-full bg-black border-2 border-white/20 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors brutal-shadow-sm font-mono" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary font-mono">Work Email</label>
                          <input required type="email" className="w-full bg-black border-2 border-white/20 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors brutal-shadow-sm font-mono" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary font-mono">Message</label>
                          <textarea required rows={4} className="w-full bg-black border-2 border-white/20 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none brutal-shadow-sm font-mono" />
                       </div>
                       <button 
                         type="submit"
                         disabled={isLoading}
                         className="w-full py-4 border-2 border-black bg-primary font-black text-black hover:bg-white transition-all uppercase tracking-widest text-sm flex justify-center items-center gap-2 disabled:opacity-50 font-mono brutal-shadow-sm"
                       >
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-black" /> : null}
                          {isLoading ? "Sending..." : "Send Message"}
                       </button>
                    </form>
                 </div>
              </motion.div>
              
           </div>
        </div>
      </main>
    </div>
  );
}
