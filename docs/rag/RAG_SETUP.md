# RAG System Setup Guide

블로그에 AI 검색 기능(RAG)을 추가하는 완전한 가이드입니다.

## 📋 목차

1. [시스템 구조](#시스템-구조)
2. [사전 요구사항](#사전-요구사항)
3. [설치 및 설정](#설치-및-설정)
4. [사용 방법](#사용-방법)
5. [배포](#배포)
6. [문제 해결](#문제-해결)

## 🏗️ 시스템 구조

```
┌─────────────────────────────────────┐
│  Next.js Frontend (TypeScript)     │
│  - Chat UI Component                │
│  - Blog Pages                       │
└──────────────┬──────────────────────┘
               │ HTTP + SSE
               ▼
┌─────────────────────────────────────┐
│  FastAPI Backend (Python)           │
│  - Chat API (Streaming)             │
│  - Vector Search                    │
│  - Gemini Integration               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Gemini API (Google)                │
│  - text-embedding-004               │
│  - gemini-2.0-flash-exp             │
└─────────────────────────────────────┘
```

## ✅ 사전 요구사항

### 필수
- Python 3.11+
- Node.js 18+
- pnpm (이미 설치됨)
- Gemini API Key (무료)

### 설치 필요
```bash
# uv 설치 (Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# 확인
uv --version
```

## 🚀 설치 및 설정

### 1. Gemini API Key 발급

1. [Google AI Studio](https://aistudio.google.com/app/apikey) 접속
2. "Create API Key" 클릭
3. API Key 복사

### 2. Python 백엔드 설정

```bash
# 1. RAG service 디렉토리로 이동
cd services/rag-service

# 2. Python 3.11 설치 (uv가 자동으로 다운로드)
uv python install 3.11

# 3. Dependencies 설치
uv sync

# 4. 환경 변수 설정
cp .env.example .env

# 5. .env 파일 편집
# GEMINI_API_KEY=your_api_key_here 입력
nano .env  # 또는 vscode로 열기
```

### 3. Next.js 프론트엔드 설정

```bash
# (repo root 기준)

# 1. Rust blog-api 디렉토리로 이동
cd services/blog-api
cp .env.example .env
# .env에 RAG_SERVICE_URL=http://localhost:7073 와 CORS_ORIGINS=http://localhost:7071 등을 설정

# 2. Blog 디렉토리로 이동
cd ../../apps/blog

# 3. 환경 변수 설정
cp .env.example .env.local

# 4. .env.local 파일에 추가
# Frontend는 blog-api를 호출
echo "NEXT_PUBLIC_BLOG_API_URL=http://localhost:8080" >> .env.local
# server actions에서 privileged endpoints 호출 시 필요
# echo "BLOG_API_INTERNAL_KEY=CHANGE_ME" >> .env.local
```

### 4. 블로그 레이아웃에 ChatWidget 추가

`apps/blog/src/app/[locale]/layout.tsx` 파일을 열고 ChatWidget을 추가:

```typescript
import { ChatWidget } from '@/components/rag/chat-widget';

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ChatWidget />  {/* 이 줄 추가 */}
    </>
  );
}
```

## 📊 콘텐츠 인덱싱

블로그 콘텐츠를 AI가 이해할 수 있도록 임베딩을 생성합니다.

```bash
# RAG service 디렉토리에서 실행
cd services/rag-service

# 인덱싱 실행
uv run python scripts/generate_embeddings.py
```

**출력 예시:**
```
🚀 Starting content indexing with Gemini API
============================================================

📁 Processing locale: ko
  📄 Reading: tailwindcss-component-driven-development.mdx
  🔄 Generating embedding...
  ✅ Indexed: TailwindCSS Component-Driven Development

📄 Indexing documents...
  📂 Type: resumes
    📄 Reading: master-resume.mdx
    🔄 Generating embedding...
    ✅ Indexed: 이재일 | Frontend Engineer

✅ Indexing completed successfully!
============================================================

Total indexed: 15
  - Blog posts: 2
  - Documents: 13

By locale:
  - ko: 12
  - en: 3

📦 Embeddings saved to: data/embeddings.json
```

## 🎮 실행

### 개발 모드

**터미널 1: Python 백엔드**
```bash
cd services/rag-service
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 7073
```

**터미널 2: Next.js 프론트엔드**
```bash
cd apps/blog
pnpm dev
```

### 한 번에 실행 (선택사항)

Root `package.json`에 스크립트 추가:

```json
{
  "scripts": {
    "dev:blog": "pnpm --filter blog dev",
    "dev:rag": "cd services/rag-service && uv run uvicorn app.main:app --reload",
    "dev:all": "concurrently \"pnpm dev:blog\" \"pnpm dev:rag\"",
    "rag:index": "cd services/rag-service && uv run python scripts/generate_embeddings.py"
  }
}
```

```bash
# 동시에 실행
pnpm dev:all
```

## 🧪 테스트

### 1. 백엔드 Health Check

```bash
curl http://localhost:7073/health
```

**예상 응답:**
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gemini_configured": true
}
```

### 2. Chat API 테스트

```bash
curl -X POST http://localhost:7073/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "Next.js 성능 최적화 방법은?", "locale": "ko"}'
```

### 3. 프론트엔드 테스트

1. http://localhost:3000 접속
2. 우측 하단 채팅 버튼 클릭
3. 질문 입력: "이재일의 OAuth 경험은?"
4. AI 응답 확인

## 🎨 UI 커스터마이징

### 채팅 위젯 위치 변경

`apps/blog/src/components/rag/chat-widget.tsx`:

```typescript
// 우측 하단 → 좌측 하단
className="fixed bottom-8 left-8 z-50"  // right-8 → left-8

// 위치 더 높게
className="fixed bottom-20 right-8 z-50"  // bottom-8 → bottom-20
```

### 색상 변경

Tailwind CSS 클래스 수정:

```typescript
// 버튼 색상
className="bg-blue-500 hover:bg-blue-600"  // 파란색

// 사용자 메시지 색상
className="bg-green-500 text-white"  // 초록색
```

## 🌐 배포

### Python 백엔드 배포 (Railway)

```bash
# 1. Railway CLI 설치
npm install -g @railway/cli

# 2. Railway 로그인
railway login

# 3. 프로젝트 생성
cd services/rag-service
railway init

# 4. 환경 변수 설정
railway variables set GEMINI_API_KEY=your_key_here
railway variables set CORS_ORIGINS=https://your-blog.vercel.app

# 5. 배포
railway up
```

### Next.js 프론트엔드 배포 (Vercel)

```bash
# 1. Vercel 환경 변수 설정
# Vercel Dashboard → Settings → Environment Variables
NEXT_PUBLIC_BLOG_API_URL=https://api.pizzar.ing
BLOG_API_INTERNAL_KEY=CHANGE_ME

# 2. 배포
vercel --prod
```

## 🐛 문제 해결

### 1. "GEMINI_API_KEY not set" 에러

**해결:**
```bash
cd services/rag-service
cat .env  # 환경 변수 확인
```

`.env` 파일이 없으면:
```bash
cp .env.example .env
# GEMINI_API_KEY 입력
```

### 2. "No embeddings available" 에러

**해결:**
```bash
cd services/rag-service
uv run python scripts/generate_embeddings.py
```

### 3. CORS 에러

**해결:**

`services/rag-service/.env`:
```env
CORS_ORIGINS=http://localhost:3000,https://your-blog.vercel.app
```

### 4. "Module not found" 에러 (Python)

**해결:**
```bash
cd services/rag-service
uv sync  # Dependencies 재설치
```

### 5. 채팅 위젯이 안 보임

**해결:**

1. `apps/blog/src/app/[locale]/layout.tsx`에 `<ChatWidget />` 추가 확인
2. 브라우저 콘솔에서 에러 확인
3. 백엔드가 실행 중인지 확인: `curl http://localhost:7073/health`

## 📈 성능 최적화

### 1. 임베딩 캐싱

이미 `data/embeddings.json`에 저장되어 재사용됩니다.

### 2. 쿼리 응답 속도

- Gemini Flash 모델: 매우 빠름 (1-2초)
- 로컬 벡터 검색: 즉시 (< 100ms)

### 3. 비용 절감

- Gemini API: 무료 (1500 req/day)
- 월 예상 비용: **$0**

## 📚 추가 학습 자료

- [Gemini API Documentation](https://ai.google.dev/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Vector Search Guide](https://www.pinecone.io/learn/vector-search/)
- [RAG Pattern Overview](https://python.langchain.com/docs/use_cases/question_answering/)

## 🎉 완료!

이제 블로그에 AI 검색 기능이 추가되었습니다!

**다음 단계:**
1. 더 많은 블로그 글 작성 → 자동으로 검색 가능
2. Supabase pgvector로 업그레이드 (50+ 글일 때)
3. 분석 추가 (어떤 질문이 많은지)
4. 다국어 지원 확장

**질문이 있으면 언제든지 물어보세요!** 🚀
