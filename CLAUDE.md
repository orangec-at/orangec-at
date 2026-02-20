# OrangeC-AT Project Instructions

> **NOTE**: 이 프로젝트는 `~/src/working/` (lifeOS) 하위에서 관리됩니다.
> 작업 현황은 `../dev/active/CURRENT-WORK.md`를 참조하세요.

---

## Data Safety & Protection (MANDATORY)

> **WARNING**: 에이전트는 프로젝트의 데이터 무결성을 보호해야 합니다.

1. **파일 삭제 금지 및 백업 의무**
   - 어떠한 상황에서도 사용자의 명시적 승인 없이 `rm`, `mv` 등으로 파일을 영구적으로 삭제하거나 유실하지 않습니다.
   - 대량의 구조 변경이 필요한 경우 반드시 `.bak` 또는 `.backup` 폴더를 생성하여 백업을 먼저 수행합니다.

2. **환경 설정 및 시스템 폴더 보호**
   - `.claude`, `.agent`, `.git`, `.env` 등 설정 관련 숨김 폴더를 함부로 수정하거나 이동하지 않습니다.

3. **파괴적 작업의 명시적 승인**
   - 파일 이동, 디렉토리 통합, 버전 마이그레이션 등 파괴적일 수 있는 작업은 변경 목록을 명확히 제시하고 사용자의 확답을 받은 후 진행합니다.

---

## Project Structure

```
orangec-at/
├── apps/
│   ├── blog/              # Next.js 15 포트폴리오/블로그
│   ├── mdx-editor/        # MDX 에디터
│   └── mdx-editor-extension/  # VS Code 확장
├── packages/
│   └── design/            # 공유 디자인 시스템
├── services/
│   └── rag-service/       # RAG 서비스 (Python)
└── .claude/               # 프로젝트 특화 설정
    ├── skills/            # 프로젝트별 가이드라인
    ├── hooks/             # 자동화 훅
    └── commands/          # 슬래시 커맨드
```

**상위 폴더 (lifeOS)**:
- `../dev/active/CURRENT-WORK.md` - 작업 현황
- `../vault/` - 지식베이스

---

## Tech Stack Reference

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI | Radix UI, Framer Motion |
| Auth | NextAuth v5 |
| DB | Supabase Postgres + Prisma |
| i18n | next-intl |

---

## Coding Guidelines

### 필수 규칙
- TypeScript strict mode 준수
- `as any`, `@ts-ignore` 금지
- Server Components 우선, 필요시에만 `"use client"`
- Tailwind CSS 사용, inline style 지양

### 파일 구조
- 컴포넌트: `src/components/[domain]/[component-name].tsx`
- 페이지: `src/app/[locale]/[route]/page.tsx`
- Server Actions: `src/actions/[domain].ts`

---

## Quick Commands

```bash
# 개발 서버 (전체)
pnpm dev

# 블로그만 실행 (아래 둘 다 동일)
pnpm blog dev
pnpm --filter blog dev
# → apps/blog 디렉토리에서 next dev --turbopack --port 7071 실행
# → http://localhost:7071

# 빌드
pnpm build

# 타입 체크
pnpm typecheck
```

### Dev Server 주의사항

- **반드시 `pnpm blog dev`로 실행**. `cd apps/blog && npx next dev`나 monorepo 루트에서 `npx next dev apps/blog`로 직접 실행하면 `process.cwd()`가 monorepo 루트를 반환해서 `src/posts/` 경로를 못 찾음
- 블로그 포트: **7071** (고정)
- Playwright 등으로 확인 시 URL: `http://localhost:7071/en/blog/{slug}`

---

## Blog Post Types

블로그는 **MDX**와 **TSX** 두 가지 포스트 형식을 지원합니다.

### MDX 포스트 (기본)
- 위치: `apps/blog/src/posts/{locale}/{slug}.mdx`
- frontmatter로 메타데이터 선언
- `BlogDetailClient` 컴포넌트로 렌더링

### TSX 커스텀 레이아웃 포스트
- 위치: `apps/blog/src/posts/{locale}/{slug}.tsx`
- `export const meta: MDXFrontmatter` 로 메타데이터 선언
- `export const layout = "custom" as const`
- `export default function` 으로 전체 페이지를 직접 렌더링
- `"use client"` 사용 가능 (인터랙티브 요소)
- Lab 연구일지 등 커스텀 UI가 필요한 포스트에 사용

### 메타데이터 추출 방식 (`blog-utils.server.ts`)
- `.mdx`: `gray-matter`로 frontmatter 파싱
- `.tsx`: 정규식으로 `export const meta = { ... }` 추출 후 JSON 파싱
- `getPostType(slug, locale)` 로 포스트 타입 확인 가능

---

## Related Documentation

- `.claude/README.md` - Claude Code Infrastructure 가이드
- `.claude/skills/` - 프로젝트별 Skills
- `apps/blog/DESIGN-SYSTEM.md` - 디자인 시스템
