import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  plan: "free" | "pro" | "enterprise";
  joinedAt: string;
  interviewsCompleted: number;
  avgScore: number;
  role?: string;
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  skills: string[];
  parsedData: any;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface Interview {
  id: string;
  role: string;
  experienceLevel: string;
  techStack: string[];
  status: "pending" | "in-progress" | "completed";
  score?: number;
  communicationScore?: number;
  technicalScore?: number;
  confidenceScore?: number;
  duration?: number;
  createdAt: string;
  completedAt?: string;
  questions?: Question[];
  feedback?: Feedback;
}

export interface Question {
  id: string;
  text: string;
  type: "behavioral" | "technical" | "system-design" | "coding";
  answer?: string;
  aiEvaluation?: string;
  score?: number;
}

export interface Feedback {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  summary: string;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  interviews: Interview[];
  resumes: Resume[];
  notifications: Notification[];
  currentInterview: Interview | null;
  sidebarOpen: boolean;

  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setInterviews: (interviews: Interview[]) => void;
  setResumes: (resumes: Resume[]) => void;
  setNotifications: (notifications: Notification[]) => void;
  addInterview: (interview: Interview) => void;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
  setCurrentInterview: (interview: Interview | null) => void;
  toggleSidebar: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      interviews: [],
      resumes: [],
      notifications: [],
      currentInterview: null,
      sidebarOpen: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setInterviews: (interviews) => set({ interviews }),
      setResumes: (resumes) => set({ resumes }),
      setNotifications: (notifications) => set({ notifications }),
      addInterview: (interview) =>
        set((state) => ({ interviews: [interview, ...state.interviews] })),
      updateInterview: (id, updates) =>
        set((state) => ({
          interviews: state.interviews.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
          currentInterview:
            state.currentInterview?.id === id
              ? { ...state.currentInterview, ...updates }
              : state.currentInterview,
        })),
      setCurrentInterview: (interview) => set({ currentInterview: interview }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      logout: () => set({ user: null, isAuthenticated: false, interviews: [], resumes: [], notifications: [] }),
    }),
    { name: "hiremind-store" }
  )
);
