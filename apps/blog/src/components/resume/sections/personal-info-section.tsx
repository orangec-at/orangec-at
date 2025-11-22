"use client";

import { useTranslations } from "next-intl";
import { ResumeSection } from "../resume-section";
import { ResumeTable, Tr, TdLabel, TdValue } from "../resume-table";
import { PersonalInfo } from "../types";

interface PersonalInfoSectionProps {
  data: PersonalInfo;
}

export function PersonalInfoSection({ data }: PersonalInfoSectionProps) {
  const t = useTranslations("resume.personalInfo");

  return (
    <ResumeSection title={t("title")}>
      <ResumeTable>
        <tbody>
          <Tr>
            <TdLabel rowSpan={5} className="align-middle w-28">
              {t("photo")}
            </TdLabel>
            <TdLabel rowSpan={2} className="w-24">
              {t("name")}
            </TdLabel>
            <TdLabel className="w-20">{t("korean")}</TdLabel>
            <TdValue isLast>{data.nameKorean}</TdValue>
          </Tr>
          <Tr>
            <TdLabel>{t("english")}</TdLabel>
            <TdValue isLast>{data.nameEnglish}</TdValue>
          </Tr>
          <Tr>
            <TdLabel>{t("birthDate")}</TdLabel>
            <TdValue colSpan={2} isLast>
              {data.birthDate}
            </TdValue>
          </Tr>
          <Tr>
            <TdLabel>{t("email")}</TdLabel>
            <TdValue colSpan={2} isLast>
              {data.email}
            </TdValue>
          </Tr>
          <Tr>
            <TdLabel>{t("phone")}</TdLabel>
            <TdValue>{data.phone}</TdValue>
            <TdLabel>{t("sns")}</TdLabel>
            <TdValue isLast>{data.sns}</TdValue>
          </Tr>
          <Tr isLast>
            <TdLabel colSpan={2}>{t("address")}</TdLabel>
            <TdValue colSpan={3} isLast>
              {data.address}
            </TdValue>
          </Tr>
        </tbody>
      </ResumeTable>
    </ResumeSection>
  );
}
