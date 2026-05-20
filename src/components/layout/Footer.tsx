"use client";

import Link from "next/link";
import { Twitter, Github, Linkedin, Mail, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "");
    formData.append("email", email);
    formData.append("subject", "New Newsletter Subscription");
    formData.append("from_name", "Candidra AI");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        toast.success("Subscribed successfully!");
        setEmail("");
      } else {
        toast.error("Subscription failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-black border-t-2 border-white/20 pt-20 pb-10 relative z-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-white/20 bg-black flex items-center justify-center brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-transform overflow-hidden">
                <img src="/icon.png?v=3" alt="Candidra AI Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-black text-white uppercase font-mono tracking-tighter">Candidra AI</span>
            </Link>
            <p className="text-sm text-slate-400 font-mono leading-relaxed tracking-tight">
              Empowering engineers to master technical interviews through intelligent AI-driven simulations and real-time feedback.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="p-2 border-2 border-white/20 bg-black text-white hover:bg-primary hover:text-black transition-colors brutal-shadow-sm"><Twitter className="w-4 h-4" /></Link>
              <Link href="#" className="p-2 border-2 border-white/20 bg-black text-white hover:bg-primary hover:text-black transition-colors brutal-shadow-sm"><Github className="w-4 h-4" /></Link>
              <Link href="#" className="p-2 border-2 border-white/20 bg-black text-white hover:bg-primary hover:text-black transition-colors brutal-shadow-sm"><Linkedin className="w-4 h-4" /></Link>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary font-mono">Platform</h4>
            <ul className="space-y-4 text-sm text-white font-bold font-mono">
              <li><Link href="/interview/setup" className="hover:text-primary transition-colors">AI Interviews</Link></li>
              <li><Link href="/coding" className="hover:text-primary transition-colors">Coding Playground</Link></li>
              <li><Link href="/resume" className="hover:text-primary transition-colors">Resume Analysis</Link></li>
              <li><Link href="/reports" className="hover:text-primary transition-colors">Performance Reports</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary font-mono">Company</h4>
            <ul className="space-y-4 text-sm text-white font-bold font-mono">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary font-mono">Newsletter</h4>
            <p className="text-sm text-slate-400 font-mono tracking-tight">Get the latest interview tips and platform updates.</p>
            <form onSubmit={handleSubscribe} className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email" 
                className="w-full bg-black border-2 border-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors brutal-shadow-sm font-mono"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 border-2 border-black bg-primary text-black hover:bg-white transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-10 border-t-2 border-white/20 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500 font-mono font-bold uppercase">&copy; {new Date().getFullYear()} Candidra AI. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary font-mono">
            <span>Made with ⚡ for engineers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
