# Authentication Strategy

> 마지막 업데이트: 2026-01-09

## 현재 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                        사용자 (브라우저)                          │
│                              │                                   │
│                         [세션 쿠키]                               │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Next.js (Vercel)                        │  │
│  │                                                            │  │
│  │   NextAuth v5 + PrismaAdapter                              │  │
│  │   - Google OAuth                                           │  │
│  │   - Email (Resend)                                         │  │
│  │   - 세션 쿠키 기반 인증                                      │  │
│  │                                                            │  │
│  │   /api/auth/* ← 유일하게 남은 API Route                     │  │
│  │                                                            │  │
│  └───────────────────────────┬───────────────────────────────┘  │
│                              │                                   │
│                     [x-internal-api-key]                         │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Rust API (OCI)                          │  │
│  │                                                            │  │
│  │   Internal API Key 검증                                     │  │
│  │   - verify_internal_api_key()                              │  │
│  │   - 서버 간 통신에만 사용                                    │  │
│  │                                                            │  │
│  │   (Supabase JWT 검증 - 구현됨, 미사용)                       │  │
│  │   - verify_supabase_jwt() ← 추후 확장용                     │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 왜 이런 구조인가?

### 배경
1. 원래 Next.js가 풀스택으로 모든 것을 처리
2. Vercel 서버리스 cold start 성능 이슈 발생
3. 무거운 DB 작업만 Rust API로 분리
4. NextAuth는 가볍고 잘 동작하므로 유지

### 결과
- **Prisma**: Next.js에서 스키마 관리 (NextAuth가 필요)
- **Diesel**: Rust에서 동일 테이블 읽기/쓰기 (마이그레이션 X)
- **인증 흐름**: NextAuth → Internal Key → Rust API

## 두 ORM의 역할

| ORM | 위치 | 역할 | 마이그레이션 |
|-----|------|------|-------------|
| Prisma | apps/blog | NextAuth adapter, 스키마 정의 | ✅ 담당 |
| Diesel | services/blog-api | 읽기/쓰기만 | ❌ 안 함 |

### 스키마 변경 시 주의사항

1. `apps/blog/prisma/schema.prisma` 수정
2. `pnpm --filter blog exec prisma migrate dev` 실행
3. `services/blog-api/src/schema.rs` 동기화 (수동)
4. `services/blog-api/src/models/entities.rs` 동기화 (수동)

## 인증 방식

### 1. Internal API Key (현재 사용)

```
Next.js Server → Rust API
Header: x-internal-api-key: <INTERNAL_API_KEY>
```

- 서버 간 통신 전용
- 환경변수로 공유: `BLOG_API_INTERNAL_KEY` = `INTERNAL_API_KEY`

### 2. Supabase JWT (구현됨, 미사용)

```
Client → Rust API (직접)
Header: Authorization: Bearer <supabase_jwt>
```

- `SUPABASE_JWT_SECRET`으로 검증
- 추후 클라이언트에서 Rust API 직접 호출 시 사용 가능

## 환경변수 매핑

| Blog (.env) | Rust API (.env) | 용도 |
|-------------|-----------------|------|
| `BLOG_API_INTERNAL_KEY` | `INTERNAL_API_KEY` | 서버 간 인증 |
| `DATABASE_URL` | `DATABASE_URL` | 동일 DB |
| - | `SUPABASE_JWT_SECRET` | JWT 검증 (미사용) |

## 추후 개선 가능 (Optional)

### Supabase Auth로 완전 전환

장점:
- Prisma 제거 가능
- Diesel이 스키마 주인
- 통일된 인증

필요 작업:
1. Supabase Auth에 OAuth 설정
2. Next.js에 `@supabase/ssr` 적용
3. NextAuth 제거
4. 기존 User 마이그레이션

**현재는 필요 없음** - 시스템이 잘 동작하고, Vercel 성능 이슈 해결됨
