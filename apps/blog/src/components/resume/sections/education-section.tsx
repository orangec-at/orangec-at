"use client";

import { ResumeSection } from "../resume-section";
import { ResumeTable, Tr, Th, TdValue, TheadRow } from "../resume-table";
import { Education } from "../types";

interface EducationSectionProps {
  data: Education[];
}

export function EducationSection({ data }: EducationSectionProps) {
  return (
    <ResumeSection title="Education">
      <ResumeTable>
        <thead>
          <TheadRow>
            <Th>Date</Th>
            <Th>School</Th>
            <Th isLast>Major</Th>
          </TheadRow>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <Tr key={`${item.date}-${item.school}`} isLast={index === data.length - 1}>
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
