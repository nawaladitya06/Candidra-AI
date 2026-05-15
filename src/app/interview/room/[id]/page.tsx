"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppStore, Question } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  Mic, MicOff, Brain, ChevronRight, 
  Clock, MessageSquare, ShieldCheck, 
  Play, Pause, RefreshCcw, Save, StopCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatDuration } from "@/lib/utils";
import toast from "react-hot-toast";
import { evaluateInterview } from "@/lib/gemini";

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
    length: number;
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

export default function InterviewRoomPage() {
  const { id } = useParams();
  const router = useRouter();
  const { currentInterview, updateInterview } = useAppStore();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [timeLeft, setTimeLeft] = useState(0); // Total seconds
  const [isPaused, setIsPaused] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [micPermission, setMicPermission] = useState<"granted" | "denied" | "prompt">("prompt");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!currentInterview) {
      router.push("/dashboard");
      return;
    }

    // Initialize Timer
    timerRef.current = setInterval(() => {
      if (!isPaused) {
        setTimeLeft(prev => prev + 1);
      }
    }, 1000);

    // Initialize Speech Recognition
    if (typeof window !== "undefined") {
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognitionConstructor) {
        recognitionRef.current = new SpeechRecognitionConstructor() as SpeechRecognition;
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let interim = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              setTranscript(prev => prev + " " + event.results[i][0].transcript);
              setInterimTranscript("");
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          setInterimTranscript(interim);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          if (event.error === "not-allowed") {
            setMicPermission("denied");
            toast.error("Microphone access denied. Please enable it in browser settings.");
          }
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          if (isListening && recognitionRef.current) {
            try {
              recognitionRef.current.start(); 
            } catch (e) {
              console.error("Speech recognition restart error", e);
            }
          }
        };
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.onend = () => {};
        recognitionRef.current.stop();
      }
    };
  }, [currentInterview, router, isPaused, isListening]);

  const toggleListening = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicPermission("granted");
        setTranscript("");
        setInterimTranscript("");
        recognitionRef.current?.start();
        setIsListening(true);
        toast.success("AI is listening...", {
          icon: '🎙️',
          style: {
            background: '#1e1b4b',
            color: '#fff',
            border: '1px solid #4338ca'
          }
        });
      } catch (err) {
        setMicPermission("denied");
        toast.error("Microphone access required for voice interview.");
      }
    }
  };

  const currentQuestion = currentInterview?.questions?.[currentQuestionIndex];

  const handleNext = async () => {
    if (!currentInterview || !currentQuestion) return;

    const finalAnswer = (transcript + " " + interimTranscript).trim();
    if (!finalAnswer && !isListening) {
      toast.error("Please provide an answer before continuing.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const updatedQuestions = [...(currentInterview.questions || [])];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      answer: finalAnswer
    };
    
    updateInterview(currentInterview.id, { questions: updatedQuestions });

    if (currentQuestionIndex < (currentInterview.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTranscript("");
      setInterimTranscript("");
    } else {
      setIsEvaluating(true);
      toast.loading("Generating AI evaluation...", { id: "eval" });
      
      try {
        const evaluation = await evaluateInterview({
          role: currentInterview.role,
          experienceLevel: currentInterview.experienceLevel,
          questions: updatedQuestions.map(q => ({
            id: q.id,
            text: q.text,
            answer: q.answer || "",
            type: q.type
          }))
        });

        updateInterview(currentInterview.id, {
          status: "completed",
          score: evaluation.overallScore,
          communicationScore: evaluation.communicationScore,
          technicalScore: evaluation.technicalScore,
          confidenceScore: evaluation.confidenceScore,
          duration: timeLeft,
          completedAt: new Date().toISOString(),
          feedback: evaluation
        });

        toast.success("Evaluation complete!", { id: "eval" });
        router.push(`/reports/${currentInterview.id}`);
      } catch (error) {
        toast.error("Evaluation failed, but results were saved.", { id: "eval" });
        router.push("/dashboard");
      }
    }
  };

  if (!currentInterview || !currentQuestion) return null;

  return (
    <div className="min-h-screen bg-[#050508] relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600" />

      {/* Top Bar */}
      <header className="h-16 glass flex items-center justify-between px-8 relative z-10">
         <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
               <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
               <h2 className="text-sm font-bold text-white uppercase tracking-widest">{currentInterview.role}</h2>
               <p className="text-[10px] text-slate-500 font-medium">SESSION ID: {id}</p>
            </div>
         </div>

         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-300">
               <Clock className="w-4 h-4 text-purple-500" />
               <span className="font-mono text-sm">{formatDuration(timeLeft)}</span>
            </div>
            <div className="flex items-center gap-3">
               <button 
                onClick={() => setIsPaused(!isPaused)}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
               >
                  {isPaused ? <Play className="w-4 h-4 text-green-500" /> : <Pause className="w-4 h-4 text-slate-300" />}
               </button>
               <button 
                onClick={() => router.push("/dashboard")}
                className="btn-secondary text-xs py-2 px-4 border-red-500/20 text-red-400 hover:bg-red-500/10"
               >
                 Quit Session
               </button>
            </div>
         </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 flex flex-col md:flex-row p-6 gap-6 relative z-10 overflow-hidden">
         {/* Left Side: Question */}
         <div className="flex-1 flex flex-col gap-6 overflow-hidden">
            <GlassCard className="flex-1 p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
               <div className="absolute top-8 left-8">
                  <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                    Question {currentQuestionIndex + 1} of {currentInterview.questions?.length}
                  </span>
               </div>
               
               <AnimatePresence mode="wait">
                 <motion.div
                   key={currentQuestionIndex}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="max-w-2xl"
                 >
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight">
                       {currentQuestion.text}
                    </h1>
                    <div className="flex items-center justify-center gap-3 mb-8">
                       <span className="badge badge-purple uppercase">{currentQuestion.type}</span>
                       <span className="badge badge-blue uppercase">50XP</span>
                    </div>
                 </motion.div>
               </AnimatePresence>

               {/* Waveform Visualization */}
               <div className="flex items-end gap-1.5 h-16 mb-8">
                  {[...Array(30)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        height: isListening ? [10, Math.random() * 60 + 10, 10] : 10 
                      }}
                      transition={{ 
                        duration: 0.4, 
                        repeat: Infinity, 
                        delay: i * 0.03 
                      }}
                      className={cn(
                        "w-2 rounded-full transition-colors duration-300",
                        isListening 
                          ? "bg-gradient-to-t from-purple-600 to-cyan-400" 
                          : "bg-slate-800"
                      )}
                    />
                  ))}
               </div>
            </GlassCard>

            {/* Transcription Box */}
            <GlassCard className="h-48 p-8 relative overflow-hidden bg-[#0a0a0f]/90 border-white/5">
               <div className="absolute top-4 left-6 flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", isListening ? "bg-red-500 animate-pulse" : "bg-slate-500")} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Transcript</span>
               </div>
               <div className="mt-8 text-slate-200 font-medium leading-relaxed overflow-y-auto h-24 custom-scrollbar pr-4 text-lg">
                  {transcript}
                  <span className="text-slate-500">{interimTranscript}</span>
                  {!transcript && !interimTranscript && !isListening && (
                    <span className="text-slate-600 italic">Click the microphone and start speaking...</span>
                  )}
                  {isListening && !transcript && !interimTranscript && (
                    <span className="text-purple-400 animate-pulse">Listening for your voice...</span>
                  )}
               </div>
               {!isListening && transcript && (
                 <button 
                  onClick={() => setTranscript("")}
                  className="absolute bottom-4 right-6 text-[10px] font-bold text-slate-500 hover:text-white uppercase flex items-center gap-1 transition-colors"
                 >
                    <RefreshCcw className="w-3 h-3" /> Clear
                 </button>
               )}
            </GlassCard>
         </div>

         {/* Right Side: Controls */}
         <div className="w-full md:w-80 flex flex-col gap-6">
            <GlassCard className="p-8 flex flex-col items-center justify-center gap-8 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               
               <div className="relative">
                  <motion.div
                    animate={{ 
                      scale: isListening ? [1, 1.15, 1] : 1,
                      boxShadow: isListening 
                        ? ["0 0 20px rgba(139,92,246,0.2)", "0 0 60px rgba(139,92,246,0.5)", "0 0 20px rgba(139,92,246,0.2)"] 
                        : "0 0 0px rgba(0,0,0,0)"
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={cn(
                      "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 relative z-10",
                      isListening 
                        ? "bg-gradient-to-tr from-red-500 to-pink-500" 
                        : "bg-gradient-to-tr from-purple-600 to-indigo-600"
                    )}
                  >
                     <button 
                      onClick={toggleListening}
                      className="w-full h-full flex items-center justify-center text-white"
                     >
                        {isListening ? (
                          <motion.div
                            animate={{ scale: [1, 0.9, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          >
                            <Mic className="w-12 h-12" />
                          </motion.div>
                        ) : (
                          <MicOff className="w-12 h-12" />
                        )}
                     </button>
                  </motion.div>
                  
                  {/* Decorative Rings */}
                  <AnimatePresence>
                    {isListening && (
                      <>
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1.5, opacity: 0.3 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="absolute inset-0 rounded-full border-2 border-purple-500"
                        />
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 2, opacity: 0.1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                          className="absolute inset-0 rounded-full border-2 border-cyan-500"
                        />
                      </>
                    )}
                  </AnimatePresence>
               </div>
               
               <div className="text-center relative z-10">
                  <h3 className="text-xl font-black text-white mb-2 tracking-tight">
                    {isListening ? "AI is Analyzing" : "Microphone Muted"}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {isListening ? "Speak clearly for best accuracy" : "Tap the button to start answering"}
                  </p>
               </div>
            </GlassCard>

            <GlassCard className="flex-1 p-8 flex flex-col">
               <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-green-400" /> STAR Framework
               </h4>
               
               <div className="space-y-6 flex-1">
                 {[
                   { l: "S", t: "Situation", d: "Context of the event" },
                   { l: "T", t: "Task", d: "What was your goal?" },
                   { l: "A", t: "Action", d: "What did you specifically do?" },
                   { l: "R", t: "Result", d: "What was the outcome?" },
                 ].map((star) => (
                   <div key={star.l} className="flex gap-4">
                     <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-purple-400">
                       {star.l}
                     </div>
                     <div>
                       <p className="text-xs font-bold text-slate-200">{star.t}</p>
                       <p className="text-[10px] text-slate-500">{star.d}</p>
                     </div>
                   </div>
                 ))}
               </div>

               <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
                  <button 
                    disabled={!transcript && !isListening}
                    onClick={handleNext}
                    className="w-full btn-primary py-4 flex items-center justify-center gap-3 text-sm font-black group"
                  >
                    {currentQuestionIndex === (currentInterview.questions?.length || 0) - 1 ? "Complete Session" : "Next Question"} 
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="w-full bg-white/5 hover:bg-white/10 border border-white/5 py-4 rounded-xl text-xs font-black text-slate-400 uppercase tracking-widest transition-all">
                    Skip Question
                  </button>
               </div>
            </GlassCard>
         </div>
      </main>

      {/* Evaluating Overlay */}
      <AnimatePresence>
        {isEvaluating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050508]/90 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-6"
          >
             <div className="relative mb-12">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="w-32 h-32 rounded-full border-4 border-purple-500/10 border-t-purple-500" 
                />
                <Brain className="absolute inset-0 m-auto w-12 h-12 text-purple-500 animate-pulse" />
                
                {/* Orbital dots */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3 + i, ease: "linear" }}
                    className="absolute inset-0"
                  >
                    <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] absolute -top-1.5 left-1/2 -translate-x-1/2" />
                  </motion.div>
                ))}
             </div>
             
             <motion.h2 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="text-4xl font-black text-white mb-6 tracking-tighter"
             >
                Synthesizing Your Results
             </motion.h2>
             <p className="text-slate-400 max-w-md mx-auto leading-relaxed font-medium">
                Our AI model is currently analyzing your technical depth, communication clarity, and situational awareness.
             </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
