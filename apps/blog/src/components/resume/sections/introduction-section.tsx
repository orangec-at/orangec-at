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
      <div className="rounded-lg bg-surface p-4">
        <p className="whitespace-pre-line leading-relaxed text-foreground/85">
          {content}
        </p>
      </div>
    </ResumeSection>
  );
}
