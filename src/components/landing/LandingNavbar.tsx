"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

export function LandingNavbar() {
  const { status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Capabilities" },
    { href: "#testimonials", label: "Wall of Love" },
    { href: "#pricing", label: "Pricing" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 px-4 pointer-events-none">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "flex items-center justify-between w-full max-w-[1200px] px-6 py-4 rounded-full transition-all duration-700 pointer-events-auto",
          scrolled 
            ? "bg-black/50 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)]" 
            : "bg-transparent border-transparent"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter hidden md:block">HireMind AI</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10 bg-white/[0.03] px-8 py-3 rounded-full border border-white/5">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-6">
           {status === "authenticated" ? (
             <Link href="/dashboard" className="btn-primary py-3 px-8 text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                Dashboard <ArrowRight className="w-3.5 h-3.5" />
             </Link>
           ) : (
             <>
               <Link href="/login" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                  Sign In
               </Link>
               <Link href="/register" className="btn-primary py-3 px-8 text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                  Get Started <ArrowRight className="w-3.5 h-3.5" />
               </Link>
             </>
           )}
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white p-2"
        >
           {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed inset-x-4 top-24 z-50 bg-black/90 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl md:hidden pointer-events-auto"
          >
            <div className="flex flex-col gap-8 text-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-black text-white tracking-tighter"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-white/10" />
              <Link href="/login" className="text-slate-400 font-bold text-lg">Sign In</Link>
              <Link href="/register" className="btn-primary py-5 text-lg">Join HireMind AI</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
