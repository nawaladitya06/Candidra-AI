"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { motion } from "framer-motion";
import { Twitter, Github, Linkedin, ArrowRight, Star, Quote } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

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
    content: "We use Candidra to help our internal candidates prepare for level-up interviews. The role-specific questions are perfectly calibrated.",
    avatar: "A"
  }
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black selection:bg-primary/30 font-sans">
      <LandingNavbar />
      
      <main>
        <Hero />
        
        {/* Features Section - Bento Grid */}
        <section id="features" className="section-spacing relative z-10 border-y-2 border-white/20 bg-[#050505]">
           <div className="container-custom">
              <div className="max-w-3xl mb-12 md:mb-24 flex flex-col items-center mx-auto text-center">
                 <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   className="badge badge-blue mb-8"
                 >
                   Core Architecture
                 </motion.div>
                 <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="brutal-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-8 leading-[0.9]"
                  >
                     Engineered for <br className="hidden md:block" />
                     <span className="text-primary">Elite Performance.</span>
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

        {/* Testimonials */}
        <section id="testimonials" className="section-spacing relative overflow-hidden bg-black">
           <div className="container-custom relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-24">
                 <h2 className="brutal-heading text-5xl md:text-6xl text-white mb-6">Proven <span className="text-primary">Results.</span></h2>
                 <p className="text-xl text-slate-400 font-medium font-mono uppercase tracking-tight">Join top-tier engineers who used Candidra to secure offers.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                 {TESTIMONIALS.map((t, i) => (
                   <GlassCard key={i} delay={i * 0.1} className="p-10 flex flex-col h-full bg-[#111] border-white/20">
                      <div className="flex gap-1.5 mb-8 text-primary">
                         {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                      </div>
                      <Quote className="w-10 h-10 text-white/20 mb-6" />
                      <p className="text-slate-300 text-lg mb-10 flex-1 leading-relaxed font-medium">"{t.content}"</p>
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 border-2 border-white/20 bg-primary flex items-center justify-center font-black text-white brutal-shadow">
                            {t.avatar}
                         </div>
                         <div>
                            <h4 className="text-base font-black text-white font-mono uppercase">{t.name}</h4>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{t.role}</p>
                         </div>
                      </div>
                   </GlassCard>
                 ))}
              </div>
           </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="section-spacing relative border-t-2 border-white/20 bg-[#050505]">
           <div className="container-custom">
              <Pricing />
           </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 md:py-40 relative overflow-hidden bg-primary border-y-2 border-white/20">
           <div className="container-custom relative z-10 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="bg-black p-8 sm:p-16 md:p-32 border-4 border-black max-w-6xl mx-auto relative overflow-hidden"
                style={{ boxShadow: '16px 16px 0px 0px rgba(0,0,0,1)' }}
              >
                 <h2 className="brutal-heading text-4xl sm:text-5xl md:text-8xl text-white mb-8 leading-[0.9] relative z-10">
                    Invest in your <br />
                    <span className="text-primary">future self.</span>
                 </h2>
                 <p className="text-base sm:text-xl md:text-2xl text-slate-400 mb-10 md:mb-16 max-w-2xl mx-auto font-mono uppercase tracking-tighter relative z-10">
                    Stop letting interview anxiety dictate your career trajectory. Start preparing with intelligent feedback today.
                 </p>
                 <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
                    <Link href="/register" className="btn-primary text-lg px-12 py-5 bg-white text-black border-white hover:bg-slate-200">
                       Get Started Now <ArrowRight className="ml-2 w-5 h-5 inline" />
                    </Link>
                 </div>
              </motion.div>
           </div>
        </section>
      </main>

      {/* Brutalist Footer */}
      <footer className="pt-24 pb-12 bg-black relative z-10 overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 md:gap-16 mb-16 md:mb-24">
            
            <div className="sm:col-span-2 lg:col-span-2">
               <Link href="/" className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 border-2 border-white/20 bg-black flex items-center justify-center overflow-hidden">
                    <img src="/icon.png?v=6" alt="Candidra AI Logo" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-2xl font-black text-white tracking-tighter font-mono uppercase">Candidra AI</span>
               </Link>
               <p className="text-slate-400 leading-relaxed mb-8 max-w-sm font-mono uppercase text-xs tracking-tight">
                  The world's most advanced AI interview simulator. Built by engineers, for engineers.
               </p>
               <div className="flex items-center gap-4">
                  <a href="#" className="w-12 h-12 border-2 border-white/20 bg-black flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                     <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-12 h-12 border-2 border-white/20 bg-black flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                     <Github className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-12 h-12 border-2 border-white/20 bg-black flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                     <Linkedin className="w-5 h-5" />
                  </a>
               </div>
            </div>
            
            <div className="lg:col-span-1">
               <h4 className="text-primary font-black uppercase text-xs tracking-[0.2em] mb-8 font-mono">Platform</h4>
               <ul className="space-y-4 text-sm font-bold text-white uppercase font-mono tracking-tight">
                  <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                  <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                  <li><Link href="/interview/setup" className="hover:text-primary transition-colors">AI Interviewer</Link></li>
                  <li><Link href="/coding" className="hover:text-primary transition-colors">Coding Simulator</Link></li>
               </ul>
            </div>

            <div className="lg:col-span-1">
               <h4 className="text-primary font-black uppercase text-xs tracking-[0.2em] mb-8 font-mono">Company</h4>
               <ul className="space-y-4 text-sm font-bold text-white uppercase font-mono tracking-tight">
                  <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                  <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                  <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                  <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Sales</Link></li>
               </ul>
            </div>

            <div className="lg:col-span-2">
               <h4 className="text-primary font-black uppercase text-xs tracking-[0.2em] mb-8 font-mono">Stay Updated</h4>
               <p className="text-xs font-mono uppercase tracking-tight text-slate-400 mb-6">Subscribe to our newsletter for the latest AI interview prep strategies.</p>
               <div className="flex gap-2">
                  <input type="email" placeholder="Email address" className="input-field" />
                  <button className="btn-primary px-6 py-3">
                     Join
                  </button>
               </div>
            </div>
          </div>
          
          <div className="pt-8 border-t-2 border-white/20 flex flex-col md:flex-row justify-between items-center gap-6">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">© 2026 Candidra AI Inc.</p>
             <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link href="/security" className="hover:text-white transition-colors">Security</Link>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
