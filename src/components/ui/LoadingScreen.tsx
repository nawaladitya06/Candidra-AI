"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const TIPS = [
  "Analyzing target industry benchmarks...",
  "Powering up Candidra AI voice engine...",
  "Calibrating technical evaluation metrics...",
  "Readying real-time behavioral analytics...",
  "Tailoring custom question database...",
];

export function LoadingScreen({ message }: { message?: string }) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#040406] z-[9999] flex flex-col items-center justify-center overflow-hidden">
      {/* Sleek Dynamic Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px] animate-pulse" />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 grid-pattern opacity-[0.05] pointer-events-none" />

      {/* Main Glassmorphic Loader Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center text-center p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-2xl shadow-2xl brutal-shadow max-w-sm w-full mx-6 relative z-10"
      >
        {/* Pulsating Glowing Brain Logo */}
        <div className="relative mb-8">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -inset-4 bg-primary text-black rounded-2xl blur-xl opacity-30"
          />
          <div className="w-16 h-16 rounded-2xl bg-black border-2 flex items-center justify-center shadow-lg relative border-white/20 overflow-hidden">
            <img src="/icon.png?v=6" alt="Candidra AI Logo" className="w-full h-full object-cover animate-pulse" />
          </div>
        </div>

        {/* Brand Name */}
        <h2 className="text-2xl font-black text-white tracking-tighter mb-1">
          Candidra <span className="gradient-text">AI</span>
        </h2>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-8">
          Ace Your Next Interview
        </p>

        {/* Custom Premium Loading Ring */}
        <div className="relative w-12 h-12 mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              className="stroke-white/5"
              strokeWidth="3"
              fill="transparent"
            />
            <motion.circle
              cx="24"
              cy="24"
              r="20"
              className="stroke-primary"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray="125"
              animate={{
                strokeDashoffset: [125, 0, -125],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
        </div>

        {/* Rotating Motivational Tech Tips */}
        <div className="h-6 overflow-hidden w-full">
          <motion.p
            key={tipIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="text-xs font-semibold text-slate-400"
          >
            {message || TIPS[tipIndex]}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
