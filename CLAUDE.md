# OrangeC-AT Project Instructions

## Session Continuity Protocol (MANDATORY)

> **CRITICAL**: 모든 에이전트/세션은 아래 규칙을 반드시 준수해야 합니다.

### 세션 시작 시 (MUST DO)

1. **CURRENT-WORK.md 읽기** (필수)
   ```
   Read: dev/active/CURRENT-WORK.md
   ```
   - 현재 진행 중인 작업 파악
   - 이전 세션에서 중단된 지점 확인
   - Blockers/Notes 확인

2. **Git 상태 확인** (권장)
   ```bash
   git status
   git diff --stat HEAD~1
   ```

3. **WIP 확인** (선택)
   ```
   Read: vault/projects/current-wip.md
   ```

### 작업 중

- 중요한 결정사항 → CURRENT-WORK.md의 "Key Files & Decisions" 업데이트
- 새로운 blocker 발견 → "Blockers / Notes" 섹션 추가

### 세션 종료/중단 시 (MUST DO)

1. **CURRENT-WORK.md 업데이트**
   - `Last Updated` 타임스탬프 갱신
   - `Updated By` 세션 정보 기록
   - 완료된 항목 체크 `[x]`
   - 진행 중인 항목 상태 업데이트
   - 다음 세션을 위한 노트 추가

2. **Commit 전 확인**
   - 작업 완료 시에만 commit 요청
   - 중간 상태로 commit하지 않음

---

## Data Safety & Protection (MANDATORY)

> **WARNING**: 에이전트는 프로젝트의 데이터 무결성을 보호해야 합니다.

1. **파일 삭제 금지 및 백업 의무**
   - 어떠한 상황에서도 사용자의 명시적 승인 없이 `rm`, `mv` 등으로 파일을 영구적으로 삭제하거나 유실하지 않습니다.
   - 대량의 구조 변경이 필요한 경우 반드시 `.bak` 또는 `.backup` 폴더를 생성하여 백업을 먼저 수행합니다.
   - Git에 추적되지 않는(untracked) 로컬 파일이 있을 수 있음을 항상 전제합니다.

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
├── vault/                 # 개인 노트 (gitignored)
├── dev/active/            # 활성 작업 문서
│   └── CURRENT-WORK.md    # 현재 작업 상태 (핵심!)
└── .claude/               # Claude Code 설정
    ├── skills/            # 프로젝트별 가이드라인
    ├── hooks/             # 자동화 훅
    └── commands/          # 슬래시 커맨드
```

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
# 개발 서버
pnpm dev

# 블로그만 실행
pnpm --filter blog dev

# 빌드
pnpm build

# 타입 체크
pnpm typecheck
```

---

## Related Documentation

- `.claude/README.md` - Claude Code Infrastructure 가이드
- `.claude/skills/` - 프로젝트별 Skills
- `apps/blog/DESIGN-SYSTEM.md` - 디자인 시스템
- `dev/active/CURRENT-WORK.md` - **현재 작업 상태**
