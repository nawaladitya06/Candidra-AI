import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

type Bindings = {
  GEMINI_API_KEY: string;
  PISTON_API_URL: string;
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());

// --- Gemini AI ---
const genAI = (apiKey: string) => new GoogleGenerativeAI(apiKey);

app.post(
  '/interview/generate',
  zValidator(
    'json',
    z.object({
      role: z.string(),
      experienceLevel: z.string(),
      techStack: z.array(z.string()),
      count: z.number().default(5),
    })
  ),
  async (c) => {
    const { role, experienceLevel, techStack, count } = c.req.valid('json');
    const model = genAI(c.env.GEMINI_API_KEY).getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an elite technical interviewer. Generate ${count} interview questions for a ${experienceLevel} ${role} role.
      Target technologies: ${techStack.join(', ')}.
      
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
    
    // Clean JSON if needed (sometimes Gemini adds markdown backticks)
    const jsonStr = text.replace(/```json|```/g, '').trim();
    
    return c.json(JSON.parse(jsonStr));
  }
);

app.post(
  '/interview/evaluate',
  zValidator(
    'json',
    z.object({
      role: z.string(),
      experienceLevel: z.string(),
      questions: z.array(
        z.object({
          id: z.string(),
          text: z.string(),
          answer: z.string(),
          type: z.string(),
        })
      ),
    })
  ),
  async (c) => {
    const { role, experienceLevel, questions } = c.req.valid('json');
    const model = genAI(c.env.GEMINI_API_KEY).getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Evaluate the following interview performance for a ${experienceLevel} ${role} role.
      
      Questions and Answers:
      ${questions.map((q, i) => `Q${i+1}: ${q.text}\nA${i+1}: ${q.answer}`).join('\n\n')}
      
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
    const jsonStr = text.replace(/```json|```/g, '').trim();
    
    return c.json(JSON.parse(jsonStr));
  }
);

// --- Piston Coding Execution ---
app.post(
  '/coding/execute',
  zValidator(
    'json',
    z.object({
      language: z.string(),
      version: z.string().default('*'),
      source_code: z.string(),
      stdin: z.string().optional(),
    })
  ),
  async (c) => {
    const { language, version, source_code, stdin } = c.req.valid('json');
    const { PISTON_API_URL } = c.env;

    const res = await fetch(`${PISTON_API_URL}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language,
        version,
        files: [{ content: source_code }],
        stdin: stdin || "",
      }),
    });

    const data = await res.json() as any;
    
    return c.json({
      stdout: data.run?.stdout || "",
      stderr: data.run?.stderr || "",
      output: data.run?.output || "",
      code: data.run?.code,
      compile_output: data.compile?.output || "",
    });
  }
);

export default app;
