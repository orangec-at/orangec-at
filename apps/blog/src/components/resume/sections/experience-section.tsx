"use client";

import { useTranslations } from "next-intl";
import { ResumeSection } from "../resume-section";
import { ResumeTable, Tr, Th, TdValue, TheadRow } from "../resume-table";
import { WorkExperience } from "../types";

interface ExperienceSectionProps {
  data: WorkExperience[];
}

export function ExperienceSection({ data }: ExperienceSectionProps) {
  const t = useTranslations("resume.experience");

  return (
    <ResumeSection title={t("title")}>
      <ResumeTable>
        <thead>
          <TheadRow>
            <Th>{t("period")}</Th>
            <Th>{t("company")}</Th>
            <Th>{t("position")}</Th>
            <Th>{t("department")}</Th>
            <Th isLast>{t("rank")}</Th>
          </TheadRow>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <Tr key={index} isLast={index === data.length - 1}>
              <TdValue>{item.period}</TdValue>
              <TdValue>{item.company}</TdValue>
              <TdValue>{item.position}</TdValue>
              <TdValue>{item.department}</TdValue>
              <TdValue isLast>{item.rank}</TdValue>
            </Tr>
          ))}
        </tbody>
      </ResumeTable>
    </ResumeSection>
  );
}
