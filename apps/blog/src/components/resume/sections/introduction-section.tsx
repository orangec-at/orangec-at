"use client";

import { useTranslations } from "next-intl";
import { ResumeSection } from "../resume-section";

interface IntroductionSectionProps {
  content: string;
}

export function IntroductionSection({ content }: IntroductionSectionProps) {
  const t = useTranslations("resume.introduction");

  return (
    <ResumeSection title={t("title")}>
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {content}
        </p>
      </div>
    </ResumeSection>
  );
}
