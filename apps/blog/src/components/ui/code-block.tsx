"use client";

import { useTheme } from "@/contexts/theme-context";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeBlockProps {
  children: string;
  className?: string;
  title?: string;
}

export function CodeBlock({ children, className = "", title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  // className에서 언어 추출 (예: language-typescript -> typescript)
  const language = className.replace(/language-/, "") || "text";

  // 코드 내용 정리
  const code = children.trim();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div className="relative group my-4 sm:my-6 rounded-lg overflow-hidden border border-[#1c1917]/10 dark:border-white/10 max-w-full">
      {/* 코드 블록 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#ddd9d1] dark:bg-zinc-800 border-b border-[#1c1917]/10 dark:border-white/10">
        <div className="flex items-center gap-2">
          {title && (
            <span className="text-sm font-medium text-[#1c1917]/70 dark:text-white/70 ml-3">
              {title}
            </span>
          )}
          <span className="text-xs text-[#1c1917]/50 dark:text-white/50 ml-auto mr-2">
            {language}
          </span>
        </div>

        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-md bg-[#ccc8c0] dark:bg-zinc-700 hover:bg-[#c0bcb4] dark:hover:bg-zinc-600 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-400">
                Copied!
              </span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-[#1c1917]/50 dark:text-white/50" />
              <span className="text-[#1c1917]/70 dark:text-white/70">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* 코드 영역 */}
      <div className="code-scroll-container prevent-horizontal-scroll">
        <SyntaxHighlighter
          language={language}
          style={theme === "dark" ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: theme === "dark" ? "#24273A" : "#F7F7F8",
            fontSize: "13px",
            lineHeight: "1.4",
            maxWidth: "100%",
            overflowX: "auto",
            wordBreak: "break-word",
            
          }}
          showLineNumbers={true}
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "0.75em",
            color: theme === "dark" ? "#6b7280" : "#9ca3af",
            borderRight: `1px solid ${
              theme === "dark" ? "#374151" : "#e5e7eb"
            }`,
            marginRight: "0.75em",
            fontSize: "12px",
          }}
          wrapLines={true}
          wrapLongLines={true}
          PreTag="div"
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

// 인라인 코드용 컴포넌트
export function InlineCode({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className="relative rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm font-mono text-gray-900 dark:text-gray-100"
      {...props}
    >
      {children}
    </code>
  );
}
