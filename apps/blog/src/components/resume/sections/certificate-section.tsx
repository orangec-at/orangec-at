"use client";

import { useTranslations } from "next-intl";
import { ResumeSection } from "../resume-section";
import { ResumeTable, Tr, Th, TdValue, TheadRow } from "../resume-table";
import { Certificate } from "../types";

interface CertificateSectionProps {
  data: Certificate[];
}

export function CertificateSection({ data }: CertificateSectionProps) {
  const t = useTranslations("resume.certificate");

  if (!data || data.length === 0) return null;

  return (
    <ResumeSection title={t("title")}>
      <ResumeTable>
        <thead>
          <TheadRow>
            <Th>{t("name")}</Th>
            <Th>{t("issuer")}</Th>
            <Th isLast>{t("year")}</Th>
          </TheadRow>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <Tr key={index} isLast={index === data.length - 1}>
              <TdValue>{item.name}</TdValue>
              <TdValue>{item.issuer}</TdValue>
              <TdValue isLast>{item.year}</TdValue>
            </Tr>
          ))}
        </tbody>
      </ResumeTable>
    </ResumeSection>
  );
}
