"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppStore, Interview, Resume, Notification as AppNotification } from "@/lib/store";

export function StoreSync() {
  const { data: session, status } = useSession();
  const { setUser, setInterviews, setResumes, setNotifications, setCodingPoints } = useAppStore();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (typeof document !== "undefined") {
        document.cookie = "candidra-logged-in=true; path=/; max-age=604800; SameSite=Lax";
      }
      setUser({
        id: session.user.id as string,
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || undefined,
        plan: "pro", // In production, this would be fetched from a subscription table
        joinedAt: new Date().toISOString(),
        interviewsCompleted: 0,
        avgScore: 0,
        role: (session.user as any).role || "user",
      });

      const fetchUserData = async () => {
        try {
          const [interviewsRes, resumesRes, notificationsRes, codingPointsRes] = await Promise.all([
            fetch("/api/interviews"),
            fetch("/api/resumes"),
            fetch("/api/notifications"),
            fetch("/api/coding/submit"),
          ]);

          if (interviewsRes.ok) {
            const interviews = (await interviewsRes.json()) as Interview[];
            setInterviews(interviews);
          }
          if (resumesRes.ok) {
            const resumes = (await resumesRes.json()) as Resume[];
            setResumes(resumes);
          }
          if (notificationsRes.ok) {
            const notifications = (await notificationsRes.json()) as AppNotification[];
            setNotifications(notifications);
          }
          if (codingPointsRes.ok) {
            const data = await codingPointsRes.json();
            setCodingPoints(data.totalPoints || 0);
          }
        } catch (error) {
          console.error("Failed to sync user data:", error);
        }
      };

      fetchUserData();
    }
  }, [session, status, setUser, setInterviews, setResumes, setNotifications, setCodingPoints]);

  return null;
}
