"use client";

import { ContentTable } from "@orangec-at/design";

interface Project {
  id: string;
  title: string;
  period: string;
  role: string;
  company: string;
}

const testData: Project[] = [
  {
    id: "1",
    title: "요가기록 앱 Drawhatha",
    period: "2024.03 - 현재",
    role: "풀스택 개발",
    company: "개인 프로젝트",
  },
  {
    id: "2",
    title: "요가데이 플랫폼",
    period: "2025.08 - 현재",
    role: "풀스택 개발",
    company: "개인 프로젝트",
  },
  {
    id: "3",
    title: "SSO 인증 시스템",
    period: "2023.04 - 2023.06",
    role: "프론트엔드 아키텍처",
    company: "마이다스아이티",
  },
];

export default function TestDesignPage() {
  return (
    <div className="min-h-screen p-8 bg-white">
      <h1 className="text-3xl font-bold mb-8">Design System Test</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">ContentTable 테스트</h2>

        <ContentTable
          data={testData}
          columns={[
            {
              key: "title",
              header: "프로젝트명",
              width: "w-1/3",
              align: "left",
            },
            {
              key: "period",
              header: "기간",
              width: "w-1/4",
              align: "center",
            },
            {
              key: "role",
              header: "역할",
              width: "w-1/4",
              align: "center",
            },
            {
              key: "company",
              header: "회사",
              width: "w-1/6",
              align: "right",
            },
          ]}
          className="border border-gray-300 rounded-lg overflow-hidden"
        />
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">테스트 확인 사항:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>테이블이 제대로 렌더링되는가?</li>
          <li>Tailwind CSS 스타일이 적용되는가?</li>
          <li>헤더와 데이터가 올바르게 표시되는가?</li>
          <li>레이아웃(width, align)이 작동하는가?</li>
        </ul>
      </div>
    </div>
  );
}
