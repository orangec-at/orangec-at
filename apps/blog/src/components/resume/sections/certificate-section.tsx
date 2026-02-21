"use client";

import { ResumeSection } from "../resume-section";
import { ResumeTable, Tr, Th, TdValue, TheadRow } from "../resume-table";
import { Certificate } from "../types";

interface CertificateSectionProps {
  data: Certificate[];
}

export function CertificateSection({ data }: CertificateSectionProps) {
  if (!data || data.length === 0) return null;

  return (
    <ResumeSection title="Certifications">
      <ResumeTable>
        <thead>
          <TheadRow>
            <Th>Certificate</Th>
            <Th>Issuer</Th>
            <Th isLast>Year</Th>
          </TheadRow>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <Tr key={`${item.name}-${item.year}`} isLast={index === data.length - 1}>
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
