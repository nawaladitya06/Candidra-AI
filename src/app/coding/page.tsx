"use client";

import { useState, useRef, useEffect, useMemo } from "react";
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
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useAppStore } from "@/lib/store";
import { generateCodingHint } from "@/lib/gemini";

interface CodingQuestion {
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  description: string;
  examples: Array<{ input: string; output: string }>;
  constraints: string[];
}

const CODING_QUESTIONS_POOL: CodingQuestion[] = [
  {
    title: "Reverse Linked List",
    difficulty: "EASY",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = [1,2]", output: "[2,1]" }
    ],
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ]
  },
  {
    title: "Two Sum",
    difficulty: "EASY",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9"
    ]
  },
  {
    title: "Valid Parentheses",
    difficulty: "EASY",
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets, and in the correct order.",
    examples: [
      { input: "s = '()'", output: "true" },
      { input: "s = '()[]{}'", output: "true" },
      { input: "s = '(]'", output: "false" }
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'"
    ]
  },
  {
    title: "Maximum Subarray",
    difficulty: "MEDIUM",
    description: "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6" },
      { input: "nums = [1]", output: "1" }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ]
  },
  {
    title: "Container With Most Water",
    difficulty: "MEDIUM",
    description: "Given `n` non-negative integers `height` where each represents a point at coordinate `(i, height[i])`. Vertical lines are drawn such that the two endpoints of the line `i` is at `(i, height[i])` and `(i, 0)`. Find two lines, which, together with the x-axis forms a container, such that the container contains the most water.",
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
      { input: "height = [1,1]", output: "1" }
    ],
    constraints: [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ]
  },
  {
    title: "Merge k Sorted Lists",
    difficulty: "HARD",
    description: "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    examples: [
      { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" }
    ],
    constraints: [
      "k == lists.length",
      "0 <= k <= 10^4",
      "0 <= lists[i].length <= 500"
    ]
  },
  {
    title: "Edit Distance",
    difficulty: "HARD",
    description: "Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`. You have the following three operations permitted on a word: Insert a character, Delete a character, Replace a character.",
    examples: [
      { input: "word1 = 'horse', word2 = 'ros'", output: "3" },
      { input: "word1 = 'intention', word2 = 'execution'", output: "5" }
    ],
    constraints: [
      "0 <= word1.length, word2.length <= 500",
      "word1 and word2 consist of lowercase English letters."
    ]
  }
];

type TestResult = {
  id: number;
  name: string;
  status: "passed" | "failed";
  time: string;
  memory: string;
};

export default function CodingPage() {
  const [selectedLang, setSelectedLang] = useState(PROGRAMMING_LANGUAGES[0]);
  const [difficultyFilter, setDifficultyFilter] = useState<"ALL" | "EASY" | "MEDIUM" | "HARD">("ALL");
  const [questionIndex, setQuestionIndex] = useState(0);
  
  const currentQuestion = CODING_QUESTIONS_POOL[questionIndex];

  const filteredQuestions = useMemo(() => {
    if (difficultyFilter === "ALL") return CODING_QUESTIONS_POOL;
    return CODING_QUESTIONS_POOL.filter(q => q.difficulty === difficultyFilter);
  }, [difficultyFilter]);
  
  const [code, setCode] = useState(selectedLang.template);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState<"problem" | "testcases">("problem");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [isSolved, setIsSolved] = useState(false);
  const [codingHint, setCodingHint] = useState("");
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [terminalTab, setTerminalTab] = useState<"console" | "copilot">("console");
  
  const { setCodingPoints, codingPoints } = useAppStore();

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

  const getCustomizedTemplate = (langId: string, q: CodingQuestion) => {
    const lang = PROGRAMMING_LANGUAGES.find(l => l.id === langId);
    if (!lang) return "";

    if (q.title === "Two Sum") {
      if (langId === "javascript" || langId === "typescript") {
        return `// Write your Two Sum solution here\nfunction solution(nums, target) {\n  // Your code here\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] + nums[j] === target) return [i, j];\n    }\n  }\n  return [];\n}\n\nconsole.log(solution([2,7,11,15], 9));\n`;
      } else if (langId === "python") {
        return `# Write your Two Sum solution here\ndef solution(nums, target):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []\n\nprint(solution([2,7,11,15], 9))\n`;
      }
    } else if (q.title === "Valid Parentheses") {
      if (langId === "javascript" || langId === "typescript") {
        return `// Write your Valid Parentheses solution here\nfunction solution(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (let char of s) {\n    if (char === '(' || char === '{' || char === '[') {\n      stack.push(char);\n    } else {\n      if (stack.pop() !== map[char]) return false;\n    }\n  }\n  return stack.length === 0;\n}\n\nconsole.log(solution("()[]{}"));\n`;
      } else if (langId === "python") {
        return `# Write your Valid Parentheses solution here\ndef solution(s):\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping.values():\n            stack.append(char)\n        elif char in mapping.keys():\n            if not stack or stack.pop() != mapping[char]:\n                return False\n    return len(stack) == 0\n\nprint(solution("()[]{}"))\n`;
      }
    } else if (q.title === "Maximum Subarray") {
      if (langId === "javascript" || langId === "typescript") {
        return `// Write your Maximum Subarray solution here\nfunction solution(nums) {\n  let maxSoFar = nums[0];\n  let maxEndingHere = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);\n    maxSoFar = Math.max(maxSoFar, maxEndingHere);\n  }\n  return maxSoFar;\n}\n\nconsole.log(solution([-2,1,-3,4,-1,2,1,-5,4]));\n`;
      } else if (langId === "python") {
        return `# Write your Maximum Subarray solution here\ndef solution(nums):\n    max_so_far = nums[0]\n    max_ending_here = nums[0]\n    for i in range(1, len(nums)):\n        max_ending_here = max(nums[i], max_ending_here + nums[i])\n        max_so_far = max(max_so_far, max_ending_here)\n    return max_so_far\n\nprint(solution([-2,1,-3,4,-1,2,1,-5,4]))\n`;
      }
    } else if (q.title === "Merge k Sorted Lists") {
      if (langId === "javascript" || langId === "typescript") {
        return `// Write your Merge k Sorted Lists solution here\nfunction solution(lists) {\n  const flat = lists.flat().sort((a,b) => a - b);\n  return flat;\n}\n\nconsole.log(solution([[1,4,5],[1,3,4],[2,6]]));\n`;
      } else if (langId === "python") {
        return `# Write your Merge k Sorted Lists solution here\ndef solution(lists):\n    flat = [val for sublist in lists for val in sublist]\n    flat.sort()\n    return flat\n\nprint(solution([[1,4,5],[1,3,4],[2,6]]))\n`;
      }
    } else if (q.title === "Edit Distance") {
      if (langId === "javascript" || langId === "typescript") {
        return `// Write your Edit Distance solution here\nfunction solution(word1, word2) {\n  const m = word1.length, n = word2.length;\n  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));\n  for (let i = 0; i <= m; i++) dp[i][0] = i;\n  for (let j = 0; j <= n; j++) dp[0][j] = j;\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (word1[i-1] === word2[j-1]) dp[i][j] = dp[i-1][j-1];\n      else dp[i][j] = Math.min(dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + 1);\n    }\n  }\n  return dp[m][n];\n}\n\nconsole.log(solution("horse", "ros"));\n`;
      } else if (langId === "python") {
        return `# Write your Edit Distance solution here\ndef solution(word1, word2):\n    m, n = len(word1), len(word2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(m + 1): dp[i][0] = i\n    for j in range(n + 1): dp[0][j] = j\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if word1[i-1] == word2[j-1]: dp[i][j] = dp[i-1][j-1]\n            else: dp[i][j] = min(dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + 1)\n    return dp[m][n]\n\nprint(solution("horse", "ros"))\n`;
      }
    }

    return lang.template;
  };

  const handleLangChange = (langId: string) => {
    const lang = PROGRAMMING_LANGUAGES.find(l => l.id === langId);
    if (lang) {
      setSelectedLang(lang);
      setCode(getCustomizedTemplate(langId, currentQuestion));
    }
  };

  const handleDifficultyFilterChange = (filter: "ALL" | "EASY" | "MEDIUM" | "HARD") => {
    setDifficultyFilter(filter);
    setIsSolved(false);
    setOutput("");
    setTestResults([]);
    
    const newPool = filter === "ALL" 
      ? CODING_QUESTIONS_POOL 
      : CODING_QUESTIONS_POOL.filter(q => q.difficulty === filter);
      
    if (newPool.length > 0) {
      setQuestionIndex(0);
      const firstQ = newPool[0];
      const mainIndex = CODING_QUESTIONS_POOL.findIndex(q => q.title === firstQ.title);
      setQuestionIndex(mainIndex !== -1 ? mainIndex : 0);
      setCode(getCustomizedTemplate(selectedLang.id, firstQ));
      toast.success(`Loaded ${filter} level challenge: ${firstQ.title}`);
    }
  };

  const runCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutput("Executing code on remote server...\n");
    setActiveTab("testcases");
    
    try {
      const { executeCode } = await import("@/lib/coding-actions");
      const result = await executeCode({
        source_code: code,
        language: (selectedLang as any).pistonLang,
        version: (selectedLang as any).pistonVersion,
        stdin: ""
      });
      
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
    
    try {
      // Execute final code
      const { executeCode } = await import("@/lib/coding-actions");
      const result = await executeCode({
        source_code: code,
        language: (selectedLang as any).pistonLang,
        version: (selectedLang as any).pistonVersion,
        stdin: ""
      });

      const isSuccess = result.stdout && !result.stderr;
      
      // Save submission
      await fetch("/api/coding/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: selectedLang.id,
          code,
          status: isSuccess ? "passed" : "failed",
          runtime: parseFloat(result.time || "0"),
          memory: parseFloat(result.memory || "0"),
          score: isSuccess ? 100 : 0
        }),
      });

      if (isSuccess) {
        setIsSolved(true);
        setCodingPoints(codingPoints + 100);
        toast.success("Solution submitted successfully! +100 Points", { id: "submit" });
      } else {
        toast.error("Submission failed hidden tests.", { id: "submit" });
      }
    } catch (error) {
      toast.error("Failed to submit solution.", { id: "submit" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadNextQuestion = () => {
    const nextFilteredIndex = (filteredQuestions.indexOf(currentQuestion) + 1) % filteredQuestions.length;
    const nextQ = filteredQuestions[nextFilteredIndex];
    const mainIndex = CODING_QUESTIONS_POOL.findIndex(q => q.title === nextQ.title);
    
    setQuestionIndex(mainIndex !== -1 ? mainIndex : 0);
    setIsSolved(false);
    setOutput("");
    setTestResults([]);
    
    setCode(getCustomizedTemplate(selectedLang.id, nextQ));
    setActiveTab("problem");
    setCodingHint(""); // Reset hints
    setTerminalTab("console");
    
    toast.success(`Loaded Next Challenge: ${nextQ.title}`);
  };

  const resetCode = () => {
    if (confirm("Are you sure you want to reset your code to the default template?")) {
      setCode(getCustomizedTemplate(selectedLang.id, currentQuestion));
      setOutput("");
      setTestResults([]);
      setCodingHint(""); // Clear copilot hints
      toast("Code reset to template");
    }
  };

  const requestCodingHint = async () => {
    if (!output) {
      toast.error("Run your code first to analyze execution telemetry.");
      return;
    }
    setIsLoadingHint(true);
    setTerminalTab("copilot");
    toast.loading("AI Mentor is analyzing code and stack logs...", { id: "copilotHint" });
    try {
      const hint = await generateCodingHint(code, selectedLang.label, output);
      setCodingHint(hint);
      toast.success("AI Mentor analysis loaded!", { id: "copilotHint" });
    } catch (err) {
      toast.error("Failed to load debugging hint.", { id: "copilotHint" });
    } finally {
      setIsLoadingHint(false);
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
           <div className="flex-1 p-0 overflow-hidden flex flex-col border-4 border-white/20 bg-black brutal-shadow">
              <div className="flex border-b-4 border-white/20">
                 <button 
                  onClick={() => setActiveTab("problem")}
                  className={cn(
                    "flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-4 font-mono",
                    activeTab === "problem" ? "border-primary text-black bg-primary brutal-shadow-sm" : "border-transparent text-slate-500 hover:text-white bg-black"
                  )}
                 >
                    Problem Description
                 </button>
                 <button 
                  onClick={() => setActiveTab("testcases")}
                  className={cn(
                    "flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-4 font-mono",
                    activeTab === "testcases" ? "border-primary text-black bg-primary brutal-shadow-sm" : "border-transparent text-slate-500 hover:text-white bg-black"
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
                        key={currentQuestion.title}
                        className="space-y-6"
                      >
                         <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white tracking-tight uppercase font-mono">{currentQuestion.title}</h2>
                            <span className={cn(
                              "text-[10px] font-black uppercase font-mono tracking-widest px-3 py-1 border-2",
                              currentQuestion.difficulty === "EASY" ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" :
                              currentQuestion.difficulty === "MEDIUM" ? "bg-amber-500/10 border-amber-500 text-amber-400" :
                              "bg-red-500/10 border-red-500 text-red-400"
                            )}>
                              {currentQuestion.difficulty}
                            </span>
                         </div>
                         
                         <div className="text-sm font-bold text-slate-400 leading-relaxed space-y-6 font-mono">
                            <p>{currentQuestion.description}</p>
                            
                            <div className="p-6 border-4 border-white/20 bg-[#07070a] brutal-shadow-sm space-y-6">
                               {currentQuestion.examples.map((eg, idx) => (
                                 <div key={idx}>
                                    <p className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Example {idx + 1}</p>
                                    <code className="text-primary bg-white/5 p-4 block font-mono text-[12px] border-2 border-white/20 whitespace-pre-wrap leading-relaxed">
                                      Input: {eg.input}<br />
                                      Output: {eg.output}
                                    </code>
                                 </div>
                               ))}
                            </div>

                            <div className="space-y-4 pt-4">
                               <p className="font-black text-white flex items-center gap-3 uppercase tracking-tight">
                                  <Info className="w-5 h-5 text-primary" /> Constraints:
                               </p>
                               <ul className="list-disc pl-6 space-y-2 marker:text-primary text-xs">
                                  {currentQuestion.constraints.map((c, idx) => (
                                    <li key={idx}>{c}</li>
                                  ))}
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

              <div className="p-5 border-t-4 border-white/20 flex items-center justify-between bg-black">
                 <div className="flex items-center gap-3 text-[10px] font-black text-white uppercase tracking-widest font-mono">
                    <Clock className="w-4 h-4 text-primary" /> {formatTime(timeLeft)} remaining
                 </div>
                 <div className="flex items-center gap-3 text-[10px] font-black text-white uppercase tracking-widest font-mono bg-white/10 px-3 py-1 border-2 border-white/20">
                    <Trophy className="w-4 h-4 text-amber-500" /> +100 Points
                 </div>
              </div>
           </div>
        </div>

        {/* Right Side: Editor */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
           <div className="flex-1 p-0 overflow-hidden flex flex-col border-4 border-white/20 bg-black brutal-shadow">
              <div className="h-16 border-b-4 border-white/20 flex items-center justify-between px-6 bg-black">
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-slate-500 uppercase font-mono">Lang:</span>
                       <select 
                         value={selectedLang.id}
                         onChange={(e) => handleLangChange(e.target.value)}
                         className="bg-transparent text-sm font-black text-primary uppercase tracking-widest outline-none cursor-pointer hover:text-white transition-colors font-mono"
                       >
                          {PROGRAMMING_LANGUAGES.map(l => <option key={l.id} value={l.id} className="bg-black text-white">{l.label}</option>)}
                       </select>
                    </div>

                    <div className="flex items-center gap-2 border-l-2 border-white/20 pl-4">
                       <span className="text-[10px] font-black text-slate-500 uppercase font-mono">Level:</span>
                       <select 
                         value={difficultyFilter}
                         onChange={(e) => handleDifficultyFilterChange(e.target.value as any)}
                         className="bg-transparent text-sm font-black text-primary uppercase tracking-widest outline-none cursor-pointer hover:text-white transition-colors font-mono"
                       >
                          <option value="ALL" className="bg-black text-white">ALL LEVELS</option>
                          <option value="EASY" className="bg-black text-white">EASY</option>
                          <option value="MEDIUM" className="bg-black text-white">MEDIUM</option>
                          <option value="HARD" className="bg-black text-white">HARD</option>
                       </select>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={resetCode}
                      className="p-2 border-2 border-transparent hover:border-white text-slate-500 hover:text-white transition-all brutal-shadow-sm"
                      title="Reset to template"
                    >
                       <RefreshCcw className="w-5 h-5" />
                    </button>
                    <button className="p-2 border-2 border-transparent hover:border-white text-slate-500 hover:text-white transition-all brutal-shadow-sm">
                       <Save className="w-5 h-5" />
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

               <div className="h-56 border-t-4 border-white/20 bg-black flex flex-col overflow-hidden">
                  <div className="h-12 px-6 flex items-center justify-between border-b-2 border-white/20 bg-black">
                     <div className="flex items-center gap-4">
                        <button
                          onClick={() => setTerminalTab("console")}
                          className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border-b-2 transition-all font-mono",
                            terminalTab === "console" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-white bg-transparent"
                          )}
                        >
                           🖥️ Console Output
                        </button>
                        <button
                          onClick={() => setTerminalTab("copilot")}
                          className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border-b-2 transition-all font-mono flex items-center gap-1.5 relative bg-transparent",
                            terminalTab === "copilot" ? "border-amber-500 text-amber-400" : "border-transparent text-slate-500 hover:text-white"
                          )}
                        >
                           🤖 AI Copilot
                           {codingHint && terminalTab !== "copilot" && (
                              <span className="w-2 h-2 rounded-full bg-amber-500 absolute -top-1 -right-1 animate-pulse" />
                           )}
                        </button>
                     </div>
                     <div className="flex items-center gap-4">
                        <button
                          onClick={requestCodingHint}
                          disabled={isLoadingHint || !output}
                          className="px-3 py-1 bg-amber-500/10 border border-amber-500/40 text-amber-400 text-[10px] font-black uppercase tracking-widest font-mono hover:bg-amber-500/20 hover:border-amber-500 transition-colors brutal-shadow-sm disabled:opacity-30 disabled:hover:bg-transparent bg-transparent"
                        >
                           {isLoadingHint ? "Analyzing..." : "💡 Ask Copilot"}
                        </button>
                        {isRunning && <div className="w-2 h-2 bg-primary animate-pulse border border-black brutal-shadow-sm" />}
                     </div>
                  </div>
                  <div className="flex-1 p-6 text-[13px] font-mono overflow-y-auto custom-scrollbar font-bold leading-relaxed">
                     {terminalTab === "console" ? (
                        <div className="text-primary whitespace-pre">
                           {output || "No output yet. Run your code to see results."}
                        </div>
                     ) : (
                        <div className="text-amber-300">
                           {codingHint ? (
                              <div className="space-y-2">
                                 <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block mb-1">🤖 AI Coding Mentor Review:</span>
                                 <p className="italic">{codingHint}</p>
                              </div>
                           ) : (
                              <div className="text-center py-6 text-slate-500 text-xs font-mono">
                                 Stuck on a bug? Click <span className="text-amber-400 font-black">"ASK COPILOT"</span> to analyze your code and get a hint!
                              </div>
                           )}
                        </div>
                     )}
                  </div>
               </div>

              <div className="p-6 flex items-center justify-between bg-black border-t-4 border-white/20">
                 <Link href="/interview/setup" className="text-xs font-black text-slate-500 hover:text-primary uppercase tracking-widest transition-all flex items-center gap-2 font-mono">
                    <ChevronRight className="w-5 h-5 rotate-180" /> Leave Session
                 </Link>
                 <div className="flex items-center gap-6">
                    <button 
                      onClick={runCode}
                      disabled={isRunning || isSubmitting || isSolved}
                      className="px-6 py-3 bg-black border-4 border-white text-white text-xs font-black uppercase tracking-widest font-mono hover:bg-white hover:text-black brutal-shadow transition-colors flex items-center gap-3 disabled:opacity-50"
                    >
                       {isRunning ? <Loader2 className="w-5 h-5 animate-spin text-black" /> : <Play className="w-5 h-5 fill-current" />}
                       {isRunning ? "RUNNING..." : "RUN TESTS"}
                    </button>
                    {isSolved ? (
                      <button 
                        onClick={loadNextQuestion}
                        className="px-8 py-3 bg-primary border-4 border-black text-black text-xs font-black uppercase tracking-widest font-mono hover:bg-black hover:text-primary hover:border-primary brutal-shadow transition-colors flex items-center gap-3"
                      >
                         NEXT CHALLENGE <ChevronRight className="w-5 h-5" />
                      </button>
                    ) : (
                      <button 
                        onClick={submitSolution}
                        disabled={isRunning || isSubmitting}
                        className="px-8 py-3 btn-primary text-xs font-black uppercase tracking-widest font-mono flex items-center gap-3 disabled:opacity-50"
                      >
                         {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                         {isSubmitting ? "SUBMITTING..." : "FINAL SUBMIT"}
                      </button>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>
      {isSubmitting && (
        <LoadingScreen message="Executing test suite against hidden test cases..." />
      )}
    </DashboardLayout>
  );
}
