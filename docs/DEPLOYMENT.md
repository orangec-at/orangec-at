# Orangec-AT Production Deployment Guide

이 문서는 블로그(Next.js)와 RAG 서비스(Python)를 실제 운영 환경에 배포하기 위한 통합 가이드입니다.

---

## 1. Database & Schema Deployment (Supabase/Postgres)

운영 DB에 테이블 스키마를 생성하고 RAG 검색을 위한 데이터를 인덱싱해야 합니다.

### 1.1 Prisma Migration
운영 DB의 `DATABASE_URL`과 `DIRECT_URL`을 로컬 `.env`에 설정한 후 다음을 실행하세요:

```bash
# apps/blog 폴더에서 실행
pnpm --filter blog exec prisma migrate deploy
```
*주의: `migrate dev`가 아닌 `migrate deploy`를 사용하여 운영 환경에 안전하게 적용합니다.*

### 1.2 RAG Embedding Indexing
RAG 검색을 위해 블로그 콘텐츠를 벡터화하여 DB에 저장해야 합니다.

```bash
# services/rag-service 폴더에서 실행
# .env에 운영 DATABASE_URL과 GEMINI_API_KEY가 설정되어 있어야 함
uv run python scripts/generate_embeddings.py
```
*참고: 이 작업은 로컬에서 운영 DB를 바라보고 한 번만 수행하면 되며, 콘텐츠가 업데이트될 때마다 다시 실행하세요.*

---

## 2. RAG Service Deployment (Python/FastAPI)

RAG 서비스는 별도의 도메인으로 배포되어야 합니다. (추천: **Railway.app**)

### 2.1 Railway Deployment
1. Railway Dashboard에서 `New Project` > `GitHub Repo` 선택.
2. 서비스 설정에서 `Root Directory`를 `services/rag-service`로 지정.
3. 다음 환경 변수를 설정하세요:
   - `DATABASE_URL`: Supabase 직접 연결 URL (pgvector 필드 접근용)
   - `GEMINI_API_KEY`: Google AI Studio 발급 키
   - `CORS_ORIGINS`: `https://your-blog-domain.vercel.app` (블로그 배포 도메인)
   - `ENVIRONMENT`: `production`
4. **Networking**: Public URL을 생성하고 이를 복사합니다.

---

## 3. Blog Application Deployment (Next.js/Vercel)

Vercel 등에 배포할 때 아래 환경 변수를 설정해야 합니다.

### 3.1 필수 환경 변수 Checklist
| 변수명 | 설명 | 비고 |
|:---|:---|:---|
| `NEXT_PUBLIC_BASE_URL` | 블로그 운영 도메인 | 예: `https://orangec-at.com` |
| `DATABASE_URL` | Prisma Connection String | Supabase Transaction mode 권장 |
| `DIRECT_URL` | Prisma Direct Connection | 마이그레이션 및 직접 연결용 |
| `AUTH_SECRET` | NextAuth 보안 키 | `openssl rand -base64 32` 생성 권장 |
| `AUTH_URL` | NextAuth 베이스 URL | `NEXT_PUBLIC_BASE_URL`과 동일 |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID | Google Cloud Console 설정 |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret | |
| `RESEND_API_KEY` | Resend API 키 | 뉴스레터/이메일 로그인 필수 |
| `RAG_SERVICE_URL` | RAG 서비스 chat 엔드포인트 | 예: `https://rag-service.railway.app/api/chat` |
| `NEXT_PUBLIC_RAG_API_URL`| RAG 서비스 베이스 URL | 예: `https://rag-service.railway.app` |

### 3.2 OAuth 설정
Google Cloud Console의 **승인된 리디렉션 URI**에 다음을 추가하세요:
`https://your-blog-domain.com/api/auth/callback/google`

---

## 4. 최종 점검 (Final Verification)

배포 완료 후 아래 시나리오를 테스트하세요:
1. **OAuth 로그인**: 정상 세션 생성 및 `/onboarding` 리다이렉트 확인.
2. **온보딩**: 약관 동의/뉴스레터 체크 시 DB(`User` 테이블) 반영 여부.
3. **뉴스레터**: 푸터 구독 시 `NewsletterSubscription` 레코드 생성 및 이메일 발송 확인.
4. **검색(RAG)**: 검색창 입력 시 결과 노출 및 CORS 이슈 유무.
5. **관리자**: `ADMIN` 권한 유저로 `/dashboard` 접근 가능 여부.
