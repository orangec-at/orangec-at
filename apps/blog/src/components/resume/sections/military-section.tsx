"use client";

import { ResumeSection } from "../resume-section";
import { ResumeTable, Tr, TdLabel, TdValue } from "../resume-table";
import { MilitaryService } from "../types";

interface MilitarySectionProps {
  data: MilitaryService;
}

export function MilitarySection({ data }: MilitarySectionProps) {
  return (
    <ResumeSection title="Military Service">
      <ResumeTable>
        <tbody>
          <Tr>
            <TdLabel className="w-24">Branch</TdLabel>
            <TdValue>{data.branch}</TdValue>
            <TdLabel className="w-24">Status</TdLabel>
            <TdValue isLast>{data.status}</TdValue>
          </Tr>
          <Tr>
            <TdLabel>Rank</TdLabel>
            <TdValue>{data.rank}</TdValue>
            <TdLabel>Location</TdLabel>
            <TdValue isLast>{data.location}</TdValue>
          </Tr>
          <Tr isLast>
            <TdLabel>Service Period</TdLabel>
            <TdValue>{data.period}</TdValue>
            <TdLabel>Veteran Status</TdLabel>
            <TdValue isLast>{data.veteranStatus}</TdValue>
          </Tr>
        </tbody>
      </ResumeTable>
    </ResumeSection>
  );
}
