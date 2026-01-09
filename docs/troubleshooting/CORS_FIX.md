
## 🚨 증상

브라우저 콘솔:
```
Access to fetch at 'http://localhost:8080/api/chat' from origin 'http://localhost:7071'
has been blocked by CORS policy
```

현재 아키텍처에서는 **브라우저 → Rust blog-api(8080)** 경로에서 CORS가 발생합니다.
(RAG 서비스(7073)는 blog-api가 서버에서 호출하므로, 보통 브라우저 CORS와는 무관합니다.)

---

## ✅ 해결 방법 (순서대로)

### 1) Frontend 환경 변수 확인

```bash
cd apps/blog
cat .env.local
```

**있어야 할 내용:**
```env
NEXT_PUBLIC_BLOG_API_URL=http://localhost:8080
```

없으면 추가:
```bash
echo "NEXT_PUBLIC_BLOG_API_URL=http://localhost:8080" >> .env.local
```

---

### 2) blog-api CORS 설정 확인

```bash
cd services/blog-api
cat .env
```

**`CORS_ORIGINS`에 프론트 origin 포함 필요:**
```env
CORS_ORIGINS=http://localhost:7071,http://localhost:3000
```

---

### 3) blog-api 재시작

```bash
cd services/blog-api
cargo run
```

---

## 🧪 테스트

### 1) Health Check (CORS 없음)
```bash
curl http://localhost:8080/health
```

### 2) OPTIONS Preflight (CORS 테스트)
```bash
curl -X OPTIONS http://localhost:8080/api/chat \
  -H "Origin: http://localhost:7071" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type" \
  -v
```

### 3) 실제 POST 요청 (SSE)
```bash
curl -N -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:7071" \
  -d '{"query": "테스트", "locale": "ko"}'
```

---

## 🔍 참고 (RAG 서비스 직접 호출 디버깅)

브라우저에서 `http://localhost:7073`을 직접 호출해 디버깅하는 경우에만 `services/rag-service/.env`에 `CORS_ORIGINS` 설정이 필요합니다.
