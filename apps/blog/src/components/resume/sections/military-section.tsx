"use client";

import { useTranslations } from "next-intl";
import { ResumeSection } from "../resume-section";
import { ResumeTable, Tr, TdLabel, TdValue } from "../resume-table";
import { MilitaryService } from "../types";

interface MilitarySectionProps {
  data: MilitaryService;
}

export function MilitarySection({ data }: MilitarySectionProps) {
  const t = useTranslations("resume.military");

  return (
    <ResumeSection title={t("title")}>
      <ResumeTable>
        <tbody>
          <Tr>
            <TdLabel className="w-24">{t("branch")}</TdLabel>
            <TdValue>{data.branch}</TdValue>
            <TdLabel className="w-24">{t("status")}</TdLabel>
            <TdValue isLast>{data.status}</TdValue>
          </Tr>
          <Tr>
            <TdLabel>{t("rank")}</TdLabel>
            <TdValue>{data.rank}</TdValue>
            <TdLabel>{t("location")}</TdLabel>
            <TdValue isLast>{data.location}</TdValue>
          </Tr>
          <Tr isLast>
            <TdLabel>{t("period")}</TdLabel>
            <TdValue>{data.period}</TdValue>
            <TdLabel>{t("veteran")}</TdLabel>
            <TdValue isLast>{data.veteranStatus}</TdValue>
          </Tr>
        </tbody>
      </ResumeTable>
    </ResumeSection>
  );
}
