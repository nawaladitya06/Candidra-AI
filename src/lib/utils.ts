import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#f59e0b";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Average";
  if (score >= 40) return "Below Average";
  return "Needs Improvement";
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const ROLES = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Cloud Architect",
  "Product Manager",
  "UX Designer",
  "Mobile Developer",
  "Blockchain Developer",
  "Security Engineer",
  "QA Engineer",
  "Solutions Architect",
  "Technical Lead",
];

export const EXPERIENCE_LEVELS = [
  { value: "intern", label: "Intern (0-1 yr)" },
  { value: "junior", label: "Junior (1-3 yrs)" },
  { value: "mid", label: "Mid-level (3-5 yrs)" },
  { value: "senior", label: "Senior (5-8 yrs)" },
  { value: "lead", label: "Lead / Principal (8+ yrs)" },
  { value: "staff", label: "Staff Engineer" },
];

export const TECH_STACKS = [
  "React", "Next.js", "Vue.js", "Angular", "TypeScript", "JavaScript",
  "Node.js", "Python", "Go", "Rust", "Java", "C++", "C#", "PHP", "Ruby",
  "PostgreSQL", "MongoDB", "Redis", "MySQL", "GraphQL", "REST API",
  "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform",
  "TensorFlow", "PyTorch", "Scikit-learn", "React Native", "Flutter",
];

export const PROGRAMMING_LANGUAGES = [
  { id: "javascript", label: "JavaScript", monacoLang: "javascript", pistonLang: "javascript", pistonVersion: "18.15.0", template: "// Write your solution here\nfunction solution(input) {\n  return input;\n}\n\nconsole.log(solution('test'));\n" },
  { id: "typescript", label: "TypeScript", monacoLang: "typescript", pistonLang: "typescript", pistonVersion: "4.9.5", template: "// Write your solution here\nfunction solution(input: string): string {\n  return input;\n}\n\nconsole.log(solution('test'));\n" },
  { id: "python", label: "Python", monacoLang: "python", pistonLang: "python3", pistonVersion: "3.10.0", template: "# Write your solution here\ndef solution(input):\n    return input\n\nprint(solution('test'))\n" },
  { id: "java", label: "Java", monacoLang: "java", pistonLang: "java", pistonVersion: "15.0.2", template: "// Write your solution here\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"test\");\n    }\n}\n" },
  { id: "cpp", label: "C++", monacoLang: "cpp", pistonLang: "cpp", pistonVersion: "10.2.0", template: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    cout << \"test\" << endl;\n    return 0;\n}\n" },
  { id: "go", label: "Go", monacoLang: "go", pistonLang: "go", pistonVersion: "1.16.2", template: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Write your solution here\n    fmt.Println("test")\n}\n' },
  { id: "rust", label: "Rust", monacoLang: "rust", pistonLang: "rust", pistonVersion: "1.68.2", template: "fn main() {\n    // Write your solution here\n    println!(\"test\");\n}\n" },
];
