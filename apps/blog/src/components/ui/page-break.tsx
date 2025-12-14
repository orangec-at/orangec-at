"use client";

import { Scissors } from "lucide-react";

interface PageBreakProps {
  /** 화면에서 표시 여부 (기본: true) */
  showInEditor?: boolean;
  /** 라벨 텍스트 */
  label?: string;
}

/**
 * PDF 출력 시 페이지를 구분하는 컴포넌트
 * - 화면: 점선 + 가위 아이콘으로 표시
 * - 인쇄/PDF: 실제 페이지 나눔
 */
export function PageBreak({
  showInEditor = true,
  label = "페이지 나눔",
}: PageBreakProps) {
  return (
    <div
      className="page-break-container my-8 print:my-0"
      style={{
        breakAfter: "page",
        pageBreakAfter: "always",
      }}
    >
      {/* 화면에서만 표시되는 시각적 가이드 */}
      {showInEditor && (
        <div className="print:hidden flex items-center gap-3 py-4">
          <div className="flex-1 border-t-2 border-dashed border-gray-300 dark:border-gray-600" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-500 dark:text-gray-400">
            <Scissors className="w-3.5 h-3.5" />
            <span>{label}</span>
          </div>
          <div className="flex-1 border-t-2 border-dashed border-gray-300 dark:border-gray-600" />
        </div>
      )}
    </div>
  );
}

/**
 * 여러 페이지 나눔 옵션을 제공하는 컴포넌트
 */
export function PageBreakBefore({ children }: { children?: React.ReactNode }) {
  return (
    <div
      style={{
        breakBefore: "page",
        pageBreakBefore: "always",
      }}
    >
      {children}
    </div>
  );
}

/**
 * 페이지 나눔 방지 (요소가 잘리지 않도록)
 */
export function AvoidPageBreak({ children }: { children?: React.ReactNode }) {
  return (
    <div
      style={{
        breakInside: "avoid",
        pageBreakInside: "avoid",
      }}
    >
      {children}
    </div>
  );
}
