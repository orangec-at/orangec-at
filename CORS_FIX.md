# 🔧 CORS 에러 해결 가이드

## 🚨 증상
```
INFO: 127.0.0.1:52458 - "OPTIONS /api/chat HTTP/1.1" 400 Bad Request
```

브라우저 콘솔:
```
Access to fetch at 'http://localhost:7073/api/chat' from origin 'http://localhost:7071'
has been blocked by CORS policy
```

---

## ✅ 해결 방법 (순서대로)

### 1️⃣ 환경 변수 설정 확인

```bash
cd apps/rag-service

# .env 파일 확인
cat .env
```

**있어야 할 내용:**
```env
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGINS=http://localhost:7071
ENVIRONMENT=development
```

**없으면 생성:**
```bash
cat > .env << 'EOF'
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGINS=http://localhost:7071
ENVIRONMENT=development
EOF
```

**중요:** `GEMINI_API_KEY`를 실제 API Key로 변경!

### 2️⃣ 백엔드 재시작 (필수!)

```bash
# 현재 실행 중인 서버 종료
# Ctrl + C

# 재시작
cd /Users/jaylee222/resources/projects/orangec_at/orangec-at/apps/rag-service
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 7073
```

**성공 메시지 확인:**
```
🔧 CORS Origins: ['http://localhost:7071']
INFO:     Uvicorn running on http://0.0.0.0:7073
```

### 3️⃣ 프론트엔드 환경 변수 확인

```bash
cd apps/blog

# .env.local 파일 확인
cat .env.local
```

**있어야 할 내용:**
```env
NEXT_PUBLIC_RAG_API_URL=http://localhost:7073
```

**없으면 추가:**
```bash
echo "NEXT_PUBLIC_RAG_API_URL=http://localhost:7073" >> .env.local
```

### 4️⃣ 브라우저 캐시 삭제

**Chrome/Edge:**
1. `F12` 개발자 도구 열기
2. Network 탭
3. `Disable cache` 체크
4. 강제 새로고침: `Cmd + Shift + R` (Mac) / `Ctrl + Shift + R` (Windows)

---

## 🧪 테스트

### 1. Health Check (CORS 없음)
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

### 2. OPTIONS Preflight (CORS 테스트)
```bash
curl -X OPTIONS http://localhost:7073/api/chat \
  -H "Origin: http://localhost:7071" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type" \
  -v
```

**성공 시:**
```
< HTTP/1.1 200 OK
< access-control-allow-origin: http://localhost:7071
< access-control-allow-methods: *
< access-control-allow-headers: *
```

### 3. 실제 POST 요청
```bash
curl -X POST http://localhost:7073/api/chat \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:7071" \
  -d '{"query": "테스트", "locale": "ko"}' \
  -v
```

---

## 🔍 디버깅

### 백엔드 로그 확인
```bash
# 서버 실행 시 이 메시지가 보여야 함
🔧 CORS Origins: ['http://localhost:7071']
```

**안 보이면:**
- `.env` 파일이 없거나
- `CORS_ORIGINS` 설정이 잘못됨

### 브라우저 개발자 도구
```
F12 → Network 탭 → OPTIONS 요청 클릭
```

**Headers 확인:**
- Request Headers의 `Origin`: `http://localhost:7071`
- Response Headers의 `access-control-allow-origin`: `http://localhost:7071`

**Status Code:**
- ✅ `200 OK` - 정상
- ❌ `400 Bad Request` - CORS 설정 문제
- ❌ `404 Not Found` - 엔드포인트 문제

---

## 🐛 여전히 안 되면?

### 완전 초기화

```bash
# 1. 백엔드 종료 (Ctrl+C)

# 2. .env 파일 재생성
cd /Users/jaylee222/resources/projects/orangec_at/orangec-at/apps/rag-service
rm .env
cat > .env << 'EOF'
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGINS=http://localhost:7071
ENVIRONMENT=development
EOF

# 3. Python 캐시 삭제
find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null

# 4. 재시작
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 7073

# 5. 프론트엔드 재시작
cd /Users/jaylee222/resources/projects/orangec_at/orangec-at/apps/blog
pnpm dev

# 6. 브라우저 완전 새로고침
# Cmd + Shift + R (Mac) / Ctrl + Shift + R (Windows)
```

---

## 📋 체크리스트

- [ ] `.env` 파일에 `CORS_ORIGINS=http://localhost:7071` 확인
- [ ] `.env` 파일에 `GEMINI_API_KEY` 설정됨
- [ ] 백엔드 재시작 완료
- [ ] 서버 로그에 `🔧 CORS Origins: ['http://localhost:7071']` 표시
- [ ] `curl` 테스트 통과
- [ ] 브라우저 캐시 삭제 및 새로고침
- [ ] OPTIONS 요청이 `200 OK` 반환

---

## ✅ 성공 확인

### 백엔드 로그
```
🔧 CORS Origins: ['http://localhost:7071']
INFO:     127.0.0.1:52458 - "OPTIONS /api/chat HTTP/1.1" 200 OK
INFO:     127.0.0.1:52458 - "POST /api/chat HTTP/1.1" 200 OK
```

### 브라우저
- 채팅 위젯 작동
- 질문 입력 시 응답 받음
- Console에 CORS 에러 없음

---

**성공하면 알려주세요!** 🎉
