"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
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
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 flex justify-center py-4 px-4 transition-all duration-300",
      scrolled ? "bg-black border-b-2 border-white/20" : "bg-transparent"
    )}>
      <div className="flex items-center justify-between w-full max-w-[1200px] px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 border-2 border-white/20 bg-black flex items-center justify-center brutal-shadow-sm group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-transform overflow-hidden">
            <img src="/icon.png?v=4" alt="Candidra AI Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase font-mono hidden md:block">Candidra AI</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 hover:text-primary transition-colors font-mono"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-6">
           {status === "authenticated" ? (
             <Link href="/dashboard" className="btn-primary py-3 px-8 text-xs flex items-center gap-2">
                Dashboard <ArrowRight className="w-4 h-4" />
             </Link>
           ) : (
             <>
               <Link href="/login" className="text-xs font-black uppercase tracking-widest text-white hover:text-primary transition-colors font-mono">
                  Sign In
               </Link>
               <Link href="/register" className="btn-primary py-3 px-8 text-xs flex items-center gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
               </Link>
             </>
           )}
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white p-2 border-2 border-white/20 bg-black brutal-shadow-sm"
        >
           {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-24 z-50 bg-black p-8 border-4 border-white/20 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] md:hidden"
          >
            <div className="flex flex-col gap-8 text-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-black text-white uppercase font-mono tracking-tight hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-white/20" />
              <Link href="/login" className="text-white font-bold font-mono uppercase">Sign In</Link>
              <Link href="/register" className="btn-primary py-4 text-lg w-full text-center block">Join Candidra AI</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
