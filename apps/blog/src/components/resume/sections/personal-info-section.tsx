"use client";

import { useTranslations } from "next-intl";
import { ResumeSection } from "../resume-section";
import { ResumeTable, TdLabel, TdValue, Tr } from "../resume-table";
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
            <TdLabel className="w-24">{t("name")}</TdLabel>
            <TdValue isLast>
              {data.nameKorean} / {data.nameEnglish}
            </TdValue>
          </Tr>

          <Tr>
            <TdLabel>{t("email")}</TdLabel>
            <TdValue colSpan={2} isLast>
              {data.email}
            </TdValue>
          </Tr>
          {(data.sns || data.twitter || data.linkedin || data.blog) && (
            <Tr>
              <TdLabel className="align-top">{t("sns")}</TdLabel>
              <TdValue isLast>
                <div className="flex flex-wrap gap-2">
                  {data.sns && (
                    <span className="muji-tile muji-tile-pill muji-tile-small">
                      {data.sns}
                    </span>
                  )}
                  {data.twitter && (
                    <a
                      href={data.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="muji-tile muji-tile-pill muji-tile-small text-blue-700"
                    >
                      {t("twitter")}
                    </a>
                  )}
                  {data.linkedin && (
                    <a
                      href={data.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="muji-tile muji-tile-pill muji-tile-small text-blue-700"
                    >
                      {t("linkedin")}
                    </a>
                  )}
                  {data.blog && (
                    <a
                      href={data.blog}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="muji-tile muji-tile-pill muji-tile-small text-blue-700"
                    >
                      {t("blog")}
                    </a>
                  )}
                </div>
              </TdValue>
            </Tr>
          )}
        </tbody>
      </ResumeTable>
    </ResumeSection>
  );
}
