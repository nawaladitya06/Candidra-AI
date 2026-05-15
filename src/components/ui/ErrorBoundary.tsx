"use client";

import React, { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full glass p-12 rounded-3xl border border-red-500/20">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-white mb-4">Something went wrong</h1>
            <p className="text-slate-500 mb-8 leading-relaxed">
              We encountered an unexpected error. Our team has been notified.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="btn-primary py-3 flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" /> Try Again
              </button>
              <Link
                href="/"
                className="w-full py-3 rounded-xl bg-white/5 text-slate-400 font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
