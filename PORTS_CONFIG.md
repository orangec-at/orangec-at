# 🔌 포트 설정 가이드

## 📍 사용 포트

```
Frontend (Next.js):  7071
Backend (FastAPI):   7073
```

---

## ⚙️ 환경 변수 설정

### 1. Python 백엔드 (apps/rag-service/.env)

```env
# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# CORS Origins - 프론트엔드 포트 7071 허용
CORS_ORIGINS=http://localhost:7071,https://your-blog.vercel.app

# Environment
ENVIRONMENT=development
```

### 2. Next.js 프론트엔드 (apps/blog/.env.local)

```env
# 백엔드 API URL - 포트 7073
NEXT_PUBLIC_RAG_API_URL=http://localhost:7073
```

---

## 🚀 실행 명령어

### 터미널 1: Python 백엔드
```bash
cd apps/rag-service
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 7073
```

### 터미널 2: Next.js 프론트엔드
```bash
cd apps/blog
pnpm dev  # 포트 7071에서 실행
```

---

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

### 2. 프론트엔드 접속
```bash
open http://localhost:7071
```

---

## 🔧 CORS 문제 해결

### 증상
브라우저 콘솔에서 CORS 에러 발생:
```
Access to fetch at 'http://localhost:7073/api/chat' from origin 'http://localhost:7071'
has been blocked by CORS policy
```

### 해결 방법
`apps/rag-service/.env` 파일 확인:
```bash
cd apps/rag-service
cat .env
```

**올바른 설정:**
```env
CORS_ORIGINS=http://localhost:7071,https://your-blog.vercel.app
```

만약 없다면:
```bash
echo "CORS_ORIGINS=http://localhost:7071,https://your-blog.vercel.app" >> .env
```

백엔드 재시작:
```bash
# Ctrl+C로 종료 후
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 7073
```

---

## 📊 포트 매핑 요약

| 서비스 | 포트 | URL |
|--------|------|-----|
| **Frontend** | 7071 | http://localhost:7071 |
| **Backend API** | 7073 | http://localhost:7073 |
| **API Docs** | 7073 | http://localhost:7073/docs |
| **Health Check** | 7073 | http://localhost:7073/health |

---

## ✅ 빠른 체크리스트

설정 확인:
- [ ] `apps/rag-service/.env` → `CORS_ORIGINS=http://localhost:7071,...`
- [ ] `apps/blog/.env.local` → `NEXT_PUBLIC_RAG_API_URL=http://localhost:7073`
- [ ] 백엔드 실행: 포트 7073
- [ ] 프론트엔드 실행: 포트 7071
- [ ] CORS 설정 확인 완료

---

## 🌐 배포 시 포트

### Production
```env
# Vercel (Frontend)
NEXT_PUBLIC_RAG_API_URL=https://your-rag-service.railway.app

# Railway (Backend)
CORS_ORIGINS=https://your-blog.vercel.app,http://localhost:7071
```

---

**모든 설정이 완료되었습니다!** ✅

문제 발생 시 이 파일을 참고하세요! 📋
