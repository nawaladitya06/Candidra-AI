"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { useState } from "react";
import { 
  ROLES, EXPERIENCE_LEVELS, TECH_STACKS, cn, ROLES_BY_STREAM
} from "@/lib/utils";
import { 
  Brain, Mic, Briefcase, ChevronRight, 
  Sparkles, Check, Info, FileText 
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { generateInterviewQuestions } from "@/lib/gemini";
import toast from "react-hot-toast";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export default function InterviewSetupPage() {
  const router = useRouter();
  const { setCurrentInterview, addInterview } = useAppStore();
  
  const [role, setRole] = useState(ROLES[0]);
  const [experience, setExperience] = useState(EXPERIENCE_LEVELS[1].value);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [interviewType, setInterviewType] = useState<"standard" | "resume">("standard");

  const toggleTech = (tech: string) => {
    if (selectedTech.includes(tech)) {
      setSelectedTech(selectedTech.filter(t => t !== tech));
    } else {
      if (selectedTech.length < 5) {
        setSelectedTech([...selectedTech, tech]);
      } else {
        toast.error("Maximum 5 technologies allowed");
      }
    }
  };

  const handleStart = async () => {
    if (selectedTech.length === 0 && interviewType === "standard") {
      toast.error("Please select at least one technology");
      return;
    }

    setIsLoading(true);
    const id = `int-${Date.now()}`;
    
    try {
      const questions = await generateInterviewQuestions({
        role,
        experienceLevel: experience,
        techStack: selectedTech,
        count: 5
      });

      const newInterview = {
        id,
        role,
        experienceLevel: experience,
        techStack: selectedTech,
        status: "in-progress" as const,
        createdAt: new Date().toISOString(),
        questions: questions.map(q => ({
          id: crypto.randomUUID(),
          text: q.text,
          type: q.type as any, // Cast to store's supported types
        }))
      };

      // Save to D1
      await fetch("/api/interview/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInterview),
      });

      addInterview(newInterview);
      setCurrentInterview(newInterview);
      
      toast.success("Interview session initialized!");
      router.push(`/interview/room/${id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to initialize interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Analyzing role profile & generating custom interview questions..." />;
  }

  return (
    <DashboardLayout 
      title="Setup Your Interview" 
      subtitle="Configure your AI-powered interview session."
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="p-8 border-4 border-white/20 bg-black brutal-shadow">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 border-2 border-white/20 bg-primary flex items-center justify-center brutal-shadow-sm">
                    <Briefcase className="w-6 h-6 text-black" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight font-mono">Select Your Role</h3>
                    <p className="text-xs font-bold text-slate-500 font-mono uppercase">What position are you preparing for?</p>
                 </div>
              </div>

              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-4 bg-black border-2 border-white/20 text-white font-mono uppercase text-sm mb-6 focus:border-primary focus:outline-none brutal-shadow-sm transition-all cursor-pointer"
              >
                {Object.entries(ROLES_BY_STREAM).map(([stream, roles]) => (
                  <optgroup key={stream} label={stream} className="bg-black text-primary font-bold font-mono py-2">
                    {roles.map(r => (
                      <option key={r} value={r} className="bg-black text-white font-mono font-bold uppercase">
                        {r}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {EXPERIENCE_LEVELS.map(exp => (
                  <button
                    key={exp.value}
                    onClick={() => setExperience(exp.value)}
                    className={cn(
                      "p-4 border-2 font-mono text-xs uppercase tracking-tight font-bold transition-all text-center",
                      experience === exp.value 
                        ? "bg-primary border-primary text-black brutal-shadow-sm translate-x-[2px] translate-y-[2px]" 
                        : "bg-black border-white/20 text-white hover:border-primary hover:text-primary"
                    )}
                  >
                    {exp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Tech Stack */}
            <div className="p-8 border-4 border-white/20 bg-black brutal-shadow">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 border-2 border-white/20 bg-primary flex items-center justify-center brutal-shadow-sm">
                    <Sparkles className="w-6 h-6 text-black" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight font-mono">Target Tech Stack</h3>
                    <p className="text-xs font-bold text-slate-500 font-mono uppercase">Pick up to 5 technologies for technical questions</p>
                 </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                {TECH_STACKS.slice(0, 20).map(tech => (
                  <button
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    className={cn(
                      "px-4 py-2 text-xs font-bold font-mono uppercase tracking-tight border-2 transition-all flex items-center gap-2",
                      selectedTech.includes(tech)
                        ? "bg-primary border-primary text-black brutal-shadow-sm translate-x-[2px] translate-y-[2px]"
                        : "bg-black border-white/20 text-white hover:border-primary hover:text-primary"
                    )}
                  >
                    {tech}
                    {selectedTech.includes(tech) && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
              
              <div className="text-[10px] font-black text-slate-500 font-mono uppercase tracking-widest flex items-center gap-2">
                 <Info className="w-4 h-4 text-primary" />
                 Selected: {selectedTech.length}/5 technologies
              </div>
            </div>

            {/* Step 3: Interview Mode */}
            <div className="p-8 border-4 border-white/20 bg-black brutal-shadow">
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 border-2 border-white/20 bg-primary flex items-center justify-center brutal-shadow-sm">
                    <Brain className="w-6 h-6 text-black" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight font-mono">Interview Type</h3>
                    <p className="text-xs font-bold text-slate-500 font-mono uppercase">How should the AI evaluate you?</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <button 
                  onClick={() => setInterviewType("standard")}
                  className={cn(
                    "p-6 border-4 text-left transition-all",
                    interviewType === "standard" 
                      ? "bg-primary/10 border-primary brutal-shadow-sm" 
                      : "bg-black border-white/20 hover:border-white/50 hover:brutal-shadow"
                  )}
                 >
                    <div className="flex items-center gap-4 mb-4">
                       <div className={cn(
                          "w-10 h-10 border-2 flex items-center justify-center brutal-shadow-sm",
                          interviewType === "standard" ? "border-primary bg-primary" : "border-white/20 bg-black"
                       )}>
                          <Mic className={cn("w-5 h-5", interviewType === "standard" ? "text-black" : "text-white")} />
                       </div>
                       <span className="font-black text-white text-base font-mono uppercase tracking-tight">Standard</span>
                    </div>
                    <p className="text-xs font-bold text-slate-400 font-mono">Curated questions based on role and stack.</p>
                 </button>

                 <button 
                  onClick={() => setInterviewType("resume")}
                  className={cn(
                    "p-6 border-4 text-left transition-all",
                    interviewType === "resume" 
                      ? "bg-primary/10 border-primary brutal-shadow-sm" 
                      : "bg-black border-white/20 hover:border-white/50 hover:brutal-shadow"
                  )}
                 >
                    <div className="flex items-center gap-4 mb-4">
                       <div className={cn(
                          "w-10 h-10 border-2 flex items-center justify-center brutal-shadow-sm",
                          interviewType === "resume" ? "border-primary bg-primary" : "border-white/20 bg-black"
                       )}>
                          <FileText className={cn("w-5 h-5", interviewType === "resume" ? "text-black" : "text-white")} />
                       </div>
                       <span className="font-black text-white text-base font-mono uppercase tracking-tight">Resume-First</span>
                    </div>
                    <p className="text-xs font-bold text-slate-400 font-mono">Personalized questions from your uploaded CV.</p>
                 </button>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-8">
            <div className="p-8 border-4 border-white/20 bg-black brutal-shadow sticky top-24">
               <h3 className="text-xl font-black text-white mb-8 font-mono uppercase tracking-tight">Session Summary</h3>
               <div className="space-y-6 mb-8 font-mono">
                  <div className="flex justify-between text-xs font-bold">
                     <span className="text-slate-500 uppercase">Role</span>
                     <span className="text-white bg-white/10 px-2 py-1">{role}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                     <span className="text-slate-500 uppercase">Level</span>
                     <span className="text-white bg-white/10 px-2 py-1 capitalize">{experience}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                     <span className="text-slate-500 uppercase">Technologies</span>
                     <span className="text-primary text-right max-w-[120px] leading-relaxed">
                       {selectedTech.length > 0 ? selectedTech.join(", ") : "None selected"}
                     </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold pt-4 border-t-2 border-white/10">
                     <span className="text-slate-500 uppercase">Est. Time</span>
                     <span className="text-white">~25-30 mins</span>
                  </div>
               </div>

               <button 
                 disabled={isLoading}
                 onClick={handleStart}
                 className="w-full btn-primary py-4 flex items-center justify-center gap-3 text-base"
               >
                 {isLoading ? (
                   <>
                     <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                     INITIALIZING...
                   </>
                 ) : (
                   <>
                     START INTERVIEW <ChevronRight className="w-5 h-5" />
                   </>
                 )}
               </button>
               
               <p className="text-[10px] font-bold text-slate-500 text-center mt-6 font-mono uppercase tracking-widest leading-relaxed">
                 By starting, you agree to allow browser microphone access for speech-to-text.
               </p>
            </div>

            <div className="p-6 border-4 border-primary bg-primary/5 brutal-shadow-sm">
               <h4 className="text-sm font-black text-primary mb-4 flex items-center gap-3 font-mono uppercase tracking-tight">
                 <Info className="w-5 h-5" /> Pro Tip
               </h4>
               <p className="text-xs font-bold text-white font-mono leading-relaxed">
                 AI Interviews are dynamic. If you answer well, the AI will ask more challenging follow-up questions to test your limits.
               </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
