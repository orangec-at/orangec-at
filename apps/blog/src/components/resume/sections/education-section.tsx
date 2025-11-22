"use client";

import { useTranslations } from "next-intl";
import { ResumeSection } from "../resume-section";
import { ResumeTable, Tr, Th, TdValue, TheadRow } from "../resume-table";
import { Education } from "../types";

interface EducationSectionProps {
  data: Education[];
}

export function EducationSection({ data }: EducationSectionProps) {
  const t = useTranslations("resume.education");

  return (
    <ResumeSection title={t("title")}>
      <ResumeTable>
        <thead>
          <TheadRow>
            <Th>{t("date")}</Th>
            <Th>{t("school")}</Th>
            <Th isLast>{t("major")}</Th>
          </TheadRow>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <Tr key={index} isLast={index === data.length - 1}>
              <TdValue>{item.date}</TdValue>
              <TdValue>{item.school}</TdValue>
              <TdValue isLast>{item.major}</TdValue>
            </Tr>
          ))}
        </tbody>
      </ResumeTable>
    </ResumeSection>
  );
}
