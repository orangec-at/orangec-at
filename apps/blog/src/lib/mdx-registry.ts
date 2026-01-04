/**
 * MDX 커스텀 컴포넌트 중앙 레지스트리
 *
 * 이 파일에서 모든 MDX 커스텀 컴포넌트를 관리합니다.
 * 새 컴포넌트 추가 시 이 파일만 수정하면 됩니다.
 *
 * 사용처:
 * - MDX 렌더링: mdxCustomComponents
 * - 에디터 블록: getComponentBlocks()
 */

import type { ComponentType, ReactNode } from "react";

// ============================================
// 컴포넌트 Imports
// ============================================

// Resume 컴포넌트
import {
  ResumeTable,
  Tr,
  Th,
  TdLabel,
  TdValue,
  TheadRow,
  ResumeSection,
  ResumeExperienceContentTable,
  ResumeProjectContentTable,
  ResumeEducationContentTable,
} from "@/components/resume";

// UI 컴포넌트
import { Avatar, AvatarFallback, AvatarImage } from "@orangec-at/design";
import { Badge } from "@orangec-at/design";
import { Button } from "@orangec-at/design";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@orangec-at/design";
import { SplitText } from "@/components/ui/split-text";
import {
  PageBreak,
  PageBreakBefore,
  AvoidPageBreak,
} from "@/components/ui/page-break";

// 디자인 시스템 컴포넌트
import {
  KRDSHeading,
  KRDSBody,
  Title,
  Body,
  Input,
  Textarea,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Checkbox,
  Chip,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  DataTable,
  ContentTable,
} from "@orangec-at/design";

// ============================================
// 타입 정의
// ============================================

export type ComponentCategory = "resume" | "ui" | "layout";

export interface ComponentMeta {
  id: string;
  name: string;
  nameKo: string;
  icon: string;
  category: ComponentCategory;
  template: string;
  description?: string;
}

export interface MDXComponentDefinition {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  meta: ComponentMeta;
}

// ============================================
// 컴포넌트 레지스트리
// ============================================

export const MDX_COMPONENT_REGISTRY: Record<string, MDXComponentDefinition> = {
  // ----------------------------------------
  // Resume 테이블 컴포넌트
  // ----------------------------------------
  ResumeTable: {
    component: ResumeTable,
    meta: {
      id: "resume-table",
      name: "Resume Table",
      nameKo: "이력서 테이블",
      icon: "Table",
      category: "resume",
      template: `<ResumeTable>
  <tbody>
    <Tr>
      <TdLabel>항목</TdLabel>
      <TdValue isLast>내용</TdValue>
    </Tr>
    <Tr isLast>
      <TdLabel>항목</TdLabel>
      <TdValue isLast>내용</TdValue>
    </Tr>
  </tbody>
</ResumeTable>

`,
    },
  },

  Tr: {
    component: Tr,
    meta: {
      id: "resume-tr",
      name: "Table Row",
      nameKo: "테이블 행",
      icon: "Rows",
      category: "resume",
      template: `<Tr>
  <TdLabel>항목</TdLabel>
  <TdValue isLast>내용</TdValue>
</Tr>`,
      description: "ResumeTable 내부에서 사용",
    },
  },

  Th: {
    component: Th,
    meta: {
      id: "resume-th",
      name: "Table Header Cell",
      nameKo: "헤더 셀",
      icon: "Table2",
      category: "resume",
      template: `<Th>헤더</Th>`,
      description: "테이블 헤더 셀",
    },
  },

  TdLabel: {
    component: TdLabel,
    meta: {
      id: "resume-td-label",
      name: "Label Cell",
      nameKo: "라벨 셀",
      icon: "Tag",
      category: "resume",
      template: `<TdLabel>라벨</TdLabel>`,
      description: "왼쪽 라벨 셀",
    },
  },

  TdValue: {
    component: TdValue,
    meta: {
      id: "resume-td-value",
      name: "Value Cell",
      nameKo: "값 셀",
      icon: "TextCursor",
      category: "resume",
      template: `<TdValue>값</TdValue>`,
      description: "오른쪽 값 셀",
    },
  },

  TheadRow: {
    component: TheadRow,
    meta: {
      id: "resume-thead-row",
      name: "Header Row",
      nameKo: "헤더 행",
      icon: "Rows",
      category: "resume",
      template: `<TheadRow>
  <Th>기간</Th>
  <Th>회사</Th>
  <Th isLast>직책</Th>
</TheadRow>`,
      description: "테이블 헤더 행",
    },
  },

  ResumeSection: {
    component: ResumeSection,
    meta: {
      id: "resume-section",
      name: "Resume Section",
      nameKo: "이력서 섹션",
      icon: "LayoutList",
      category: "resume",
      template: `<ResumeSection title="섹션 제목">
  내용을 작성하세요.
</ResumeSection>

`,
    },
  },

  ResumeExperienceContentTable: {
    component: ResumeExperienceContentTable,
    meta: {
      id: "resume-experience-content-table",
      name: "Resume Experience Content Table",
      nameKo: "경력 콘텐츠 테이블",
      icon: "Table",
      category: "resume",
      template: `<ResumeExperienceContentTable
  data={[
    {
      company: "회사명",
      role: "역할",
      period: "2023.01 - 현재",
      summary: "간단한 설명",
      achievements: ["주요 성과 1", "주요 성과 2"],
      techStack: ["React", "Next.js"],
    },
  ]}
/>

`,
      description: "ContentTable 기반 경력 섹션",
    },
  },

  ResumeProjectContentTable: {
    component: ResumeProjectContentTable,
    meta: {
      id: "resume-project-content-table",
      name: "Resume Project Content Table",
      nameKo: "프로젝트 콘텐츠 테이블",
      icon: "Table",
      category: "resume",
      template: `<ResumeProjectContentTable
  data={[
    {
      name: "프로젝트명",
      period: "2024.01 - 2024.06",
      role: "프론트엔드 개발",
      context: "개인/회사 프로젝트",
      summary: "간단한 설명",
      achievements: ["성과 1", "성과 2"],
      techStack: ["React", "TypeScript"],
      linkLabel: "링크 텍스트",
      linkUrl: "https://example.com",
    },
  ]}
/>

`,
      description: "ContentTable 기반 프로젝트 섹션",
    },
  },

  ResumeEducationContentTable: {
    component: ResumeEducationContentTable,
    meta: {
      id: "resume-education-content-table",
      name: "Resume Education Content Table",
      nameKo: "학력 콘텐츠 테이블",
      icon: "Table",
      category: "resume",
      template: `<ResumeEducationContentTable
  data={[
    {
      school: "학교/과정명",
      period: "2017.03 - 2021.02",
      major: "전공",
      note: "비고",
    },
  ]}
/>

`,
      description: "ContentTable 기반 학력 섹션",
    },
  },

  // ----------------------------------------
  // 헤더 테이블 (조합 템플릿)
  // ----------------------------------------
  ResumeTableWithHeader: {
    component: ResumeTable, // 같은 컴포넌트, 다른 템플릿
    meta: {
      id: "resume-table-header",
      name: "Table with Header",
      nameKo: "헤더 테이블",
      icon: "Table",
      category: "resume",
      template: `<ResumeTable>
  <thead>
    <TheadRow>
      <Th>기간</Th>
      <Th>회사</Th>
      <Th isLast>직책</Th>
    </TheadRow>
  </thead>
  <tbody>
    <Tr>
      <TdValue>2023.01 - 현재</TdValue>
      <TdValue>회사명</TdValue>
      <TdValue isLast>Frontend Engineer</TdValue>
    </Tr>
    <Tr isLast>
      <TdValue>2021.01 - 2022.12</TdValue>
      <TdValue>이전 회사</TdValue>
      <TdValue isLast>Developer</TdValue>
    </Tr>
  </tbody>
</ResumeTable>

`,
    },
  },

  // ----------------------------------------
  // UI 컴포넌트
  // ----------------------------------------
  Button: {
    component: Button,
    meta: {
      id: "ui-button",
      name: "Button",
      nameKo: "버튼",
      icon: "MousePointer",
      category: "ui",
      template: `<Button variant="default">버튼 텍스트</Button>`,
      description:
        "variant: default, destructive, outline, secondary, ghost, link",
    },
  },

  Badge: {
    component: Badge,
    meta: {
      id: "ui-badge",
      name: "Badge",
      nameKo: "배지",
      icon: "Award",
      category: "ui",
      template: `<Badge variant="default">배지</Badge>`,
      description: "variant: default, secondary, destructive, outline",
    },
  },

  Card: {
    component: Card,
    meta: {
      id: "ui-card",
      name: "Card",
      nameKo: "카드",
      icon: "Square",
      category: "ui",
      template: `<Card>
  <CardHeader>
    <CardTitle>카드 제목</CardTitle>
    <CardDescription>카드 설명</CardDescription>
  </CardHeader>
  <CardContent>
    카드 내용
  </CardContent>
  <CardFooter>
    카드 푸터
  </CardFooter>
</Card>

`,
    },
  },

  CardHeader: {
    component: CardHeader,
    meta: {
      id: "ui-card-header",
      name: "Card Header",
      nameKo: "카드 헤더",
      icon: "LayoutList",
      category: "ui",
      template: `<CardHeader>
  <CardTitle>제목</CardTitle>
  <CardDescription>설명</CardDescription>
</CardHeader>`,
      description: "Card 내부에서 사용",
    },
  },

  CardTitle: {
    component: CardTitle,
    meta: {
      id: "ui-card-title",
      name: "Card Title",
      nameKo: "카드 제목",
      icon: "Type",
      category: "ui",
      template: `<CardTitle>제목</CardTitle>`,
      description: "CardHeader 내부에서 사용",
    },
  },

  CardDescription: {
    component: CardDescription,
    meta: {
      id: "ui-card-description",
      name: "Card Description",
      nameKo: "카드 설명",
      icon: "FileText",
      category: "ui",
      template: `<CardDescription>설명</CardDescription>`,
      description: "CardHeader 내부에서 사용",
    },
  },

  CardContent: {
    component: CardContent,
    meta: {
      id: "ui-card-content",
      name: "Card Content",
      nameKo: "카드 내용",
      icon: "FileText",
      category: "ui",
      template: `<CardContent>내용</CardContent>`,
      description: "Card 내부에서 사용",
    },
  },

  CardFooter: {
    component: CardFooter,
    meta: {
      id: "ui-card-footer",
      name: "Card Footer",
      nameKo: "카드 푸터",
      icon: "LayoutList",
      category: "ui",
      template: `<CardFooter>푸터 내용</CardFooter>`,
      description: "Card 내부에서 사용",
    },
  },

  Avatar: {
    component: Avatar,
    meta: {
      id: "ui-avatar",
      name: "Avatar",
      nameKo: "아바타",
      icon: "User",
      category: "ui",
      template: `<Avatar>
  <AvatarImage src="/avatar.jpg" alt="이름" />
  <AvatarFallback>JL</AvatarFallback>
</Avatar>`,
    },
  },

  AvatarImage: {
    component: AvatarImage,
    meta: {
      id: "ui-avatar-image",
      name: "Avatar Image",
      nameKo: "아바타 이미지",
      icon: "Image",
      category: "ui",
      template: `<AvatarImage src="/avatar.jpg" alt="이름" />`,
      description: "Avatar 내부에서 사용",
    },
  },

  AvatarFallback: {
    component: AvatarFallback,
    meta: {
      id: "ui-avatar-fallback",
      name: "Avatar Fallback",
      nameKo: "아바타 대체",
      icon: "User",
      category: "ui",
      template: `<AvatarFallback>JL</AvatarFallback>`,
      description: "Avatar 내부에서 사용 (이미지 로드 실패 시)",
    },
  },

  SplitText: {
    component: SplitText,
    meta: {
      id: "ui-split-text",
      name: "Split Text",
      nameKo: "분리 텍스트",
      icon: "SplitSquareHorizontal",
      category: "ui",
      template: `<SplitText>애니메이션 텍스트</SplitText>`,
      description: "글자 단위 애니메이션 효과",
    },
  },

  // ----------------------------------------
  // 페이지 나눔 컴포넌트 (PDF용)
  // ----------------------------------------
  PageBreak: {
    component: PageBreak,
    meta: {
      id: "page-break",
      name: "Page Break",
      nameKo: "페이지 나눔",
      icon: "Scissors",
      category: "layout",
      template: `<PageBreak />

`,
      description: "PDF 출력 시 페이지 구분",
    },
  },

  PageBreakBefore: {
    component: PageBreakBefore,
    meta: {
      id: "page-break-before",
      name: "Page Break Before",
      nameKo: "앞에서 페이지 나눔",
      icon: "Scissors",
      category: "layout",
      template: `<PageBreakBefore>
  이 내용은 새 페이지에서 시작됩니다.
</PageBreakBefore>`,
      description: "이 요소 앞에서 페이지 나눔",
    },
  },

  AvoidPageBreak: {
    component: AvoidPageBreak,
    meta: {
      id: "avoid-page-break",
      name: "Avoid Page Break",
      nameKo: "페이지 나눔 방지",
      icon: "Lock",
      category: "layout",
      template: `<AvoidPageBreak>
  이 내용은 페이지가 나뉘지 않습니다.
</AvoidPageBreak>`,
      description: "내용이 페이지 사이에서 잘리지 않도록",
    },
  },

  // ----------------------------------------
  // 디자인 시스템 - Typography
  // ----------------------------------------
  KRDSHeading: {
    component: KRDSHeading,
    meta: {
      id: "ds-krds-heading",
      name: "KRDS Heading",
      nameKo: "KRDS 제목",
      icon: "Heading1",
      category: "ui",
      template: `<KRDSHeading variant="large">제목 텍스트</KRDSHeading>`,
      description: "variant: xlarge, large, medium, small, xsmall, xxsmall",
    },
  },

  KRDSBody: {
    component: KRDSBody,
    meta: {
      id: "ds-krds-body",
      name: "KRDS Body",
      nameKo: "KRDS 본문",
      icon: "Type",
      category: "ui",
      template: `<KRDSBody variant="medium">본문 텍스트</KRDSBody>`,
      description: "variant: large, medium, small, xsmall",
    },
  },

  Title: {
    component: Title,
    meta: {
      id: "ds-title",
      name: "Title",
      nameKo: "타이틀",
      icon: "Heading2",
      category: "ui",
      template: `<Title variant="l-700">타이틀 텍스트</Title>`,
      description: "variant: xxl-700, xl-700, l-700, m-700, s-700, xs-700",
    },
  },

  Body: {
    component: Body,
    meta: {
      id: "ds-body",
      name: "Body",
      nameKo: "본문",
      icon: "Type",
      category: "ui",
      template: `<Body variant="m-400">본문 내용</Body>`,
      description: "variant: l-700, l-500, l-400, m-700, m-400, s-700, s-400",
    },
  },

  // ----------------------------------------
  // 디자인 시스템 - Form Components
  // ----------------------------------------
  Input: {
    component: Input,
    meta: {
      id: "ds-input",
      name: "Input",
      nameKo: "입력 필드",
      icon: "Type",
      category: "ui",
      template: `<Input type="text" placeholder="입력하세요" />`,
      description: "type: text, email, password, number 등",
    },
  },

  Textarea: {
    component: Textarea,
    meta: {
      id: "ds-textarea",
      name: "Textarea",
      nameKo: "텍스트 영역",
      icon: "FileText",
      category: "ui",
      template: `<Textarea placeholder="내용을 입력하세요" rows={4} />`,
    },
  },

  Checkbox: {
    component: Checkbox,
    meta: {
      id: "ds-checkbox",
      name: "Checkbox",
      nameKo: "체크박스",
      icon: "CheckSquare",
      category: "ui",
      template: `<Checkbox id="check1" /> <label htmlFor="check1">체크박스</label>`,
    },
  },

  Chip: {
    component: Chip,
    meta: {
      id: "ds-chip",
      name: "Chip",
      nameKo: "칩",
      icon: "Tag",
      category: "ui",
      template: `<Chip>칩 텍스트</Chip>`,
      description: "태그 또는 라벨용 컴포넌트",
    },
  },

  // ----------------------------------------
  // 디자인 시스템 - Interactive Components
  // ----------------------------------------
  Accordion: {
    component: Accordion,
    meta: {
      id: "ds-accordion",
      name: "Accordion",
      nameKo: "아코디언",
      icon: "ChevronDown",
      category: "ui",
      template: `<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>섹션 1</AccordionTrigger>
    <AccordionContent>
      섹션 1의 내용입니다.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>섹션 2</AccordionTrigger>
    <AccordionContent>
      섹션 2의 내용입니다.
    </AccordionContent>
  </AccordionItem>
</Accordion>

`,
    },
  },

  AccordionItem: {
    component: AccordionItem,
    meta: {
      id: "ds-accordion-item",
      name: "Accordion Item",
      nameKo: "아코디언 아이템",
      icon: "ListTree",
      category: "ui",
      template: `<AccordionItem value="item">
  <AccordionTrigger>제목</AccordionTrigger>
  <AccordionContent>내용</AccordionContent>
</AccordionItem>`,
      description: "Accordion 내부에서 사용",
    },
  },

  AccordionTrigger: {
    component: AccordionTrigger,
    meta: {
      id: "ds-accordion-trigger",
      name: "Accordion Trigger",
      nameKo: "아코디언 트리거",
      icon: "ChevronsUpDown",
      category: "ui",
      template: `<AccordionTrigger>제목</AccordionTrigger>`,
      description: "AccordionItem 내부에서 사용",
    },
  },

  AccordionContent: {
    component: AccordionContent,
    meta: {
      id: "ds-accordion-content",
      name: "Accordion Content",
      nameKo: "아코디언 내용",
      icon: "FileText",
      category: "ui",
      template: `<AccordionContent>내용</AccordionContent>`,
      description: "AccordionItem 내부에서 사용",
    },
  },

  Tabs: {
    component: Tabs,
    meta: {
      id: "ds-tabs",
      name: "Tabs",
      nameKo: "탭",
      icon: "PanelTop",
      category: "ui",
      template: `<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">탭 1</TabsTrigger>
    <TabsTrigger value="tab2">탭 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    탭 1의 내용입니다.
  </TabsContent>
  <TabsContent value="tab2">
    탭 2의 내용입니다.
  </TabsContent>
</Tabs>

`,
    },
  },

  TabsList: {
    component: TabsList,
    meta: {
      id: "ds-tabs-list",
      name: "Tabs List",
      nameKo: "탭 목록",
      icon: "List",
      category: "ui",
      template: `<TabsList>
  <TabsTrigger value="tab1">탭 1</TabsTrigger>
</TabsList>`,
      description: "Tabs 내부에서 사용",
    },
  },

  TabsTrigger: {
    component: TabsTrigger,
    meta: {
      id: "ds-tabs-trigger",
      name: "Tabs Trigger",
      nameKo: "탭 트리거",
      icon: "MousePointer",
      category: "ui",
      template: `<TabsTrigger value="tab1">탭 제목</TabsTrigger>`,
      description: "TabsList 내부에서 사용",
    },
  },

  TabsContent: {
    component: TabsContent,
    meta: {
      id: "ds-tabs-content",
      name: "Tabs Content",
      nameKo: "탭 내용",
      icon: "FileText",
      category: "ui",
      template: `<TabsContent value="tab1">내용</TabsContent>`,
      description: "Tabs 내부에서 사용",
    },
  },

  // Alert: {
  //   component: Alert,
  //   meta: {
  //     id: "ds-alert",
  //     name: "Alert",
  //     nameKo: "알림",
  //     icon: "AlertCircle",
  //     category: "ui",
  //     template: `<Alert>알림 메시지</Alert>`,
  //     description: "사용자에게 정보를 전달하는 알림 컴포넌트",
  //   },
  // },

  Dialog: {
    component: Dialog,
    meta: {
      id: "ds-dialog",
      name: "Dialog",
      nameKo: "다이얼로그",
      icon: "Square",
      category: "ui",
      template: `<Dialog>
  <DialogTrigger asChild>
    <Button>다이얼로그 열기</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>제목</DialogTitle>
      <DialogDescription>설명</DialogDescription>
    </DialogHeader>
    <p>다이얼로그 내용</p>
  </DialogContent>
</Dialog>

`,
    },
  },

  DialogTrigger: {
    component: DialogTrigger,
    meta: {
      id: "ds-dialog-trigger",
      name: "Dialog Trigger",
      nameKo: "다이얼로그 트리거",
      icon: "MousePointer",
      category: "ui",
      template: `<DialogTrigger>열기</DialogTrigger>`,
      description: "Dialog 내부에서 사용",
    },
  },

  DialogContent: {
    component: DialogContent,
    meta: {
      id: "ds-dialog-content",
      name: "Dialog Content",
      nameKo: "다이얼로그 내용",
      icon: "FileText",
      category: "ui",
      template: `<DialogContent>내용</DialogContent>`,
      description: "Dialog 내부에서 사용",
    },
  },

  DialogHeader: {
    component: DialogHeader,
    meta: {
      id: "ds-dialog-header",
      name: "Dialog Header",
      nameKo: "다이얼로그 헤더",
      icon: "LayoutList",
      category: "ui",
      template: `<DialogHeader>
  <DialogTitle>제목</DialogTitle>
  <DialogDescription>설명</DialogDescription>
</DialogHeader>`,
      description: "DialogContent 내부에서 사용",
    },
  },

  DialogTitle: {
    component: DialogTitle,
    meta: {
      id: "ds-dialog-title",
      name: "Dialog Title",
      nameKo: "다이얼로그 제목",
      icon: "Type",
      category: "ui",
      template: `<DialogTitle>제목</DialogTitle>`,
      description: "DialogHeader 내부에서 사용",
    },
  },

  DialogDescription: {
    component: DialogDescription,
    meta: {
      id: "ds-dialog-description",
      name: "Dialog Description",
      nameKo: "다이얼로그 설명",
      icon: "FileText",
      category: "ui",
      template: `<DialogDescription>설명</DialogDescription>`,
      description: "DialogHeader 내부에서 사용",
    },
  },

  // ----------------------------------------
  // 디자인 시스템 - Table Components
  // ----------------------------------------
  DataTable: {
    component: DataTable,
    meta: {
      id: "ds-data-table",
      name: "Data Table",
      nameKo: "데이터 테이블",
      icon: "Table",
      category: "ui",
      template: `<DataTable
  columns={[
    {
      accessorKey: "name",
      header: "이름",
    },
    {
      accessorKey: "role",
      header: "역할",
    },
  ]}
  data={[
    { name: "홍길동", role: "개발자" },
    { name: "김철수", role: "디자이너" },
  ]}
/>

`,
      description: "정렬, 필터링, 페이지네이션 기능이 있는 고급 데이터 테이블",
    },
  },

  ContentTable: {
    component: ContentTable,
    meta: {
      id: "ds-content-table",
      name: "Content Table",
      nameKo: "콘텐츠 테이블",
      icon: "Table",
      category: "ui",
      template: `<ContentTable
  columns={[
    {
      key: "label",
      header: "항목",
      width: "w-1/3",
      align: "left",
    },
    {
      key: "value",
      header: "내용",
      width: "w-2/3",
      align: "left",
    },
  ]}
  data={[
    { label: "이름", value: "홍길동" },
    { label: "이메일", value: "hong@example.com" },
    { label: "전화번호", value: "010-1234-5678" },
  ]}
/>

`,
      description: "간단한 콘텐츠 표시용 테이블 (정렬/필터링 없음)",
    },
  },
};

// ============================================
// 유틸리티 함수
// ============================================

/**
 * MDX 렌더링에 사용할 컴포넌트 객체
 * { ResumeTable, Tr, Button, ... }
 */
export const mdxCustomComponents = Object.fromEntries(
  Object.entries(MDX_COMPONENT_REGISTRY).map(([key, { component }]) => [
    key,
    component,
  ])
) as Record<string, ComponentType<{ children?: ReactNode }>>;

/**
 * 에디터 블록으로 표시할 컴포넌트 메타데이터
 * 중복 제거 (ResumeTableWithHeader 같은 템플릿 변형 포함)
 */
export function getComponentBlocks(): ComponentMeta[] {
  // 에디터에서 주로 사용할 컴포넌트만 필터링
  const primaryComponents = [
    // Resume 컴포넌트
    "ResumeTable",
    "ResumeTableWithHeader",
    "ResumeSection",
    "ResumeExperienceContentTable",
    "ResumeProjectContentTable",
    "ResumeEducationContentTable",
    // 기존 UI 컴포넌트
    "Button",
    "Badge",
    "Card",
    "Avatar",
    "SplitText",
    // 디자인 시스템 - Typography
    "KRDSHeading",
    "KRDSBody",
    "Title",
    "Body",
    // 디자인 시스템 - Form
    "Input",
    "Textarea",
    "Checkbox",
    "Chip",
    // 디자인 시스템 - Interactive
    "Accordion",
    "Tabs",
    "Alert",
    "Dialog",
    // 디자인 시스템 - Table
    "DataTable",
    "ContentTable",
    // Layout
    "PageBreak",
    "AvoidPageBreak",
  ];

  return primaryComponents
    .filter((key) => MDX_COMPONENT_REGISTRY[key])
    .map((key) => MDX_COMPONENT_REGISTRY[key].meta);
}

/**
 * 카테고리별 컴포넌트 그룹화
 */
export function getComponentsByCategory(): Record<
  ComponentCategory,
  ComponentMeta[]
> {
  const blocks = getComponentBlocks();

  return {
    resume: blocks.filter((b) => b.category === "resume"),
    ui: blocks.filter((b) => b.category === "ui"),
    layout: blocks.filter((b) => b.category === "layout"),
  };
}

/**
 * 모든 컴포넌트 메타데이터 (하위 컴포넌트 포함)
 */
export function getAllComponentMetas(): ComponentMeta[] {
  return Object.values(MDX_COMPONENT_REGISTRY).map((def) => def.meta);
}

// ============================================
// 카테고리 메타데이터
// ============================================

export const COMPONENT_CATEGORIES = {
  resume: { name: "Resume", nameKo: "이력서" },
  ui: { name: "UI Components", nameKo: "UI 컴포넌트" },
  layout: { name: "Layout", nameKo: "레이아웃" },
} as const;
