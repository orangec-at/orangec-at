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
    <div className="group relative my-4 max-w-full overflow-hidden rounded-lg border border-border sm:my-6">
      {/* 코드 블록 헤더 */}
      <div className="flex items-center justify-between border-b border-border bg-surface-elevated px-4 py-3">
        <div className="flex items-center gap-2">
          {title && (
            <span className="ml-3 text-sm font-medium text-foreground/80">
              {title}
            </span>
          )}
          <span className="ml-auto mr-2 text-xs text-muted-foreground">
            {language}
          </span>
        </div>

        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
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
              <Copy className="h-3 w-3 text-muted-foreground" />
              <span className="text-foreground/80">Copy</span>
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
            background: theme === "dark" ? "var(--surface-elevated)" : "var(--surface)",
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
            color: "var(--muted-foreground)",
            borderRight: "1px solid var(--border)",
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
      className="relative rounded bg-secondary px-1.5 py-0.5 text-sm font-mono text-secondary-foreground"
      {...props}
    >
      {children}
    </code>
  );
}
