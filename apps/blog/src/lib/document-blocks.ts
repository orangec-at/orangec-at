// 문서 에디터에서 사용할 수 있는 블록 정의
import {
  getComponentBlocks,
  COMPONENT_CATEGORIES,
  type ComponentMeta,
} from "./mdx-registry";

export type BlockCategory =
  | "heading"
  | "content"
  | "list"
  | "section"
  | "component"
  | "special";

export interface DocumentBlock {
  id: string;
  name: string;
  nameKo: string;
  icon: string;
  category: BlockCategory;
  template: string;
  description?: string;
}

export const DOCUMENT_BLOCKS: DocumentBlock[] = [
  // Headings
  {
    id: "h1",
    name: "Heading 1",
    nameKo: "제목 1",
    icon: "Heading1",
    category: "heading",
    template: "## 제목을 입력하세요\n\n",
  },
  {
    id: "h2",
    name: "Heading 2",
    nameKo: "제목 2",
    icon: "Heading2",
    category: "heading",
    template: "### 소제목을 입력하세요\n\n",
  },
  {
    id: "h3",
    name: "Heading 3",
    nameKo: "제목 3",
    icon: "Heading3",
    category: "heading",
    template: "#### 작은 제목\n\n",
  },

  // Content
  {
    id: "paragraph",
    name: "Paragraph",
    nameKo: "문단",
    icon: "Type",
    category: "content",
    template: "내용을 입력하세요.\n\n",
  },
  {
    id: "bold-text",
    name: "Bold Text",
    nameKo: "강조 텍스트",
    icon: "Bold",
    category: "content",
    template: "**강조할 내용**",
  },
  {
    id: "blockquote",
    name: "Quote",
    nameKo: "인용문",
    icon: "Quote",
    category: "content",
    template: "> 인용문을 입력하세요\n\n",
  },

  // Lists
  {
    id: "bullet-list",
    name: "Bullet List",
    nameKo: "글머리 목록",
    icon: "List",
    category: "list",
    template: "- 항목 1\n- 항목 2\n- 항목 3\n\n",
  },
  {
    id: "numbered-list",
    name: "Numbered List",
    nameKo: "번호 목록",
    icon: "ListOrdered",
    category: "list",
    template: "1. 첫 번째\n2. 두 번째\n3. 세 번째\n\n",
  },

  // Resume Sections
  {
    id: "divider",
    name: "Divider",
    nameKo: "구분선",
    icon: "Minus",
    category: "section",
    template: "---\n\n",
  },
  {
    id: "info-section",
    name: "Info Section",
    nameKo: "기본 정보",
    icon: "User",
    category: "section",
    template: `## 기본 정보

- **이름**: 
- **이메일**: 
- **전화번호**: 
- **GitHub**: 
- **LinkedIn**: 

---

`,
  },
  {
    id: "career-section",
    name: "Career",
    nameKo: "경력 사항",
    icon: "Briefcase",
    category: "section",
    template: `## 경력

### 회사명 | 직책
**기간**: 2023.01 - 현재

- 주요 업무 및 성과 1
- 주요 업무 및 성과 2
- 사용 기술: React, TypeScript

`,
  },
  {
    id: "project-section",
    name: "Project",
    nameKo: "프로젝트",
    icon: "FolderKanban",
    category: "section",
    template: `### 프로젝트명
**기간**: 2023.06 - 2023.12 | **역할**: Frontend Lead

프로젝트 설명을 작성합니다.

**주요 성과**:
- 성과 1
- 성과 2

**기술 스택**: React, TypeScript, Next.js

`,
  },
  {
    id: "education-section",
    name: "Education",
    nameKo: "학력",
    icon: "GraduationCap",
    category: "section",
    template: `## 학력

### 대학교명 | 전공
**기간**: 2017.03 - 2021.02

`,
  },
  {
    id: "skills-section",
    name: "Skills",
    nameKo: "기술 스택",
    icon: "Code",
    category: "section",
    template: `## 기술 스택

### Frontend
- React, Next.js, TypeScript
- Tailwind CSS, Styled Components

### Backend
- Node.js, Express
- PostgreSQL, MongoDB

### DevOps
- Docker, AWS, Vercel

`,
  },

  // Components - 레지스트리에서 동적으로 가져옴 (getBlocksByCategory 참조)

  // Special
  {
    id: "table",
    name: "Markdown Table",
    nameKo: "마크다운 테이블",
    icon: "Table",
    category: "special",
    template: `| 항목 | 내용 |
|------|------|
| 항목1 | 내용1 |
| 항목2 | 내용2 |

`,
  },
  {
    id: "star-method",
    name: "STAR Method",
    nameKo: "STAR 기법",
    icon: "Star",
    category: "special",
    description: "상황-과제-행동-결과 구조",
    template: `### 경험 제목

**상황 (Situation)**: 어떤 상황이었는지

**과제 (Task)**: 무엇을 해야 했는지

**행동 (Action)**: 어떤 행동을 취했는지

**결과 (Result)**: 어떤 결과를 얻었는지

`,
  },
  {
    id: "motivation",
    name: "Motivation",
    nameKo: "지원 동기",
    icon: "Heart",
    category: "special",
    template: `## 지원 동기

왜 이 회사/포지션에 지원하게 되었는지 작성합니다.

- 회사의 비전에 공감하는 이유
- 해당 포지션에 관심을 갖게 된 계기
- 기여하고 싶은 부분

`,
  },
];

// 카테고리별 블록 그룹화
export const BLOCK_CATEGORIES = {
  heading: { name: "Headings", nameKo: "제목" },
  content: { name: "Content", nameKo: "콘텐츠" },
  list: { name: "Lists", nameKo: "목록" },
  section: { name: "Sections", nameKo: "섹션" },
  component: { name: "Components", nameKo: "컴포넌트" },
  special: { name: "Special", nameKo: "특수" },
} as const;

/**
 * 레지스트리의 컴포넌트를 DocumentBlock으로 변환
 */
function componentMetaToBlock(meta: ComponentMeta): DocumentBlock {
  return {
    id: meta.id,
    name: meta.name,
    nameKo: meta.nameKo,
    icon: meta.icon,
    category: "component",
    template: meta.template,
    description: meta.description,
  };
}

/**
 * 모든 블록 가져오기 (마크다운 블록 + 레지스트리 컴포넌트)
 */
export function getAllBlocks(): DocumentBlock[] {
  const componentBlocks = getComponentBlocks().map(componentMetaToBlock);
  return [...DOCUMENT_BLOCKS, ...componentBlocks];
}

/**
 * 카테고리별 블록 그룹화 (레지스트리 컴포넌트 포함)
 */
export function getBlocksByCategory(): Record<BlockCategory, DocumentBlock[]> {
  const allBlocks = getAllBlocks();
  const grouped: Record<string, DocumentBlock[]> = {};

  for (const block of allBlocks) {
    if (!grouped[block.category]) {
      grouped[block.category] = [];
    }
    grouped[block.category].push(block);
  }

  return grouped as Record<BlockCategory, DocumentBlock[]>;
}

// Re-export for convenience
export { COMPONENT_CATEGORIES };
