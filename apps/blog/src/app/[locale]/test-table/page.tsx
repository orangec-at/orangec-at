"use client";

import { ContentTable, DataTable } from "@orangec-at/design";
import { ColumnDef } from "@tanstack/react-table";
import projectsData from "../../../../documents/resumes/data/projects.json";
import experiencesData from "../../../../documents/resumes/data/experiences.json";

// 프로젝트 타입 정의
type Project = {
  id: string;
  title: string;
  period: string;
  role: string;
  company: string;
  tags: string[];
};

// 경력 타입 정의
type Experience = {
  id: string;
  company: string;
  position: string;
  period: string;
  tags: string[];
};

// JSON 데이터를 배열로 변환
const projectsList = Object.values(projectsData) as Project[];
const experiencesList = Object.values(experiencesData) as Experience[];

// DataTable용 컬럼 정의
const projectColumns: ColumnDef<Project>[] = [
  {
    accessorKey: "title",
    header: "프로젝트명",
  },
  {
    accessorKey: "period",
    header: "기간",
  },
  {
    accessorKey: "role",
    header: "역할",
  },
  {
    accessorKey: "company",
    header: "회사",
  },
];

export default function TestTablePage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-8">
        DataTable Test (Blog App)
      </h1>

      <div className="space-y-8">
        {/* JSON 데이터 통계 */}
        <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">JSON 데이터 로드 확인</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-bold mb-2">프로젝트 개수</h3>
              <p className="text-3xl font-bold">{projectsList.length}개</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-bold mb-2">경력 개수</h3>
              <p className="text-3xl font-bold">{experiencesList.length}개</p>
            </div>
          </div>
        </section>

        {/* DataTable - 테스트 데이터 */}
        <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">
            DataTable - 테스트 데이터 (인라인)
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            간단한 테스트 데이터로 렌더링 확인
          </p>
          <DataTable
            columns={projectColumns}
            data={[
              {
                id: "1",
                title: "요가기록 앱 Drawhatha",
                period: "2024.03 - 현재",
                role: "풀스택 개발",
                company: "개인 프로젝트",
                tags: [],
              },
              {
                id: "2",
                title: "요가데이 플랫폼",
                period: "2025.08 - 현재",
                role: "풀스택 개발",
                company: "개인 프로젝트",
                tags: [],
              },
              {
                id: "3",
                title: "SSO 인증 시스템",
                period: "2023.04 - 2023.06",
                role: "프론트엔드",
                company: "마이다스아이티",
                tags: [],
              },
            ]}
            config={{
              enablePagination: true,
              pageSize: 5,
            }}
          />
        </section>

        {/* DataTable - JSON 데이터 */}
        <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">
            DataTable - 전체 프로젝트 (JSON 데이터)
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            JSON 파일에서 로드한 데이터 ({projectsList.length}개)
          </p>
          <DataTable
            columns={projectColumns}
            data={projectsList}
            config={{
              enablePagination: true,
              pageSize: 5,
            }}
          />
        </section>

        {/* Plain HTML table with same CSS variables */}
        <section className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">
            동일한 CSS 변수를 사용한 HTML 테이블
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[var(--bg-ds-light)] border-b border-[var(--purple-200)]">
                <th className="p-[var(--padding-5)] text-left">프로젝트명</th>
                <th className="p-[var(--padding-5)] text-center">기간</th>
                <th className="p-[var(--padding-5)] text-right">역할</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-b border-[var(--bg-neutral-light)]">
                <td className="p-[var(--padding-5)]">테스트 프로젝트</td>
                <td className="p-[var(--padding-5)] text-center">2024</td>
                <td className="p-[var(--padding-5)] text-right">개발자</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* CSS Variables Check */}
        <section className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">CSS 변수 확인</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-semibold mb-2">--bg-ds-light</p>
              <div
                className="w-full h-20 border-2 border-gray-300 rounded"
                style={{ backgroundColor: "var(--bg-ds-light)" }}
              />
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">--purple-200</p>
              <div
                className="w-full h-20 border-2 border-gray-300 rounded"
                style={{ backgroundColor: "var(--purple-200)" }}
              />
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">--bg-neutral-light</p>
              <div
                className="w-full h-20 border-2 border-gray-300 rounded"
                style={{ backgroundColor: "var(--bg-neutral-light)" }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            ↑ 색상이 보이면 CSS 변수가 정의되어 있음. 흰색이면 변수가 없는 것임.
          </p>
        </section>
      </div>
    </div>
  );
}
