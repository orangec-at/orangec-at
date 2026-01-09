# Blog Infrastructure Redesign Plan

## Date: 2026-01-09

## Goal
Vercel 서버리스 성능 문제 해결 - DB/외부 API 호출을 Rust API로 분리

## Architecture

```
Frontend (Vercel)          Backend (OCI)              External
─────────────────          ─────────────              ────────
Next.js SSR               Rust API (Axum)            
- Pages rendering         - /api/auth/*              Supabase DB
- Static assets           - /api/newsletter          Supabase Auth
- Client components       - /api/checkout            Stripe
                          - /api/chat                Resend
                          - /api/marginalia          HuggingFace RAG
                          
pizzar.ing                api.pizzar.ing
```

## Key Decisions

1. **NOT Static Export** - SSR 유지, Server Actions만 제거
2. **Rust (Axum)** - 20MB 메모리, OCI 1GB에서 여유
3. **Diesel ORM** - 기존 Supabase PostgreSQL 연결
4. **Supabase Auth** - NextAuth 대체, JWT 검증
5. **크로스 컴파일** - 로컬 맥에서 빌드 → 바이너리 업로드

## Migration Scope

### 제거할 것 (Next.js에서)
- `src/actions/*.ts` (7개 Server Actions)
- `src/app/api/chat/route.ts`
- `src/app/api/search/route.ts`
- `src/app/api/webhook/stripe/route.ts`

### 유지할 것 (Next.js에서)
- `src/app/api/auth/[...nextauth]/route.ts` → Supabase Auth로 전환
- 모든 페이지 컴포넌트
- 클라이언트 컴포넌트

### 새로 만들 것 (Rust)
- `services/blog-api/` - Axum 기반 API 서버
- Diesel 스키마 (기존 Prisma 스키마 기반)
- JWT 검증 미들웨어
- Stripe/Resend 연동

## Infrastructure

| Service | Platform | Domain | Cost |
|---------|----------|--------|------|
| Frontend | Vercel | pizzar.ing | $0 |
| API | OCI E2.1.Micro | api.pizzar.ing | $0 |
| RAG | Hugging Face | internal | $0 |
| DB | Supabase | - | $0 |

## Progress

- [x] Phase 0: CURRENT-WORK.md + Serena memory
- [x] Phase 1: Rust API 기본 구조 생성
- [ ] Phase 2: Diesel 스키마
- [ ] Phase 3: Auth 엔드포인트
- [ ] Phase 4-9: 나머지

## Created Files

```
services/blog-api/
├── Cargo.toml
├── .env.example
├── .gitignore
├── README.md
└── src/
    ├── main.rs
    ├── routes/
    │   ├── mod.rs
    │   ├── auth.rs
    │   ├── newsletter.rs
    │   ├── checkout.rs
    │   ├── chat.rs
    │   ├── search.rs
    │   └── webhook.rs
    ├── models/
    │   └── mod.rs
    └── services/
        ├── mod.rs
        ├── db.rs
        ├── stripe.rs
        └── resend.rs
```

## Next Session

Phase 2부터 시작: Diesel 스키마 정의 (기존 Prisma schema.prisma 기반)

## Phases

1. Rust API 기본 구조 생성
2. Diesel 스키마 정의
3. Auth 엔드포인트
4. Newsletter/Checkout 엔드포인트
5. RAG 프록시
6. OCI 배포
7. Next.js에서 Server Actions 제거 + API 호출로 변경
8. 도메인 연결

## Related Files

- `dev/active/CURRENT-WORK.md` - 현재 작업 상태
- `apps/blog/prisma/schema.prisma` - DB 스키마 원본
- `apps/blog/src/actions/` - 마이그레이션 대상
