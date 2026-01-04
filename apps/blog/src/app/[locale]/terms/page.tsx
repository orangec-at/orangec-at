import Link from "next/link";

import { withLocalePath } from "@/lib/locale-path";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen paper-texture bg-[#fdfcf5] dark:bg-[#1a1a1a]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">
          {locale === "ko" ? "이용약관" : "Terms"}
        </h1>
        <p className="mt-4 text-sm text-stone-700 dark:text-stone-300">
          {locale === "ko"
            ? "이 페이지는 이용약관을 안내합니다."
            : "This page describes the terms of use."}
        </p>

        <div className="mt-8 text-sm text-stone-600 dark:text-stone-400 space-y-4">
          <p>
            {locale === "ko"
              ? "현재는 초기 구축 단계이며, 정식 약관 문서는 추후 업데이트됩니다."
              : "This project is in early stage; full terms will be published later."}
          </p>
          <p>
            {locale === "ko"
              ? "문의: contact 페이지를 이용해주세요."
              : "For inquiries, use the contact page."}
          </p>
        </div>

        <div className="mt-10 flex gap-3">
          <Link
            href={withLocalePath(locale, "/")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 transition-colors"
          >
            {locale === "ko" ? "홈" : "Home"}
          </Link>
          <Link
            href={withLocalePath(locale, "/#contact")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-stone-900 text-white hover:bg-stone-700 dark:bg-red-900 dark:hover:bg-red-800 transition-colors"
          >
            {locale === "ko" ? "문의" : "Contact"}
          </Link>
        </div>
      </div>
    </div>
  );
}
