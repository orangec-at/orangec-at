"use client";

import React from "react";
import { Button } from "@/components/ui";
import { Title, Body } from "@/components/ui/typography";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export function BlogCTASection() {
  const t = useTranslations("blog.cta");
  const locale = useLocale();

  return (
    <div className="mt-12 sm:mt-16 p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl text-center border border-gray-200 dark:border-gray-700">
      <Title variant="l-700" as="h3" className="text-gray-900 dark:text-white mb-3 sm:mb-4">
        {t("title")}
      </Title>
      <Body variant="m-400" className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-2xl mx-auto">
        {t("description")}
        <br className="hidden sm:block" />
        <strong>{t("features.mvp")}</strong>
        {t("from")}
        <strong>{t("features.stable")}</strong>
        {t("to")}
      </Body>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href={`/${locale}/contact`}>
            {t("startProject")}
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
          <Link href={`/${locale}/projects`}>
            {t("viewPortfolio")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
