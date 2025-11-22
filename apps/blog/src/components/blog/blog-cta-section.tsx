"use client";

import React from "react";
import { Button } from "@/components/ui";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export function BlogCTASection() {
  const t = useTranslations("blog.cta");
  const locale = useLocale();

  return (
    <div className="mt-12 sm:mt-16 p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl text-center border border-blue-200 dark:border-blue-800">
      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight">
        {t("title")}
      </h3>
      <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
        {t("description")}
        <br className="hidden sm:block" />
        <strong>{t("features.mvp")}</strong>
        {locale === "ko" ? "부터 " : " to "}
        <strong>{t("features.stable")}</strong>
        {locale === "ko" ? "까지 함께하세요." : ", let's work together."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
        <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto">
          <Link href={`/${locale}/contact`}>
            🚀 {t("startProject")}
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
          <Link href={`/${locale}/projects`}>
            📂 {t("viewPortfolio")}
          </Link>
        </Button>
      </div>
    </div>
  );
}