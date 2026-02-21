"use client";

import { ResumeSection } from "../resume-section";

interface IntroductionSectionProps {
  content: string;
}

export function IntroductionSection({ content }: IntroductionSectionProps) {
  return (
    <ResumeSection title="About Me">
      <div className="rounded-lg bg-surface p-4">
        <p className="whitespace-pre-line leading-relaxed text-foreground/85">
          {content}
        </p>
      </div>
    </ResumeSection>
  );
}
