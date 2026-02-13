"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { withLocalePath } from "@/lib/locale-path";
import { useTheme } from "@/contexts/theme-context";

interface LoginClientProps {
  locale: string;
}

type LoginState = "idle" | "sending" | "sent" | "error";

export default function LoginClient({ locale }: LoginClientProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<LoginState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isKo = locale === "ko";
  const isDark = theme === "dark";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage(isKo ? "올바른 이메일을 입력하세요." : "Please enter a valid email.");
      setState("error");
      return;
    }

    setState("sending");
    setErrorMessage("");

    try {
      const blogApiUrl = process.env.NEXT_PUBLIC_BLOG_API_URL ?? "http://localhost:8080";
      const response = await fetch(`${blogApiUrl}/api/auth/magic-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          locale,
          callback_url: window.location.origin,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setState("sent");
      } else {
        setErrorMessage(data.message ?? (isKo ? "오류가 발생했습니다." : "An error occurred."));
        setState("error");
      }
    } catch {
      setErrorMessage(isKo ? "네트워크 오류가 발생했습니다." : "Network error occurred.");
      setState("error");
    }
  };

  const handleBack = () => {
    router.push(withLocalePath(locale, "/"));
  };

  if (state === "sent") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-section">
        <div className={`max-w-md w-full rounded-lg p-8 text-center ${
          isDark ? "bg-card border-border" : "bg-card border-border"
        } border`}>
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>
          <h1 className={`font-serif text-2xl font-bold mb-3 ${
            isDark ? "text-foreground" : "text-foreground"
          }`}>
            {isKo ? "이메일을 확인하세요" : "Check your email"}
          </h1>
          <p className={`text-sm mb-6 ${isDark ? "text-muted-foreground" : "text-muted-foreground"}`}>
            {isKo 
              ? `${email}로 로그인 링크를 보냈습니다.`
              : `We sent a login link to ${email}.`
            }
          </p>
          <p className={`text-xs ${isDark ? "text-muted-foreground/80" : "text-muted-foreground/80"}`}>
            {isKo 
              ? "이메일이 보이지 않으면 스팸 폴더를 확인하세요."
              : "If you don't see it, check your spam folder."
            }
          </p>
          <button
            onClick={handleBack}
            className={`mt-8 text-sm underline ${isDark ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {isKo ? "홈으로 돌아가기" : "Back to home"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-section">
      <div className={`max-w-md w-full rounded-lg p-8 ${
        isDark ? "bg-card border-border" : "bg-card border-border"
      } border`}>
        <h1 className={`font-serif text-2xl font-bold mb-2 ${
          isDark ? "text-foreground" : "text-foreground"
        }`}>
          {isKo ? "심야 서고에 오신 것을 환영합니다" : "Welcome to Midnight Archives"}
        </h1>
        <p className={`text-sm mb-8 ${isDark ? "text-muted-foreground" : "text-muted-foreground"}`}>
          {isKo 
            ? "이메일을 입력하면 로그인 링크를 보내드립니다."
            : "Enter your email and we'll send you a login link."
          }
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="email" 
              className={`block text-sm font-medium mb-2 ${isDark ? "text-foreground/85" : "text-foreground/85"}`}
            >
              {isKo ? "이메일" : "Email"}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isKo ? "you@example.com" : "you@example.com"}
              disabled={state === "sending"}
              className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors ${
                isDark 
                  ? "bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-ember-accent" 
                  : "bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-ember-accent"
              } focus:outline-none focus:ring-1 focus:ring-ember-accent/40 disabled:opacity-50`}
            />
          </div>

          {state === "error" && (
            <p className="text-sm text-destructive">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={state === "sending"}
            className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
              isDark
                ? "bg-foreground text-background hover:bg-ember-accent hover:text-primary-foreground disabled:opacity-50 disabled:pointer-events-none"
                : "bg-foreground text-background hover:bg-ember-accent hover:text-primary-foreground disabled:opacity-50 disabled:pointer-events-none"
            }`}
          >
            {state === "sending" 
              ? (isKo ? "전송 중..." : "Sending...") 
              : (isKo ? "로그인 링크 받기" : "Get login link")
            }
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border">
          <button
            onClick={handleBack}
            className={`w-full py-2 text-sm ${isDark ? "text-muted-foreground hover:text-ember-accent" : "text-muted-foreground hover:text-ember-accent"}`}
          >
            {isKo ? "← 홈으로 돌아가기" : "← Back to home"}
          </button>
        </div>
      </div>
    </div>
  );
}
