# Deployment Guide

이 문서는 OrangeC-AT 프로젝트의 두 주요 서비스(Next.js 블로그, RAG 서비스)를 각각 Render와 Railway에 배포하는 방법을 설명합니다.

---

## 1. Next.js 블로그 (Render 배포)

Next.js 앱은 Full-stack 프레임워크로 활용하기 위해 Docker 컨테이너 방식으로 Render에 배포합니다.

### 사전 준비
- Render 계정 및 GitHub 저장소 연결
- Supabase 프로젝트 (Postgres DB)

### 배포 단계
1. **Render Dashboard**에서 `New +` > `Blueprint` 선택
2. 이 저장소를 선택하면 `apps/blog/render.yaml` 설정이 자동으로 감지됩니다.
3. 다음 환경 변수를 설정합니다:
   - `DATABASE_URL`: Supabase 트랜잭션 풀러 URL
   - `DIRECT_URL`: Supabase 직접 연결 URL
   - `NEXTAUTH_SECRET`: 보안을 위한 임의의 문자열
   - `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`: Google OAuth 설정 (필요시)
   - `RAG_SERVICE_URL`: 아래에서 배포할 Railway RAG 서비스의 엔드포인트 URL (예: `https://...railway.app/api/chat`)
   - `GEMINI_API_KEY`: Google AI Studio에서 발급받은 키

---

## 2. RAG 서비스 (Railway 배포)

Python FastAPI 기반의 RAG 서비스는 모노레포 지원이 강력한 Railway에 배포합니다.

### 사전 준비
- Railway 계정
- GitHub 저장소 연결

### 배포 단계
1. **Railway Dashboard**에서 `New Project` > `GitHub Repo` 선택
2. 서비스 설정에서 `Root Directory`를 `services/rag-service`로 지정합니다.
3. **환경 변수(Variables)** 탭에서 다음 항목을 입력합니다:
   - `DATABASE_URL`: Supabase 직접 연결 URL (Port 5432, pgvector 검색용)
   - `GEMINI_API_KEY`: Google AI Studio API 키
   - `ENVIRONMENT`: `production`
4. **Networking**: Public URL을 생성하고, 이 주소를 Next.js 블로그의 `RAG_SERVICE_URL`에 입력합니다.

---

## 3. 공통: 데이터베이스 (Supabase)

두 서비스는 하나의 Supabase 인스턴스를 공유합니다.

- **Next.js**: 일반적인 데이터(User, Post, Order 등) 관리 및 Prisma 마이그레이션 담당
- **RAG Service**: `Embedding` 테이블의 벡터 데이터(`pgvector`) 검색 및 관리 담당

### 인덱싱 업데이트
새로운 포스트를 작성한 후에는 RAG 서비스의 인덱싱 스크립트를 실행하여 벡터 데이터를 갱신해야 합니다.
```bash
# 로컬에서 실행 시 (DB_URL 설정 필요)
cd services/rag-service
uv run python scripts/generate_embeddings.py
```
*(추후 GitHub Actions를 통한 자동화 권장)*

---

## 아키텍처 요약
- **Frontend/API**: Next.js (Render, Docker)
- **AI/Vector Search**: FastAPI (Railway)
- **Database**: Postgres + pgvector (Supabase)
- **LLM**: Gemini 1.5 Flash
