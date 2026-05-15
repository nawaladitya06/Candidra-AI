import { Feedback, Question } from "./store";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8787";

export async function generateInterviewQuestions(params: {
  role: string;
  experienceLevel: string;
  techStack: string[];
  resumeText?: string;
  count?: number;
}): Promise<Question[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/interview/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!response.ok) throw new Error("Failed to generate questions");
    return (await response.json()) as Question[];
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}

export async function generateFollowUpQuestion(
  originalQuestion: string,
  answer: string,
  role: string
): Promise<string> {
  return "Can you provide a specific example from your experience?";
}

export async function evaluateInterview(params: {
  role: string;
  experienceLevel: string;
  questions: Array<{ id: string; text: string; answer: string; type: string }>;
}): Promise<Feedback> {
  try {
    const response = await fetch(`${BACKEND_URL}/interview/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!response.ok) throw new Error("Failed to evaluate interview");
    return (await response.json()) as Feedback;
  } catch (error) {
    console.error("AI Evaluation Error:", error);
    throw error;
  }
}

export async function generateResumeQuestions(resumeText: string, role: string): Promise<Question[]> {
  return generateInterviewQuestions({
    role,
    experienceLevel: "senior",
    techStack: [],
    resumeText,
    count: 6
  });
}
