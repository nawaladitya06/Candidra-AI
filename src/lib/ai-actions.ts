"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Question, Feedback } from "./store";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateInterviewQuestions(params: {
  role: string;
  experienceLevel: string;
  techStack: string[];
  count?: number;
}) {
  const { role, experienceLevel, techStack, count = 5 } = params;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    You are an elite technical interviewer. Generate ${count} interview questions for a ${experienceLevel} ${role} role.
    Target technologies: ${techStack.join(", ")}.
    
    Return the result as a JSON array of objects with the following structure:
    {
      "id": "string",
      "text": "string",
      "type": "technical" | "behavioral" | "situational",
      "difficulty": "easy" | "medium" | "hard"
    }
    
    Ensure the questions are challenging and realistic. Provide ONLY the JSON.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  const jsonStr = text.replace(/```json|```/g, "").trim();
  
  return JSON.parse(jsonStr) as Question[];
}

export async function evaluateInterview(params: {
  role: string;
  experienceLevel: string;
  questions: Array<{ id: string; text: string; answer: string; type: string }>;
}) {
  const { role, experienceLevel, questions } = params;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Evaluate the following interview performance for a ${experienceLevel} ${role} role.
    
    Questions and Answers:
    ${questions.map((q, i) => `Q${i+1}: ${q.text}\nA${i+1}: ${q.answer}`).join("\n\n")}
    
    Provide a detailed analysis including:
    - overallScore (0-100)
    - technicalScore (0-100)
    - communicationScore (0-100)
    - confidenceScore (0-100)
    - summary (executive summary)
    - strengths (array of strings)
    - weaknesses (array of strings)
    - improvements (array of strings)
    
    Return ONLY a JSON object.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  const jsonStr = text.replace(/```json|```/g, "").trim();
  
  return JSON.parse(jsonStr) as Feedback;
}
