"use client";

import Alert from "@orangec-at/design/components/ui/alert";
import {
  KRDSHeading,
  KRDSBody,
  Title,
  Button,
  Badge,
  Input,
  Textarea,
  Checkbox,
  Chip,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ContentTable,
  DataTable,
} from "@orangec-at/design/index";
import { ColumnDef } from "@tanstack/react-table";

// DataTable 테스트 데이터 타입
type Project = {
  id: string;
  title: string;
  period: string;
  role: string;
  company: string;
  status: "진행중" | "완료";
};

// DataTable 테스트 데이터
const projectData: Project[] = [
  {
    id: "1",
    title: "요가기록 앱 Drawhatha",
    period: "2024.03 - 현재",
    role: "풀스택 개발",
    company: "개인 프로젝트",
    status: "진행중",
  },
  {
    id: "2",
    title: "요가데이 플랫폼",
    period: "2025.08 - 현재",
    role: "풀스택 개발",
    company: "개인 프로젝트",
    status: "진행중",
  },
  {
    id: "3",
    title: "SSO 인증 시스템",
    period: "2023.04 - 2023.06",
    role: "프론트엔드 아키텍처",
    company: "마이다스아이티",
    status: "완료",
  },
  {
    id: "4",
    title: "클라우드 스토리지 MWS",
    period: "2023.11 - 2024.02",
    role: "프론트엔드 리드",
    company: "마이다스아이티",
    status: "완료",
  },
];

// DataTable 컬럼 정의
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
  {
    accessorKey: "status",
    header: "상태",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "진행중" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
];

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <KRDSHeading variant="xlarge">OrangeCat Design System</KRDSHeading>
          <KRDSBody variant="large" className="text-gray-600">
            디자인 시스템 컴포넌트 쇼케이스
          </KRDSBody>
        </header>

        {/* Typography */}
        <section className="space-y-4">
          <Title variant="xl-700">Typography</Title>
          <div className="space-y-2">
            <KRDSHeading variant="large">KRDS Heading Large</KRDSHeading>
            <KRDSHeading variant="medium">KRDS Heading Medium</KRDSHeading>
            <Title variant="l-700">Title Large 700</Title>
            <KRDSBody variant="medium">
              KRDS Body Medium - 본문 텍스트 예시입니다.
            </KRDSBody>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-4">
          <Title variant="xl-700">Buttons</Title>
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Default</Button>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </section>

        {/* Badges & Chips */}
        <section className="space-y-4">
          <Title variant="xl-700">Badges & Chips</Title>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip>Chip 1</Chip>
              <Chip>Chip 2</Chip>
              <Chip>Chip 3</Chip>
            </div>
          </div>
        </section>

        {/* Form Components */}
        <section className="space-y-4">
          <Title variant="xl-700">Form Components</Title>
          <div className="space-y-3">
            <Input type="text" placeholder="Enter text..." />
            <Textarea placeholder="Enter description..." rows={3} />
            <div className="flex items-center gap-2">
              <Checkbox id="check1" />
              <label htmlFor="check1">체크박스</label>
            </div>
          </div>
        </section>

        {/* Accordion */}
        <section className="space-y-4">
          <Title variant="xl-700">Accordion</Title>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>섹션 1</AccordionTrigger>
              <AccordionContent>
                섹션 1의 내용입니다. 아코디언을 열면 이 내용이 표시됩니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>섹션 2</AccordionTrigger>
              <AccordionContent>섹션 2의 내용입니다.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Tabs */}
        <section className="space-y-4">
          <Title variant="xl-700">Tabs</Title>
          <Tabs value="tab1" onValueChange={() => {}}>
            <TabsList>
              <TabsTrigger value="tab1">탭 1</TabsTrigger>
              <TabsTrigger value="tab2">탭 2</TabsTrigger>
              <TabsTrigger value="tab3">탭 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
              <p className="p-4">탭 1의 내용입니다.</p>
            </TabsContent>
            <TabsContent value="tab2">
              <p className="p-4">탭 2의 내용입니다.</p>
            </TabsContent>
            <TabsContent value="tab3">
              <p className="p-4">탭 3의 내용입니다.</p>
            </TabsContent>
          </Tabs>
        </section>

        {/* Alert */}
        <section className="space-y-4">
          <Title variant="xl-700">Alert</Title>
          <Alert title="알림 메시지입니다." />
        </section>

        {/* Card */}
        <section className="space-y-4">
          <Title variant="xl-700">Card</Title>
          {/* <Card>
            <CardHeader>
              <CardTitle>카드 제목</CardTitle>
              <CardDescription>카드 설명 텍스트</CardDescription>
            </CardHeader>
            <CardContent>
              <p>카드의 본문 내용이 여기에 들어갑니다.</p>
            </CardContent>
          </Card> */}
        </section>

        {/* ContentTable */}
        <section className="space-y-4">
          <Title variant="xl-700">ContentTable</Title>
          <div className="space-y-4">
            <KRDSBody variant="medium" className="text-gray-600">
              프로젝트 이력서용 테이블 컴포넌트 테스트
            </KRDSBody>

            <ContentTable
              data={[
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
              ]}
              columns={[
                {
                  key: "title",
                  header: "프로젝트명",
                  width: "w-2/5",
                  align: "left",
                },
                {
                  key: "period",
                  header: "기간",
                  width: "w-1/5",
                  align: "center",
                },
                {
                  key: "role",
                  header: "역할",
                  width: "w-1/5",
                  align: "center",
                },
                {
                  key: "company",
                  header: "회사",
                  width: "w-1/5",
                  align: "right",
                },
              ]}
              className="border border-gray-300 rounded-lg overflow-hidden shadow-sm"
            />

            <div className="mt-4 p-4 bg-gray-100 rounded">
              <KRDSBody variant="small" className="text-gray-700">
                <strong>확인 사항:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>헤더 배경색 (보라색 계열): var(--bg-ds-light)</li>
                  <li>헤더 하단 테두리: var(--purple-200)</li>
                  <li>행 테두리: var(--bg-neutral-light)</li>
                  <li>패딩: var(--padding-5) = 12px</li>
                  <li>텍스트 정렬: left / center / right</li>
                </ul>
              </KRDSBody>
            </div>
          </div>
        </section>

        {/* DataTable */}
        <section className="space-y-4">
          <Title variant="xl-700">DataTable (TanStack Table)</Title>
          <div className="space-y-4">
            <KRDSBody variant="medium" className="text-gray-600">
              TanStack Table 기반 고급 테이블 컴포넌트 - 정렬, 필터링,
              페이지네이션 지원
            </KRDSBody>

            <DataTable
              columns={projectColumns}
              data={projectData}
              config={{
                enablePagination: true,
                pageSize: 3,
              }}
            />

            <div className="mt-4 p-4 bg-gray-100 rounded">
              <KRDSBody variant="small" className="text-gray-700">
                <strong>DataTable 기능:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>TanStack Table 기반 고급 테이블</li>
                  <li>페이지네이션 (3개씩 표시)</li>
                  <li>커스텀 셀 렌더링 (Badge 컴포넌트)</li>
                  <li>반응형 디자인</li>
                  <li>다크모드 지원</li>
                </ul>
              </KRDSBody>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
