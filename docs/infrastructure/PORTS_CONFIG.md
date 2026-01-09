
## 📍 사용 포트 (Local)

```
Frontend (Next.js):   7071
API (Rust blog-api):  8080
RAG (FastAPI):        7073
```

---

## ⚙️ 환경 변수 설정

### 1) RAG Service (services/rag-service/.env)

```env
GEMINI_API_KEY=your_gemini_api_key_here

# (옵션) 브라우저에서 rag-service를 직접 호출해 디버깅할 때만 필요
CORS_ORIGINS=http://localhost:7071,http://localhost:3000

ENVIRONMENT=development
```

### 2) Rust Blog API (services/blog-api/.env)

```env
# Frontend에서 호출할 API 포트
PORT=8080

# Frontend origin 허용 (브라우저 → blog-api)
CORS_ORIGINS=http://localhost:7071,http://localhost:3000

# Server-side privileged endpoints 보호
INTERNAL_API_KEY=CHANGE_ME

# blog-api가 호출할 RAG 서비스 위치
# (origin 또는 /api/chat 포함 URL 모두 가능)
RAG_SERVICE_URL=http://localhost:7073
```

### 3) Next.js Frontend (apps/blog/.env.local)

```env
# Frontend가 호출할 Rust API
NEXT_PUBLIC_BLOG_API_URL=http://localhost:8080

# Server Actions에서 blog-api privileged endpoints 호출 시 사용
BLOG_API_INTERNAL_KEY=CHANGE_ME
```

---

## 🚀 실행 명령어

### 터미널 1: RAG Service (FastAPI)
```bash
cd services/rag-service
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 7073
```

### 터미널 2: Rust Blog API
```bash
cd services/blog-api
cargo run
```

### 터미널 3: Next.js Frontend
```bash
cd apps/blog
pnpm dev  # 포트 7071에서 실행
```

---

## 🧪 테스트

### 1) Blog API Health Check
```bash
curl http://localhost:8080/health
```

### 2) RAG Service Health Check
```bash
curl http://localhost:7073/health
```

### 3) 프론트엔드 접속
```bash
open http://localhost:7071
```

---

## 🔧 CORS 문제 해결

### 증상
브라우저 콘솔에서 CORS 에러 발생:
```
Access to fetch at 'http://localhost:8080/api/chat' from origin 'http://localhost:7071'
has been blocked by CORS policy
```

### 해결 방법
`services/blog-api/.env`에서 `CORS_ORIGINS`에 프론트 origin이 포함되어 있는지 확인:

```env
CORS_ORIGINS=http://localhost:7071,http://localhost:3000
```

---

## 📊 포트 매핑 요약

| 서비스 | 포트 | URL |
|--------|------|-----|
| Frontend | 7071 | http://localhost:7071 |
| Blog API | 8080 | http://localhost:8080 |
| RAG Service | 7073 | http://localhost:7073 |

---

## ✅ 빠른 체크리스트

- [ ] `services/rag-service/.env`에 `GEMINI_API_KEY` 설정
- [ ] `services/blog-api/.env`에 `RAG_SERVICE_URL`, `CORS_ORIGINS`, `INTERNAL_API_KEY` 설정
- [ ] `apps/blog/.env.local`에 `NEXT_PUBLIC_BLOG_API_URL`, `BLOG_API_INTERNAL_KEY` 설정
- [ ] RAG Service 실행: 포트 7073
- [ ] Blog API 실행: 포트 8080
- [ ] Frontend 실행: 포트 7071

---

## 🌐 배포 시 참고

- Frontend는 `NEXT_PUBLIC_BLOG_API_URL=https://api.pizzar.ing` 형태로 Rust API를 바라보도록 설정
- CORS는 blog-api에서 관리 (`CORS_ORIGINS`에 `https://pizzar.ing` 포함)
- Stripe webhook은 blog-api로 직접 수신하도록 구성하는 것이 목표 (Vercel API routes 제거)
