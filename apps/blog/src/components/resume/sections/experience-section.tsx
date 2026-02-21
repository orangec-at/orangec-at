"use client";

import { ResumeSection } from "../resume-section";
import { ResumeTable, Tr, Th, TdValue, TheadRow } from "../resume-table";
import { WorkExperience } from "../types";

interface ExperienceSectionProps {
  data: WorkExperience[];
}

export function ExperienceSection({ data }: ExperienceSectionProps) {
  return (
    <ResumeSection title="Work Experience">
      <ResumeTable>
        <thead>
          <TheadRow>
            <Th>Period</Th>
            <Th>Company</Th>
            <Th>Position</Th>
            <Th>Department</Th>
            <Th isLast>Title</Th>
          </TheadRow>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <Tr key={`${item.period}-${item.company}`} isLast={index === data.length - 1}>
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
