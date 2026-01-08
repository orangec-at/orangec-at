# RAG 시스템 빠른 시작 🚀

5분 안에 RAG 시스템을 실행하는 가이드입니다.

## 📝 체크리스트

- [ ] uv 설치됨
- [ ] Gemini API Key 발급받음
- [ ] 환경 변수 설정 완료
- [ ] 콘텐츠 인덱싱 완료
- [ ] 서버 실행 중

## ⚡ 빠른 실행 (5분)

### 1. uv 설치 (30초)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. Gemini API Key 발급 (2분)

1. https://aistudio.google.com/app/apikey 접속
2. "Create API Key" 클릭
3. API Key 복사

### 3. 환경 설정 (1분)

```bash
# Python 백엔드 환경 변수
cd apps/rag-service
cp .env.example .env
echo "GEMINI_API_KEY=your_key_here" > .env

# Next.js 환경 변수
cd ../blog
echo "NEXT_PUBLIC_RAG_API_URL=http://localhost:7073" >> .env.local

# Python 백엔드 CORS 설정 (프론트엔드 포트 7071)
cd ../rag-service
echo "CORS_ORIGINS=http://localhost:7071,https://your-blog.vercel.app" >> .env
```

### 4. 인덱싱 (30초)

```bash
cd apps/rag-service
uv sync  # Dependencies 설치
uv run python scripts/generate_embeddings.py
```

### 5. 실행 (10초)

**터미널 1:**
```bash
cd apps/rag-service
uv run uvicorn app.main:app --reload
```

**터미널 2:**
```bash
cd apps/blog
pnpm dev
```

### 6. 테스트

http://localhost:3000 접속 → 우측 하단 채팅 버튼 클릭

## 🎯 첫 번째 질문

채팅에서 시도해보세요:

**한국어:**
- "이재일의 경력을 요약해줘"
- "Next.js 프로젝트 경험은?"
- "OAuth 구현 경험에 대해 알려줘"

**English:**
- "Summarize Jaeil's career"
- "What Next.js projects has he worked on?"
- "Tell me about OAuth implementation experience"

## 🐛 문제 발생 시

### "GEMINI_API_KEY not set"
```bash
cd apps/rag-service
cat .env  # API Key 확인
```

### "No embeddings available"
```bash
cd apps/rag-service
uv run python scripts/generate_embeddings.py
```

### 채팅 위젯이 안 보임
1. 백엔드 실행 확인: `curl http://localhost:7073/health`
2. 브라우저 콘솔에서 에러 확인

## 📖 자세한 가이드

더 자세한 설명은 [RAG_SETUP.md](./RAG_SETUP.md)를 참고하세요.

## ✅ 완료!

이제 블로그에 AI 검색이 추가되었습니다! 🎉
