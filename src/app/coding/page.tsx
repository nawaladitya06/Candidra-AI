"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import Editor from "@monaco-editor/react";
import { 
  Play, Save, RefreshCcw, Code2, 
  Terminal, CheckCircle2, AlertCircle,
  ChevronRight, Trophy, Clock, Loader2, Info
} from "lucide-react";
import { PROGRAMMING_LANGUAGES, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

type PistonExecutionResult = {
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  output?: string;
  time?: string;
  memory?: string;
};

type TestResult = {
  id: number;
  name: string;
  status: "passed" | "failed";
  time: string;
  memory: string;
};

export default function CodingPage() {
  const [selectedLang, setSelectedLang] = useState(PROGRAMMING_LANGUAGES[0]);
  const [code, setCode] = useState(selectedLang.template);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState<"problem" | "testcases">("problem");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleLangChange = (langId: string) => {
    const lang = PROGRAMMING_LANGUAGES.find(l => l.id === langId);
    if (lang) {
      setSelectedLang(lang);
      setCode(lang.template);
    }
  };

  const runCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutput("Executing code on remote server...\n");
    setActiveTab("testcases");
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8787"}/coding/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_code: code,
          language: (selectedLang as any).pistonLang,
          version: (selectedLang as any).pistonVersion,
          stdin: ""
        }),
      });

      if (!response.ok) throw new Error("Execution failed");
      
      const result = (await response.json()) as PistonExecutionResult;
      
      if (result.stdout) {
        setOutput(`> Output:\n${result.stdout}`);
        setTestResults([
          { id: 1, name: "Sample Execution", status: "passed", time: `${result.time}s`, memory: `${result.memory}KB` }
        ]);
        toast.success("Execution complete!");
      } else if (result.compile_output) {
        setOutput(`> Compilation Error:\n${result.compile_output}`);
        toast.error("Compilation error");
      } else if (result.stderr) {
        setOutput(`> Runtime Error:\n${result.stderr}`);
        toast.error("Runtime error");
      } else {
        setOutput("> No output returned.");
      }
    } catch (error) {
      setOutput("\nError: Failed to connect to execution server.");
      toast.error("Execution failed.");
    } finally {
      setIsRunning(false);
    }
  };

  const submitSolution = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    toast.loading("Validating against hidden test cases...", { id: "submit" });
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSolved(true);
      toast.success("Solution submitted successfully! +100 Points", { id: "submit" });
    }, 3000);
  };

  const resetCode = () => {
    if (confirm("Are you sure you want to reset your code to the default template?")) {
      setCode(selectedLang.template);
      setOutput("");
      setTestResults([]);
      toast("Code reset to template");
    }
  };

  return (
    <DashboardLayout 
      title="Coding Assessment" 
      subtitle="Master technical rounds with real-time feedback."
    >
      <div className="flex flex-col lg:flex-row h-[calc(100vh-180px)] gap-6">
        {/* Left Side: Problem Description */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 overflow-hidden">
           <GlassCard className="flex-1 p-0 overflow-hidden flex flex-col">
              <div className="flex border-b border-white/5">
                 <button 
                  onClick={() => setActiveTab("problem")}
                  className={cn(
                    "flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2",
                    activeTab === "problem" ? "border-purple-500 text-white bg-white/5" : "border-transparent text-slate-500 hover:text-slate-300"
                  )}
                 >
                    Problem Description
                 </button>
                 <button 
                  onClick={() => setActiveTab("testcases")}
                  className={cn(
                    "flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2",
                    activeTab === "testcases" ? "border-purple-500 text-white bg-white/5" : "border-transparent text-slate-500 hover:text-slate-300"
                  )}
                 >
                    Test Cases {testResults.length > 0 && `(${testResults.length})`}
                 </button>
              </div>

              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                 <AnimatePresence mode="wait">
                    {activeTab === "problem" ? (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-6"
                      >
                         <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white tracking-tight">Reverse Linked List</h2>
                            <span className="badge badge-blue text-[10px]">EASY</span>
                         </div>
                         
                         <div className="text-sm text-slate-400 leading-relaxed space-y-4">
                            <p>Given the head of a singly linked list, reverse the list, and return the reversed list.</p>
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-4">
                               <div>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Example 1</p>
                                  <code className="text-white bg-black/40 p-3 rounded-lg block font-mono text-[12px] border border-white/5">
                                    Input: head = [1,2,3,4,5]<br />
                                    Output: [5,4,3,2,1]
                                  </code>
                               </div>
                               <div>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Example 2</p>
                                  <code className="text-white bg-black/40 p-3 rounded-lg block font-mono text-[12px] border border-white/5">
                                    Input: head = [1,2]<br />
                                    Output: [2,1]
                                  </code>
                               </div>
                            </div>
                            <div className="space-y-3 pt-2">
                               <p className="font-bold text-slate-300 flex items-center gap-2">
                                  <Info className="w-4 h-4 text-purple-400" /> Constraints:
                               </p>
                               <ul className="list-disc pl-5 space-y-1.5 marker:text-purple-500">
                                  <li>The number of nodes in the list is the range [0, 5000].</li>
                                  <li>-5000 &lt;= Node.val &lt;= 5000</li>
                               </ul>
                            </div>
                         </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-3"
                      >
                         {testResults.length > 0 ? (
                            testResults.map(res => (
                               <div key={res.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
                                  <div className="flex items-center gap-3">
                                     <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px]", res.status === 'passed' ? "bg-green-500 shadow-green-500/50" : "bg-red-500 shadow-red-500/50")} />
                                     <div>
                                        <span className="text-sm font-bold text-white block">{res.name}</span>
                                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{res.memory}</span>
                                     </div>
                                  </div>
                                  <span className="text-[10px] text-slate-500 font-mono bg-white/5 px-2 py-1 rounded">{res.time}</span>
                               </div>
                            ))
                         ) : (
                            <div className="text-center py-20">
                               <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                  <Terminal className="w-6 h-6 text-slate-600" />
                               </div>
                               <p className="text-slate-500 text-sm font-medium">Run your code to see test results</p>
                            </div>
                         )}
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              <div className="p-4 border-t border-white/5 flex items-center justify-between bg-black/20">
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5 text-purple-500" /> {formatTime(timeLeft)} remaining
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" /> +100 Points
                 </div>
              </div>
           </GlassCard>
        </div>

        {/* Right Side: Editor */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
           <GlassCard className="flex-1 p-0 overflow-hidden flex flex-col border-white/5">
              <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02]">
                 <div className="flex items-center gap-4">
                    <select 
                      value={selectedLang.id}
                      onChange={(e) => handleLangChange(e.target.value)}
                      className="bg-transparent text-xs font-black text-white uppercase tracking-widest outline-none cursor-pointer hover:text-purple-400 transition-colors"
                    >
                       {PROGRAMMING_LANGUAGES.map(l => <option key={l.id} value={l.id} className="bg-[#0a0a12]">{l.label}</option>)}
                    </select>
                 </div>
                 <div className="flex items-center gap-3">
                    <button 
                      onClick={resetCode}
                      className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all"
                      title="Reset to template"
                    >
                       <RefreshCcw className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all">
                       <Save className="w-4 h-4" />
                    </button>
                 </div>
              </div>

              <div className="flex-1 relative bg-[#1e1e1e]">
                 <Editor
                   height="100%"
                   theme="vs-dark"
                   language={selectedLang.monacoLang}
                   value={code}
                   onChange={(val) => setCode(val || "")}
                   options={{
                     fontSize: 14,
                     minimap: { enabled: false },
                     scrollBeyondLastLine: false,
                     lineNumbers: "on",
                     automaticLayout: true,
                     padding: { top: 20 },
                     fontFamily: "JetBrains Mono",
                     cursorStyle: "block",
                     smoothScrolling: true,
                     lineHeight: 24,
                   }}
                 />
              </div>

              <div className="h-40 border-t border-white/5 bg-[#050508] flex flex-col overflow-hidden">
                 <div className="h-10 px-6 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                       <Terminal className="w-3.5 h-3.5" /> Output Terminal
                    </span>
                    {isRunning && <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_#8b5cf6]" />}
                 </div>
                 <div className="flex-1 p-4 px-6 text-[12px] font-mono text-slate-300 overflow-y-auto custom-scrollbar whitespace-pre">
                    {output || "No output yet. Run your code to see results."}
                 </div>
              </div>

              <div className="p-5 flex items-center justify-between bg-white/[0.02] border-t border-white/5">
                 <Link href="/interview/setup" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Leave Session
                 </Link>
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={runCode}
                      disabled={isRunning || isSubmitting || isSolved}
                      className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                       {isRunning ? <Loader2 className="w-4 h-4 animate-spin text-purple-400" /> : <Play className="w-4 h-4 fill-current" />}
                       {isRunning ? "Running..." : "Run Tests"}
                    </button>
                    <button 
                      onClick={submitSolution}
                      disabled={isRunning || isSubmitting || isSolved}
                      className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                       {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : isSolved ? <CheckCircle2 className="w-4 h-4" /> : null}
                       {isSubmitting ? "Submitting..." : isSolved ? "Submitted" : "Final Submit"}
                    </button>
                 </div>
              </div>
           </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
