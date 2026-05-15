"use client";

import Link from "next/link";
import { Brain, Twitter, Github, Linkedin, Mail, Send } from "lucide-react";
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
    formData.append("from_name", "HireMind AI");

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
    <footer className="bg-[#030303] border-t border-white/5 pt-20 pb-10 relative z-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black text-white tracking-tighter">HireMind AI</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Empowering engineers to master technical interviews through intelligent AI-driven simulations and real-time feedback.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white transition-all"><Twitter className="w-4 h-4" /></Link>
              <Link href="#" className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white transition-all"><Github className="w-4 h-4" /></Link>
              <Link href="#" className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white transition-all"><Linkedin className="w-4 h-4" /></Link>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Platform</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="/interview/setup" className="hover:text-purple-400 transition-colors">AI Interviews</Link></li>
              <li><Link href="/coding" className="hover:text-purple-400 transition-colors">Coding Playground</Link></li>
              <li><Link href="/resume" className="hover:text-purple-400 transition-colors">Resume Analysis</Link></li>
              <li><Link href="/reports" className="hover:text-purple-400 transition-colors">Performance Reports</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="#" className="hover:text-purple-400 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-purple-400 transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Newsletter</h4>
            <p className="text-sm text-slate-500">Get the latest interview tips and platform updates.</p>
            <form onSubmit={handleSubscribe} className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-600">&copy; {new Date().getFullYear()} HireMind AI. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
            <span>Made with 💜 for engineers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
