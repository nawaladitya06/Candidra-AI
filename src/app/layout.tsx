import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { StoreSync } from "@/components/auth/StoreSync";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export const metadata: Metadata = {
  title: "HireMind AI — Ace Your Next Interview",
  description:
    "The most advanced AI-powered interview preparation platform. Practice with realistic AI interviews, get instant feedback, and land your dream job.",
  keywords: ["AI interview prep", "job interview practice", "technical interview", "coding interview", "HireMind"],
  authors: [{ name: "HireMind AI" }],
  openGraph: {
    title: "HireMind AI — Ace Your Next Interview",
    description: "AI-powered interview preparation platform with voice interviews, coding rounds, and personalized feedback.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ErrorBoundary>
          <SessionProvider>
            <StoreSync />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "rgba(15, 15, 30, 0.95)",
                  color: "#f8fafc",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "10px",
                  backdropFilter: "blur(20px)",
                },
                success: {
                  iconTheme: { primary: "#10b981", secondary: "white" },
                },
                error: {
                  iconTheme: { primary: "#ef4444", secondary: "white" },
                },
              }}
            />
            {children}
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
