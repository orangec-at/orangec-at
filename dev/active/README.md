# Dev Docs System

이 디렉토리는 **활성 개발 작업**의 컨텍스트를 유지하는 Dev Docs 시스템입니다.

## 목적

Claude Code의 context 리셋 후에도 작업 연속성을 유지하기 위해 3개의 문서를 자동 생성합니다:

1. **`[task-name]-plan.md`** - 전략적 계획 및 승인된 접근 방식
2. **`[task-name]-context.md`** - 핵심 파일, 결정사항, 아키텍처 정보
3. **`[task-name]-tasks.md`** - 작업 체크리스트 및 진행 상황

## 사용 방법

### 1. 새 작업 시작

```
/dev-docs [작업명]
```

예시:
```
/dev-docs auth-system
/dev-docs blog-redesign
/dev-docs performance-optimization
```

이 명령은 3개의 문서를 자동 생성합니다:
- `auth-system-plan.md`
- `auth-system-context.md`
- `auth-system-tasks.md`

### 2. 작업 진행 중

작업을 진행하면서 Claude가 자동으로 문서를 업데이트합니다:
- 새로운 결정사항 → `context.md` 업데이트
- 작업 완료 → `tasks.md` 체크리스트 업데이트
- 계획 변경 → `plan.md` 수정

### 3. Context 리셋 후 복구

Claude Code의 context가 리셋되었을 때:

```
/continue [작업명]
```

예시:
```
/continue auth-system
```

Claude가 해당 작업의 3개 문서를 읽고 작업을 이어갑니다.

### 4. 작업 업데이트

진행 상황을 수동으로 업데이트하려면:

```
/dev-docs-update [작업명]
```

## 파일 구조 예시

```
dev/active/
├── README.md (이 파일)
├── auth-system-plan.md
├── auth-system-context.md
├── auth-system-tasks.md
├── blog-redesign-plan.md
├── blog-redesign-context.md
└── blog-redesign-tasks.md
```

## 각 문서의 역할

### `[task]-plan.md`
- 전략적 목표 및 접근 방식
- 기술적 결정사항 및 이유
- 아키텍처 개요
- 위험 요소 및 제약사항

**예시:**
```markdown
# Auth System Implementation Plan

## Goal
Implement JWT-based authentication system

## Approach
- Use Next.js middleware for auth checking
- Store tokens in httpOnly cookies
- Implement refresh token rotation

## Technical Decisions
- Library: next-auth v5
- Session strategy: JWT
- Database: Existing PostgreSQL
```

### `[task]-context.md`
- 핵심 파일 경로 및 역할
- 중요한 코드 스니펫
- API 엔드포인트
- 데이터베이스 스키마 변경사항

**예시:**
```markdown
# Auth System Context

## Key Files
- `app/middleware.ts` - Auth middleware
- `app/api/auth/[...nextauth]/route.ts` - NextAuth config
- `lib/auth.ts` - Auth utilities

## Important Decisions
- Decision: Use middleware instead of getServerSideProps
- Reason: Better performance, edge runtime support

## Database Schema
- Added `users` table with email, passwordHash
- Added `sessions` table for refresh tokens
```

### `[task]-tasks.md`
- 구체적인 작업 항목
- 진행 상황 (완료/진행중/대기)
- 다음 단계

**예시:**
```markdown
# Auth System Tasks

## Completed
- [x] Design database schema
- [x] Set up NextAuth configuration
- [x] Create login page

## In Progress
- [ ] Implement password reset flow
- [ ] Add email verification

## Pending
- [ ] Write integration tests
- [ ] Add rate limiting
- [ ] Documentation
```

## 베스트 프랙티스

1. **작업 이름은 간결하게**: `auth-system`, `blog-redesign` (kebab-case)
2. **정기적으로 업데이트**: 큰 변경사항이 있을 때마다 `/dev-docs-update` 실행
3. **작업 완료 후 정리**: 완료된 작업의 문서는 `dev/archive/`로 이동
4. **하나의 큰 작업은 여러 개로 분할**: 작업이 너무 크면 여러 개의 dev docs로 나누기

## Slash Commands

이 시스템은 다음 slash commands와 함께 작동합니다:

- `/dev-docs [작업명]` - 새 작업 문서 생성
- `/dev-docs-update [작업명]` - 진행 상황 업데이트
- `/continue [작업명]` - Context 리셋 후 작업 복구

## 주의사항

- Dev docs는 **활성 작업**만 유지 (완료된 작업은 archive로 이동)
- 너무 많은 작업을 동시에 진행하지 말 것 (권장: 3개 이하)
- 문서가 너무 길어지면 작업을 더 작은 단위로 분할

## Archive

완료된 작업의 문서는 `dev/archive/` 디렉토리로 이동:

```bash
mkdir -p dev/archive
mv dev/active/auth-system-* dev/archive/
```

이렇게 하면 `dev/active/`는 항상 현재 진행 중인 작업만 포함하게 됩니다.
