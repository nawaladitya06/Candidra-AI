"use client";

import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { useDropzone } from "react-dropzone";
import { 
  FileText, Upload, CheckCircle2, 
  AlertCircle, Brain, Sparkles,
  ChevronRight, Trash2, Loader2,
  FileSearch, Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { generateResumeQuestions, analyzeResume } from "@/lib/gemini";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

interface ResumeUploadResponse {
  fileKey: string;
  fileUrl: string;
  success: boolean;
  message?: string;
}

interface AIQuestion {
  text: string;
  type: string;
  difficulty: string;
  followUp?: string;
}

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [questions, setQuestions] = useState<AIQuestion[]>([]);
  const router = useRouter();
  const { setCurrentInterview, addInterview } = useAppStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
      toast.success("Resume uploaded successfully!");
    } else {
      toast.error("Please upload a PDF file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  const handleAnalyzeResume = async () => {
    if (!file) return;
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload and parse the PDF
      const uploadRes = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");
      const { fileKey, parsedText } = await uploadRes.json();

      // Ensure we have text
      if (!parsedText || parsedText.length < 50) {
         throw new Error("Could not extract enough text from the resume.");
      }
      
      // Call the dynamic resume ATS analysis action
      const resumeAnalysis = await analyzeResume(parsedText);
      
      // Generate questions tailored to the matched role
      const genQuestions = await generateResumeQuestions(parsedText, resumeAnalysis.role || "Software Professional");

      setAnalysis(resumeAnalysis);
      setQuestions(genQuestions as any);
      toast.success("AI ATS Screening Analysis Complete!");
    } catch (err) {
      console.error(err);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const startInterview = () => {
    const id = `int-resume-${Date.now()}`;
    const newInterview = {
      id,
      role: analysis.role,
      experienceLevel: "senior",
      techStack: analysis.skills,
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
    router.push(`/interview/room/${id}`);
  };

  return (
    <DashboardLayout 
      title="Resume Analysis" 
      subtitle="Let AI scan your resume and generate targeted interview questions."
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {!analysis ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-12">
             <div className="space-y-8">
                <h2 className="text-4xl font-black text-white uppercase font-mono tracking-tight leading-tight">
                   Optimize your resume for <span className="bg-primary text-black px-2 brutal-shadow-sm inline-block">Top-Tier AI</span> screening.
                </h2>
                <p className="text-sm font-bold text-slate-400 font-mono leading-relaxed">
                   Upload your resume to get instant feedback on how ATS systems and interviewers perceive your experience. 
                   Our AI will identify skill gaps and prepare custom questions based on your actual history.
                </p>
                <ul className="space-y-4 font-mono font-bold">
                   {[
                     "ATS-friendly scoring",
                     "Custom question generation",
                     "Skill gap identification",
                     "Role-match analysis"
                   ].map((item, i) => (
                     <li key={i} className="flex items-center gap-4 text-xs text-white uppercase tracking-tight">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" /> {item}
                     </li>
                   ))}
                </ul>
             </div>

             <div className="p-2 border-4 border-white/20 bg-black brutal-shadow group transition-all hover:border-primary">
                {!file ? (
                  <div 
                    {...getRootProps()} 
                    className="flex flex-col items-center justify-center text-center cursor-pointer min-h-[350px] p-8 border-4 border-dashed border-white/10 group-hover:border-primary/50 transition-colors"
                  >
                    <input {...getInputProps()} />
                    <div className="w-24 h-24 border-4 border-white/20 bg-black flex items-center justify-center mb-8 brutal-shadow-sm group-hover:bg-primary/10 transition-colors">
                       <Upload className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4 uppercase font-mono tracking-tight">
                       {isDragActive ? "Drop it here!" : "Upload Resume"}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 font-mono uppercase tracking-widest mb-8">Drag and drop or click to browse (PDF only)</p>
                    <div className="flex gap-4">
                       <span className="text-[10px] uppercase font-black tracking-widest text-black bg-white px-3 py-1 brutal-shadow-sm">MAX 5MB</span>
                       <span className="text-[10px] uppercase font-black tracking-widest text-black bg-primary px-3 py-1 brutal-shadow-sm">PDF ONLY</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center min-h-[350px] p-8 border-4 border-primary/20">
                     <div className="w-24 h-24 border-4 border-primary bg-primary/10 flex items-center justify-center mb-6 brutal-shadow-sm">
                        <FileText className="w-12 h-12 text-primary" />
                     </div>
                     <h3 className="text-xl font-black text-white mb-3 font-mono uppercase tracking-tight">{file.name}</h3>
                     <p className="text-xs font-bold text-slate-500 font-mono uppercase tracking-widest mb-10">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                     
                     <div className="flex gap-6 w-full max-w-sm">
                        <button 
                          onClick={() => setFile(null)}
                          className="flex-1 bg-black border-2 border-white text-white py-4 font-mono font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors brutal-shadow-sm"
                        >
                           <Trash2 className="w-4 h-4" /> Remove
                        </button>
                        <button 
                          onClick={handleAnalyzeResume}
                          disabled={isUploading}
                          className="flex-1 btn-primary py-4 flex items-center justify-center gap-2"
                        >
                           {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze"}
                        </button>
                     </div>
                  </div>
                )}
             </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Profile Result & Skill Gap Checklist */}
                <div className="lg:col-span-1 flex flex-col gap-8">
                   {/* Analysis Result */}
                   <div className="p-8 border-4 border-white/20 bg-black brutal-shadow flex flex-col min-h-[480px]">
                      <div className="flex items-center gap-4 mb-10">
                         <div className="w-16 h-16 border-2 border-white/20 bg-primary flex items-center justify-center text-black font-black text-2xl brutal-shadow-sm font-mono">
                            {analysis.name[0]}
                         </div>
                         <div>
                            <h3 className="text-xl font-black text-white font-mono uppercase tracking-tight">{analysis.name}</h3>
                            <p className="text-xs font-bold text-slate-500 font-mono uppercase tracking-widest mt-1">{analysis.role}</p>
                         </div>
                      </div>

                      <div className="space-y-8 mb-10 flex-1">
                         <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 font-mono">Profile Match Score</p>
                            <div className="flex items-center gap-6">
                               <div className="flex-1 h-6 border-2 border-white/20 bg-black overflow-hidden brutal-shadow-sm">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${analysis.score}%` }}
                                    className="h-full bg-primary border-r-2 border-white/20" 
                                  />
                               </div>
                               <span className="text-base font-black text-white font-mono">{analysis.score}%</span>
                            </div>
                         </div>
                         
                         <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 font-mono">Extracted Skills</p>
                            <div className="flex flex-wrap gap-3">
                               {analysis.skills.map((s: string) => (
                                  <span key={s} className="px-3 py-1.5 bg-black border-2 border-white/20 text-xs text-white font-bold font-mono uppercase tracking-tight hover:border-primary hover:text-primary transition-colors">
                                     {s}
                                  </span>
                               ))}
                            </div>
                         </div>

                         <div className="flex justify-between items-center p-5 border-4 border-primary bg-primary/5 brutal-shadow-sm mt-8">
                            <div className="flex items-center gap-3">
                               <Sparkles className="w-5 h-5 text-primary" />
                               <span className="text-xs font-black text-white font-mono uppercase tracking-widest">Experience Match</span>
                            </div>
                            <span className="text-xs font-black text-primary font-mono uppercase text-right max-w-[120px]">{analysis.experience}</span>
                         </div>
                      </div>

                      <button className="w-full bg-black hover:bg-white hover:text-black border-2 border-white text-white py-4 text-xs font-black uppercase font-mono tracking-widest flex items-center justify-center gap-3 transition-colors brutal-shadow-sm mt-auto">
                         <Download className="w-5 h-5" /> Download Report
                      </button>
                   </div>

                   {/* Skill-Gap Checklist Card */}
                   <div className="p-8 border-4 border-white/20 bg-black brutal-shadow flex flex-col space-y-6">
                      <div>
                         <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" /> Role Skill-Gap Checklist
                         </h3>
                         <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-tight">ATS Alignment analysis for target role</p>
                      </div>

                      <div className="space-y-3 font-mono">
                         {(analysis.skillsChecklist || []).map((skill: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-3 border-2 border-white/5 bg-white/[0.01]">
                               <span className="text-xs font-bold text-slate-300">{skill.name}</span>
                               {skill.status === "have" ? (
                                  <span className="text-[9px] font-black uppercase text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">
                                     Acquired
                                  </span>
                               ) : (
                                  <span className="text-[9px] font-black uppercase text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                                     Missing Gap
                                  </span>
                               )}
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Right Column: AI Questions & Recommender */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                   {/* Targeted Challenge Recommender Card */}
                   <div className="p-8 border-4 border-white/20 bg-black brutal-shadow flex flex-col space-y-6">
                      <div>
                         <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" /> Recommended Targeted Practice
                         </h3>
                         <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-tight">AI-guided study recommendations to close skill gaps</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                         {(analysis.recommendations || []).map((rec: any, idx: number) => (
                            <div key={idx} className="p-4 border-2 border-primary bg-primary/[0.01] hover:bg-primary/[0.03] transition-all flex flex-col justify-between space-y-4 brutal-shadow-sm min-h-[140px]">
                               <div>
                                  <span className="text-[9px] font-black uppercase text-primary border border-primary/30 px-1.5 py-0.5 bg-primary/5 rounded mb-2 inline-block">{rec.category}</span>
                                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-relaxed">{rec.title}</h4>
                               </div>
                               <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                  <span className="text-[9px] font-black uppercase text-slate-500">{rec.difficulty}</span>
                                  <button 
                                    onClick={() => router.push(rec.link)}
                                    className="text-[9px] font-black uppercase text-white hover:text-primary transition-colors flex items-center gap-1.5 bg-transparent border-0 cursor-pointer"
                                  >
                                     GO STUDY <ChevronRight className="w-3 h-3" />
                                  </button>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>

                   {/* AI Questions */}
                   <div className="space-y-6">
                      <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-white/20">
                         <h3 className="text-2xl font-black text-white flex items-center gap-4 font-mono uppercase tracking-tight">
                            <Brain className="w-8 h-8 text-primary" /> AI-Generated Questions
                         </h3>
                         <button 
                           onClick={startInterview}
                           className="btn-primary py-3 px-8 flex items-center gap-3 text-xs"
                         >
                            START SESSION <ChevronRight className="w-5 h-5" />
                         </button>
                      </div>
                      
                      <p className="text-sm font-bold text-slate-400 mb-8 font-mono leading-relaxed">
                         Based on your resume, we've generated these targeted questions to test your claims and expertise.
                      </p>

                      {questions.map((q, i) => (
                         <div key={i} className="p-6 border-4 border-white/20 bg-black brutal-shadow-sm hover:border-primary transition-colors">
                            <div className="flex items-start gap-6">
                               <div className="w-12 h-12 border-2 border-white/20 bg-black flex items-center justify-center flex-shrink-0 text-sm font-black text-white brutal-shadow-sm font-mono">
                                  {i + 1}
                               </div>
                               <div className="flex-1 pt-1">
                                  <div className="flex items-center gap-4 mb-4">
                                     <span className="bg-primary text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest font-mono brutal-shadow-sm">{q.type}</span>
                                     <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest font-mono border-2 border-white/20 px-3 py-1">{q.difficulty}</span>
                                  </div>
                                  <h4 className="text-base font-bold text-white mb-3 leading-relaxed font-mono">{q.text}</h4>
                                  {q.followUp && (
                                    <p className="text-xs text-slate-400 font-mono p-4 border-l-4 border-primary bg-white/[0.02]">
                                      <span className="text-primary font-black uppercase">Follow-up:</span> {q.followUp}
                                    </p>
                                  )}
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
      {isUploading && (
        <LoadingScreen message="Uploading & performing AI analysis on your resume..." />
      )}
    </DashboardLayout>
  );
}
