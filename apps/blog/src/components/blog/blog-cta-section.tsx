import React from "react";
import { Button } from "@/components/ui";
import Link from "next/link";

interface BlogCTASectionProps {
  locale: string;
}

export function BlogCTASection({ locale }: BlogCTASectionProps) {
  return (
    <div className="mt-12 sm:mt-16 p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl text-center border border-blue-200 dark:border-blue-800">
      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight">
        {locale === "ko"
          ? "이런 기술이 필요한 프로젝트가 있으신가요?"
          : "Do you have a project that needs these technologies?"}
      </h3>
      <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
        {locale === "ko" ? (
          <>
            위에서 다룬 기술들을 활용해 여러분의 아이디어를 실제 서비스로
            만들어드립니다.
            <br className="hidden sm:block" />
            <strong>빠른 MVP 개발</strong>부터{" "}
            <strong>안정적인 운영</strong>까지 함께하세요.
          </>
        ) : (
          <>
            I can help turn your ideas into real services using the
            technologies discussed above.
            <br className="hidden sm:block" />
            From <strong>rapid MVP development</strong> to{" "}
            <strong>stable operations</strong>, let&apos;s work together.
          </>
        )}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
        <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto">
          <Link href={`/${locale}/contact`}>
            🚀 {locale === "ko" ? "프로젝트 시작하기" : "Start Project"}
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
          <Link href={`/${locale}/projects`}>
            📂 {locale === "ko" ? "포트폴리오 보기" : "View Portfolio"}
          </Link>
        </Button>
      </div>
    </div>
  );
}