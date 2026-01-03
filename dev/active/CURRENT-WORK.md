# Current Work State

> **IMPORTANT**: 모든 에이전트는 세션 시작 시 이 파일을 반드시 읽어야 합니다.
> 작업 완료/중단 시 이 파일을 업데이트해야 합니다.

**Last Updated**: 2026-01-03 21:10 KST  
**Updated By**: opencode (task-update session)

---

## Active Task

**블로그 디자인 리뉴얼 & 데이터 연동**

knowledge-shelf-blog 기능을 apps/blog로 마이그레이션하고, mock 데이터를 실제 데이터로 교체하는 작업

---

## Overall Progress

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 - Infrastructure | ✅ 완료 | Docker, NextAuth v5, Prisma schema, API routes |
| Phase 2 - Design | ✅ 완료 | Tailwind theme, 컴포넌트 포팅, Layout 통합 |
| Phase 3A - Shop System | ✅ 완료 | UI + Server Actions + 구매 트랜잭션 |
| Phase 3B - Admin Dashboard | ✅ 완료 | UI + 권한보호 + 실제 데이터 연동 |
| Phase 3C - RAG Chatbot | 🔄 부분완료 | keyword marginalia만 구현, vector retrieval 미연동 |
| Phase 4 - Mock → Real Data | 🔄 진행중 | Home, Blog, Projects 페이지 실제 데이터 연동 |
| MDX Editor Extension | 🔄 진행중 | v0.1 Core (Completion, Preview, Registry) 구현 완료 (40%) |

---

## Current Focus (Phase 4)

### In Progress
- [ ] Home 페이지 featured-projects mock → 실제 프로젝트 데이터
- [ ] Blog 목록 mock → MDX 콘텐츠 연동
- [ ] Projects 페이지 mock → 실제 데이터

### Pending
- [ ] RAG Chatbot vector context injection (`/api/chat`)
- [ ] DB 마이그레이션 실행 확인 (`prisma migrate dev`)
- [ ] 전체 빌드 테스트

---

## Key Files & Decisions

### 핵심 파일
```
apps/blog/
├── src/actions/shop.ts          # Shop Server Actions (완료)
├── src/actions/admin.ts         # Admin Server Actions (완료)
├── src/app/[locale]/shop/       # Shop 페이지 (완료)
├── src/app/[locale]/dashboard/  # Dashboard 페이지 (완료)
├── src/app/api/chat/route.ts    # RAG Chatbot (부분완료)
├── src/data/projects.ts         # 프로젝트 데이터 (mock → real 필요)
├── src/components/home/         # Home 컴포넌트들 (mock 데이터 사용 중)
└── prisma/schema.prisma         # DB 스키마 (정의됨)
```

### 기술 결정사항
- **DB**: Supabase Postgres (Prisma 연동)
- **Auth**: NextAuth v5 (Supabase Auth 아님, 유지)
- **State**: URL params + React Context (Redux 사용 안함)
- **Icons**: lucide-react
- **Animation**: framer-motion

---

## Blockers / Notes

1. **Supabase Free Plan 사용 중** - Postgres만 활용, Auth는 NextAuth v5 유지
2. **RAG Service** - `services/rag-service/` 에 별도 존재, `/api/chat`에 연동 필요
3. **Vercel 배포** - 현재 배포 상태 확인 필요

---

## Session Handoff Checklist

다음 세션 시작 시:
1. [ ] 이 파일 (`dev/active/CURRENT-WORK.md`) 읽기
2. [ ] `vault/projects/current-wip.md` 확인 (WIP 항목)
3. [ ] `git status`로 uncommitted 변경사항 확인
4. [ ] 위 "Current Focus" 섹션의 진행 중 항목 이어서 작업

---

## Reference Documents

- `/Users/jaylee222/.gemini/antigravity/brain/c1638333-8efe-4207-8ea5-789d4fcfcb5c/handoff_instructions.md.resolved` - 원본 마이그레이션 계획
- `apps/blog/DESIGN-SYSTEM.md` - 디자인 시스템 가이드
- `apps/blog/README.md` - 블로그 프로젝트 개요
