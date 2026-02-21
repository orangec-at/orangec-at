"use client";

import { ResumeSection } from "../resume-section";
import { ResumeTable, TdLabel, TdValue, Tr } from "../resume-table";
import { PersonalInfo } from "../types";

interface PersonalInfoSectionProps {
  data: PersonalInfo;
}

export function PersonalInfoSection({ data }: PersonalInfoSectionProps) {
  return (
    <ResumeSection title="Personal Information">
      <ResumeTable>
        <tbody>
          <Tr>
            <TdLabel className="w-24">Name</TdLabel>
            <TdValue isLast>
              {data.nameKorean} / {data.nameEnglish}
            </TdValue>
          </Tr>

          <Tr>
            <TdLabel>Email</TdLabel>
            <TdValue colSpan={2} isLast>
              {data.email}
            </TdValue>
          </Tr>
          {(data.sns || data.twitter || data.linkedin || data.blog) && (
            <Tr>
              <TdLabel className="align-top">SNS</TdLabel>
              <TdValue isLast>
                <div className="flex flex-wrap gap-2">
                  {data.sns && (
                    <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
                      {data.sns}
                    </span>
                  )}
                  {data.twitter && (
                    <a
                      href={data.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      X
                    </a>
                  )}
                  {data.linkedin && (
                    <a
                      href={data.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      LinkedIn
                    </a>
                  )}
                  {data.blog && (
                    <a
                      href={data.blog}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      Blog
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
