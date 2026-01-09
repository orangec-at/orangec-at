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
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className={`max-w-md w-full rounded-lg p-8 text-center ${
          isDark ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200"
        } border`}>
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>
          <h1 className={`font-serif text-2xl font-bold mb-3 ${
            isDark ? "text-stone-100" : "text-stone-900"
          }`}>
            {isKo ? "이메일을 확인하세요" : "Check your email"}
          </h1>
          <p className={`text-sm mb-6 ${isDark ? "text-stone-400" : "text-stone-600"}`}>
            {isKo 
              ? `${email}로 로그인 링크를 보냈습니다.`
              : `We sent a login link to ${email}.`
            }
          </p>
          <p className={`text-xs ${isDark ? "text-stone-500" : "text-stone-500"}`}>
            {isKo 
              ? "이메일이 보이지 않으면 스팸 폴더를 확인하세요."
              : "If you don't see it, check your spam folder."
            }
          </p>
          <button
            onClick={handleBack}
            className={`mt-8 text-sm underline ${isDark ? "text-stone-400 hover:text-stone-300" : "text-stone-600 hover:text-stone-800"}`}
          >
            {isKo ? "홈으로 돌아가기" : "Back to home"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className={`max-w-md w-full rounded-lg p-8 ${
        isDark ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200"
      } border`}>
        <h1 className={`font-serif text-2xl font-bold mb-2 ${
          isDark ? "text-stone-100" : "text-stone-900"
        }`}>
          {isKo ? "심야 서고에 오신 것을 환영합니다" : "Welcome to Midnight Archives"}
        </h1>
        <p className={`text-sm mb-8 ${isDark ? "text-stone-400" : "text-stone-600"}`}>
          {isKo 
            ? "이메일을 입력하면 로그인 링크를 보내드립니다."
            : "Enter your email and we'll send you a login link."
          }
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="email" 
              className={`block text-sm font-medium mb-2 ${isDark ? "text-stone-300" : "text-stone-700"}`}
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
                  ? "bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-500 focus:border-stone-500" 
                  : "bg-white border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-stone-500"
              } focus:outline-none focus:ring-1 focus:ring-stone-500 disabled:opacity-50`}
            />
          </div>

          {state === "error" && (
            <p className="text-sm text-red-500 dark:text-red-400">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={state === "sending"}
            className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
              isDark
                ? "bg-stone-100 text-stone-900 hover:bg-stone-200 disabled:bg-stone-700 disabled:text-stone-500"
                : "bg-stone-900 text-white hover:bg-stone-700 disabled:bg-stone-300 disabled:text-stone-500"
            }`}
          >
            {state === "sending" 
              ? (isKo ? "전송 중..." : "Sending...") 
              : (isKo ? "로그인 링크 받기" : "Get login link")
            }
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-stone-200 dark:border-stone-800">
          <button
            onClick={handleBack}
            className={`w-full py-2 text-sm ${isDark ? "text-stone-400 hover:text-stone-300" : "text-stone-600 hover:text-stone-800"}`}
          >
            {isKo ? "← 홈으로 돌아가기" : "← Back to home"}
          </button>
        </div>
      </div>
    </div>
  );
}
