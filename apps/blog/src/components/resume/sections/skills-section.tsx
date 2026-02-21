"use client";

import { ResumeSection } from "../resume-section";
import { ResumeTable, Tr, TdLabel, TdValue } from "../resume-table";
import { Skills } from "../types";

interface SkillsSectionProps {
  data: Skills;
}

export function SkillsSection({ data }: SkillsSectionProps) {
  const maxRows = Math.max(data.languages.length, data.computer.length);

  return (
    <ResumeSection title="Skills">
      <ResumeTable>
        <tbody>
          {Array.from({ length: maxRows }).map((_, index) => {
            const lang = data.languages[index];
            const comp = data.computer[index];
            const isLast = index === maxRows - 1;

            return (
              <Tr key={`${lang?.language ?? "lang"}-${comp?.name ?? "comp"}-${index}`} isLast={isLast}>
                {index === 0 ? (
                  <TdLabel rowSpan={data.languages.length} className="w-20">
                    Language
                  </TdLabel>
                ) : index >= data.languages.length ? (
                  <TdLabel className="w-20" />
                ) : null}
                
                {lang ? (
                  <>
                    <TdValue>{lang.language}</TdValue>
                    <TdValue>{lang.certification}</TdValue>
                  </>
                ) : (
                  <TdLabel colSpan={2} />
                )}

                {index === 0 ? (
                  <TdLabel rowSpan={data.computer.length} className="w-20">
                    Computer
                  </TdLabel>
                ) : index >= data.computer.length ? (
                  <TdLabel className="w-20" />
                ) : null}

                {comp ? (
                  <>
                    <TdValue>{comp.name}</TdValue>
                    <TdValue isLast>{comp.level}</TdValue>
                  </>
                ) : (
                  <>
                    <TdLabel />
                    <TdLabel isLast />
                  </>
                )}
              </Tr>
            );
          })}
        </tbody>
      </ResumeTable>
    </ResumeSection>
  );
}
