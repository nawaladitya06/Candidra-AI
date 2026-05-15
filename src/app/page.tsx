"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { motion } from "framer-motion";
import { Brain, Twitter, Github, Linkedin, ArrowRight, Star, Quote } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Footer } from "@/components/layout/Footer";

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Senior Frontend Engineer @ Meta",
    content: "The AI's feedback on my communication was uncanny. It picked up on filler words I didn't even know I was using. Landed the Meta offer 2 weeks later.",
    avatar: "S"
  },
  {
    name: "James Wilson",
    role: "Full Stack Developer",
    content: "The coding round simulation is better than most platforms. It doesn't just test if the code works, it tests how you explain your thought process.",
    avatar: "J"
  },
  {
    name: "Amara Okeke",
    role: "Engineering Manager",
    content: "We use HireMind to help our internal candidates prepare for level-up interviews. The role-specific questions are perfectly calibrated.",
    avatar: "A"
  }
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#030303] selection:bg-purple-500/30 font-sans">
      <LandingNavbar />
      
      <main>
        <Hero />
        
        {/* Features Section - Bento Grid */}
        <section id="features" className="section-spacing relative z-10">
           <div className="container-custom">
              <div className="max-w-3xl mb-24 flex flex-col items-center mx-auto text-center">
                 <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   className="inline-flex px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-8"
                 >
                   Core Features
                 </motion.div>
                 <motion.h2 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9]"
                 >
                    Engineered for <br className="hidden md:block" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Elite Performance.</span>
                 </motion.h2>
                 <motion.p 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.1 }}
                   className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl leading-relaxed"
                 >
                    Our platform integrates multiple specialized LLMs to provide the most realistic, high-pressure interview experience ever built.
                 </motion.p>
              </div>
              
              <Features />
           </div>
        </section>

        {/* Transition Gradient */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Testimonials */}
        <section id="testimonials" className="section-spacing relative overflow-hidden">
           {/* Background Glow */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
           
           <div className="container-custom relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-24">
                 <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">Proven <span className="text-slate-500">Results.</span></h2>
                 <p className="text-xl text-slate-400 font-medium">Join top-tier engineers who used HireMind to secure offers.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                 {TESTIMONIALS.map((t, i) => (
                   <GlassCard key={i} delay={i * 0.1} className="p-10 flex flex-col h-full bg-white/[0.01] border-white/5 hover:border-white/10">
                      <div className="flex gap-1.5 mb-8 text-purple-500">
                         {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />)}
                      </div>
                      <Quote className="w-10 h-10 text-white/5 mb-6" />
                      <p className="text-slate-300 text-lg mb-10 flex-1 leading-relaxed font-medium">"{t.content}"</p>
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-xl">
                            {t.avatar}
                         </div>
                         <div>
                            <h4 className="text-base font-black text-white">{t.name}</h4>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{t.role}</p>
                         </div>
                      </div>
                   </GlassCard>
                 ))}
              </div>
           </div>
        </section>

        {/* Transition Gradient */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Pricing Section */}
        <section id="pricing" className="section-spacing relative">
           <div className="container-custom">
              <Pricing />
           </div>
        </section>

        {/* Final CTA */}
        <section className="py-40 relative overflow-hidden">
           <div className="absolute inset-0 mesh-gradient opacity-30 pointer-events-none" />
           <div className="container-custom relative z-10 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="glass p-16 md:p-32 rounded-[4rem] border-white/10 glow-purple max-w-6xl mx-auto shadow-2xl relative overflow-hidden"
              >
                 <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
                 <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9] relative z-10">
                    Invest in your <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">future self.</span>
                 </h2>
                 <p className="text-xl md:text-2xl text-slate-400 mb-16 max-w-2xl mx-auto font-medium relative z-10">
                    Stop letting interview anxiety dictate your career trajectory. Start preparing with intelligent feedback today.
                 </p>
                 <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
                    <Link href="/register" className="btn-primary text-lg px-12 py-5 shadow-[0_0_40px_rgba(139,92,246,0.3)]">
                       Get Started Now <ArrowRight className="ml-2 w-5 h-5 inline" />
                    </Link>
                 </div>
              </motion.div>
           </div>
        </section>
      </main>

      {/* Premium Multi-column Footer */}
      <footer className="pt-24 pb-12 border-t border-white/5 bg-[#030303] relative z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-16 mb-24">
            
            <div className="lg:col-span-2">
               <Link href="/" className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-xl">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-black text-white tracking-tighter">HireMind AI</span>
               </Link>
               <p className="text-slate-400 leading-relaxed mb-8 max-w-sm font-medium">
                  The world's most advanced AI interview simulator. Built by engineers, for engineers.
               </p>
               <div className="flex items-center gap-6">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                     <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                     <Github className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                     <Linkedin className="w-4 h-4" />
                  </a>
               </div>
            </div>
            
            <div className="lg:col-span-1">
               <h4 className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-8">Platform</h4>
               <ul className="space-y-4 text-sm font-bold text-slate-500">
                  <li><Link href="#features" className="hover:text-purple-400 transition-colors">Features</Link></li>
                  <li><Link href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</Link></li>
                  <li><Link href="/interview/setup" className="hover:text-purple-400 transition-colors">AI Interviewer</Link></li>
                  <li><Link href="/coding" className="hover:text-purple-400 transition-colors">Coding Simulator</Link></li>
               </ul>
            </div>

            <div className="lg:col-span-1">
               <h4 className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-8">Company</h4>
               <ul className="space-y-4 text-sm font-bold text-slate-500">
                  <li><Link href="/about" className="hover:text-purple-400 transition-colors">About Us</Link></li>
                  <li><Link href="/careers" className="hover:text-purple-400 transition-colors">Careers</Link></li>
                  <li><Link href="/blog" className="hover:text-purple-400 transition-colors">Blog</Link></li>
                  <li><Link href="/contact" className="hover:text-purple-400 transition-colors">Contact Sales</Link></li>
               </ul>
            </div>

            <div className="lg:col-span-2">
               <h4 className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-8">Stay Updated</h4>
               <p className="text-sm font-medium text-slate-400 mb-6">Subscribe to our newsletter for the latest AI interview prep strategies.</p>
               <div className="flex gap-2">
                  <input type="email" placeholder="Email address" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors" />
                  <button className="px-6 py-3 rounded-xl bg-white text-black font-black text-sm hover:bg-slate-200 transition-colors">
                     Join
                  </button>
               </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">© 2026 HireMind AI Inc. All rights reserved.</p>
             <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
                <Link href="/security" className="hover:text-slate-400 transition-colors">Security</Link>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
