"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { useState } from "react";
import { 
  ROLES, EXPERIENCE_LEVELS, TECH_STACKS, cn 
} from "@/lib/utils";
import { 
  Brain, Mic, Briefcase, ChevronRight, 
  Sparkles, Check, Info, FileText 
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { generateInterviewQuestions } from "@/lib/gemini";
import toast from "react-hot-toast";

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

  return (
    <DashboardLayout 
      title="Setup Your Interview" 
      subtitle="Configure your AI-powered interview session."
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Step 1: Role */}
            <GlassCard className="p-8">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-purple-500" />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-white">Select Your Role</h3>
                    <p className="text-xs text-slate-500">What position are you preparing for?</p>
                 </div>
              </div>

              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-field mb-6"
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {EXPERIENCE_LEVELS.map(exp => (
                  <button
                    key={exp.value}
                    onClick={() => setExperience(exp.value)}
                    className={cn(
                      "p-3 rounded-xl border text-sm font-medium transition-all text-center",
                      experience === exp.value 
                        ? "bg-purple-500/10 border-purple-500 text-purple-400" 
                        : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10"
                    )}
                  >
                    {exp.label}
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Step 2: Tech Stack */}
            <GlassCard className="p-8">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-white">Target Tech Stack</h3>
                    <p className="text-xs text-slate-500">Pick up to 5 technologies for technical questions</p>
                 </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {TECH_STACKS.slice(0, 20).map(tech => (
                  <button
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-2",
                      selectedTech.includes(tech)
                        ? "bg-blue-500/10 border-blue-500 text-blue-400"
                        : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10"
                    )}
                  >
                    {tech}
                    {selectedTech.includes(tech) && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
              
              <div className="text-[10px] text-slate-500 flex items-center gap-2">
                 <Info className="w-3 h-3" />
                 Selected: {selectedTech.length}/5 technologies
              </div>
            </GlassCard>

            {/* Step 3: Interview Mode */}
            <GlassCard className="p-8">
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-cyan-500" />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-white">Interview Type</h3>
                    <p className="text-xs text-slate-500">How should the AI evaluate you?</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button 
                  onClick={() => setInterviewType("standard")}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all",
                    interviewType === "standard" 
                      ? "bg-cyan-500/10 border-cyan-500" 
                      : "bg-white/5 border-white/5 opacity-60 hover:opacity-100"
                  )}
                 >
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <Mic className="w-4 h-4 text-cyan-400" />
                       </div>
                       <span className="font-bold text-white text-sm">Standard</span>
                    </div>
                    <p className="text-xs text-slate-400">Curated questions based on role and stack.</p>
                 </button>

                 <button 
                  onClick={() => setInterviewType("resume")}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all",
                    interviewType === "resume" 
                      ? "bg-purple-500/10 border-purple-500" 
                      : "bg-white/5 border-white/5 opacity-60 hover:opacity-100"
                  )}
                 >
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-purple-400" />
                       </div>
                       <span className="font-bold text-white text-sm">Resume-First</span>
                    </div>
                    <p className="text-xs text-slate-400">Personalized questions from your uploaded CV.</p>
                 </button>
              </div>
            </GlassCard>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <GlassCard className="p-6 sticky top-24 border-purple-500/20">
               <h3 className="font-bold text-white mb-6">Session Summary</h3>
               <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                     <span className="text-slate-500">Role</span>
                     <span className="text-slate-300 font-medium">{role}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className="text-slate-500">Level</span>
                     <span className="text-slate-300 font-medium capitalize">{experience}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className="text-slate-500">Technologies</span>
                     <span className="text-slate-300 font-medium text-right">
                       {selectedTech.length > 0 ? selectedTech.join(", ") : "None selected"}
                     </span>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className="text-slate-500">Estimated Time</span>
                     <span className="text-slate-300 font-medium">~25-30 mins</span>
                  </div>
               </div>

               <button 
                 disabled={isLoading}
                 onClick={handleStart}
                 className="w-full btn-primary py-4 flex items-center justify-center gap-2"
               >
                 {isLoading ? (
                   <>
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     Initializing...
                   </>
                 ) : (
                   <>
                     Start Interview <ChevronRight className="w-4 h-4" />
                   </>
                 )}
               </button>
               
               <p className="text-[10px] text-slate-500 text-center mt-4">
                 By starting, you agree to allow browser microphone access for speech-to-text.
               </p>
            </GlassCard>

            <div className="p-4 glass rounded-xl border-white/5">
               <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                 <Info className="w-3.5 h-3.5 text-purple-500" /> Pro Tip
               </h4>
               <p className="text-[11px] text-slate-400 leading-relaxed">
                 AI Interviews are dynamic. If you answer well, the AI will ask more challenging follow-up questions to test your limits.
               </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
