"use server";

import { generateInterviewQuestions as aiGenerateQuestions, evaluateInterview as aiEvaluateInterview, generateFollowUpQuestionAction } from "./ai-actions";
import { Feedback, Question } from "./store";

export async function generateInterviewQuestions(params: {
  role: string;
  experienceLevel: string;
  techStack: string[];
  resumeText?: string;
  count?: number;
}): Promise<Question[]> {
  return aiGenerateQuestions(params);
}

export async function generateFollowUpQuestion(
  originalQuestion: string,
  answer: string,
  role: string
): Promise<string> {
  return generateFollowUpQuestionAction(originalQuestion, answer, role);
}

export async function evaluateInterview(params: {
  role: string;
  experienceLevel: string;
  questions: Array<{ id: string; text: string; answer: string; type: string }>;
}): Promise<Feedback> {
  return aiEvaluateInterview(params);
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
