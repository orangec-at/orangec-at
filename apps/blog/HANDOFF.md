# Blog Handoff / 진행상황 (orangec-at/apps/blog)

이 문서는 다른 에이전트(또는 다른 세션)가 토큰/컨텍스트 없이도 현재 상태를 이어서 작업할 수 있도록 만든 핸드오프 노트입니다.

## 0) TL;DR
- 블로그는 Next.js App Router 기반으로 **Auth(NextAuth) + Onboarding + Newsletter(Opt-in) + Admin DM Inbox + RAG Search**까지 연결된 상태입니다.
- `/dashboard/*`는 이제 **ADMIN만 접근 가능**하도록 미들웨어에서 강제합니다.
- `pnpm --filter blog run build` 기준으로 **ESLint 경고 없이 빌드 성공**합니다.

## 1) 최근 작업 요약
### 1.1 Admin 권한 하드닝
- `/dashboard` 라우트는 **ADMIN만 접근 가능**
  - 비로그인: `/api/auth/signin` 리다이렉트
  - 로그인했지만 ADMIN 아님: `/{locale}/profile` 리다이렉트
- 파일: `apps/blog/src/middleware.ts`

### 1.2 Newsletter 상태 반환/UX 안정화
- `subscribeNewsletter`/`unsubscribeNewsletter`가 성공 시 `status: "ACTIVE" | "PENDING" | "UNSUBSCRIBED"`를 반환하도록 변경
- UI에서 문자열 메시지 파싱으로 PENDING 추정하던 로직 제거
- 파일:
  - `apps/blog/src/actions/newsletter.ts`
  - `apps/blog/src/app/[locale]/profile/client.tsx`
  - `apps/blog/src/components/knowledge-shelf/components/Footer.tsx`

### 1.3 빌드 ESLint 경고 제거
- unused import/변수, hook deps 누락, `<img>` 규칙 등 경고 정리
- 관련 파일들이 여러 개 포함(두 번째 커밋 참고)

## 2) 핵심 기능 체크리스트
- [x] NextAuth v5 설정 + SessionProvider 적용
- [x] Session 확장: `user.id`, `user.role`, `user.inkPoints`, `user.onboardingCompleted`
- [x] Onboarding(첫 로그인 시 약관/뉴스레터 설정) + middleware gating
- [x] Newsletter 구독 (동일 이메일은 즉시 ACTIVE / 그 외는 이메일 더블 옵트인)
- [x] Admin DM(Inbox): 내부 Thread/Message 저장, dashboard에서 확인
- [x] RAG Search: rag-service `/api/search` + blog `/api/search` 프록시 + SearchModal 연동
- [x] Legal 페이지(terms/privacy) + footer/header 링크

## 3) 주요 파일 맵
### Auth / Session
- `apps/blog/src/auth.ts`
- `apps/blog/src/types/next-auth.d.ts`

### Middleware
- `apps/blog/src/middleware.ts`
  - onboarding gating
  - dashboard(ADMIN only) gating

### Onboarding
- `apps/blog/src/app/[locale]/onboarding/page.tsx`
- `apps/blog/src/app/[locale]/onboarding/client.tsx`
- `apps/blog/src/actions/onboarding.ts`

### Newsletter
- `apps/blog/src/actions/newsletter.ts`
- `apps/blog/src/app/[locale]/newsletter/confirm/page.tsx`
- `apps/blog/src/app/[locale]/newsletter/unsubscribe/page.tsx`
- `apps/blog/src/app/[locale]/dashboard/subscribers/page.tsx`

### Admin DM
- `apps/blog/src/actions/admin-dm.ts`
- `apps/blog/src/app/[locale]/dashboard/dm/page.tsx`

### RAG Search
- `apps/blog/src/app/api/search/route.ts` (Next.js proxy)
- `apps/blog/src/components/knowledge-shelf/components/SearchModal.tsx`

### RAG Service (services/rag-service)
- `services/rag-service/app/api/search.py`
- `services/rag-service/app/main.py`
- `services/rag-service/app/models/schemas.py`
- `services/rag-service/app/services/vector_store.py`
- `services/rag-service/scripts/generate_embeddings.py`

## 4) 실행/검증 커맨드
- typecheck: `pnpm --filter blog run typecheck`
- build: `pnpm --filter blog run build`

Note: Next가 `tsconfig.json`을 자동 수정하는 경우가 있어서, typecheck는 `apps/blog/tsconfig.typecheck.json`을 사용하도록 스크립트를 고정해둔 상태입니다.

Prisma 타입이 에디터에서 어긋나 보이면(예: `prisma.newsletterSubscription`이 없다는 에러), 보통 로컬에서 `prisma generate`가 덜 된 케이스입니다.
- 권장: `pnpm --filter blog exec prisma generate` (또는 프로젝트 스크립트에 맞는 generate 커맨드)

## 5) 환경변수(요약)
- DB: `DATABASE_URL`, `DIRECT_URL`
- Auth: `AUTH_SECRET`, `AUTH_URL`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`
- Resend(옵션): `RESEND_API_KEY`, `AUTH_EMAIL_FROM`, `NEWSLETTER_FROM`
- RAG: `RAG_SERVICE_URL` (예: `http://localhost:7073/api/chat`), (검색은 blog 내부 `/api/search`를 호출)
- Stripe(옵션): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

## 6) 운영/권한 주의사항
- `ADMIN` role 부여 방법이 별도 UI로 제공되지 않는 상태면 운영자가 DB에서 설정해야 합니다.
- `/dashboard/*`는 middleware에서 ADMIN만 허용되므로, role 설정이 잘못되면 접근이 차단됩니다.

## 7) Git / 작업트리 상태(중요)
### Submodule: `vault`
- `vault`는 `.gitmodules`에 등록된 git submodule입니다.
- 정석:
  1) `vault/` 안에서 커밋/푸시
  2) 부모 repo에서 `git add vault` 후 포인터 업데이트 커밋
- 현재 `git status`에 `M vault`가 보이면: 보통은 **vault 내부 워킹트리가 dirty**인 상황입니다(부모 포인터 변경이 아님).

### Cache: `.claude/tsc-cache/*`
- cache는 ignore 대상이 맞습니다.
- 단, 현재 repo에 `.claude/tsc-cache/.../affected-repos.txt`, `edited-files.log`가 이미 tracked로 올라가 있어서 ignore만으로는 사라지지 않습니다.
- 권장 정리 커맨드(원하면 후속 작업에서 수행):
  - `git rm --cached .claude/tsc-cache/**/affected-repos.txt .claude/tsc-cache/**/edited-files.log`
  - 그리고 `.gitignore`에 `.claude/tsc-cache/` 추가(이미 로컬에서 추가된 상태일 수 있음)

### dev/active/TODO.md
- 자동 생성 파일로 보이며, 팀 컨벤션에 따라 커밋하지 않는 편이 안전합니다.

## 8) 최근 커밋(핵심)
- `549010f` fix(blog): restrict dashboard to admins
- `118fd74` feat(blog): return newsletter subscription status
- 이전 기반 커밋들: onboarding/newsletter/rag 등은 직전 히스토리에 존재
