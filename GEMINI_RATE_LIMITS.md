# 🚦 Gemini API 할당량 가이드

## 📊 무료 할당량 (Free Tier)

### gemini-1.5-flash (안정 버전) ✅ 권장
```
요청 한도:
- 15 RPM (분당 15개 요청)
- 1,500 RPD (일당 1,500개 요청)
- 1M TPM (분당 100만 토큰)
```

### gemini-2.0-flash-exp (실험 버전) ⚠️ 제한적
```
요청 한도:
- 10 RPM (분당 10개 요청) - 더 낮음!
- 500 RPD (일당 500개 요청) - 더 낮음!
- 4M TPM (분당 400만 토큰)
```

**결론:** `gemini-1.5-flash` 사용 권장! ✅

---

## ✅ 해결 완료

**변경 사항:**
- `gemini-2.0-flash-exp` → `gemini-1.5-flash`
- 더 높은 할당량 (1,500 RPD vs 500 RPD)
- 안정적인 모델

---

## 🔄 적용 방법

### 1. 백엔드 재시작
```bash
# Ctrl + C로 종료 후
cd /Users/jaylee222/resources/projects/orangec_at/orangec-at/apps/rag-service
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 7073
```

### 2. 테스트
```bash
# 30초 기다린 후 (rate limit reset)
curl -X POST http://localhost:7073/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "안녕하세요", "locale": "ko"}'
```

---

## 📈 사용량 확인

### Gemini API 대시보드
```
https://ai.dev/usage?tab=rate-limit
```

**확인 항목:**
- 오늘 사용한 요청 수
- 남은 할당량
- Rate limit 리셋 시간

---

## 🎯 최적화 팁

### 1. 요청 줄이기
```python
# 검색 결과를 3개 → 2개로
results = vector_store.search(
    query_embedding=query_embedding,
    top_k=2,  # 3 → 2로 변경
    locale=request.locale
)
```

### 2. 캐싱 추가 (나중에)
```python
# 같은 질문 반복 시 캐싱
from functools import lru_cache

@lru_cache(maxsize=100)
def get_cached_response(query: str):
    # 캐시된 응답 반환
    pass
```

### 3. Debouncing (프론트엔드)
```typescript
// 사용자가 타이핑 멈춘 후 500ms 뒤에 요청
const debouncedSearch = debounce(handleSearch, 500);
```

---

## 💰 유료 플랜 (필요 시)

### 가격
```
Pay-as-you-go (종량제):
- Input: $0.075 / 1M tokens
- Output: $0.30 / 1M tokens

할당량:
- 2000 RPM (분당 2000개 요청)
- 무제한 일일 요청
```

**예상 비용 (월 100 쿼리):**
- 약 $0.10/month (100원)
- 매우 저렴!

---

## 🔍 에러 메시지별 해결

### "Quota exceeded for free tier"
```
원인: 무료 할당량 초과
해결:
1. 30초~1분 기다리기
2. gemini-1.5-flash 사용 (이미 변경됨 ✅)
3. 사용량 확인: https://ai.dev/usage
```

### "Resource exhausted"
```
원인: TPM (토큰) 한도 초과
해결:
1. Context 크기 줄이기 (top_k=2)
2. 짧은 답변 요청
3. 1분 기다리기
```

### "Invalid API key"
```
원인: API Key 오류
해결:
1. .env 파일 확인
2. API Key 재발급
3. 백엔드 재시작
```

---

## 📋 현재 설정

**모델:**
- Embeddings: `text-embedding-004`
- Chat: `gemini-1.5-flash` ✅ (변경됨!)

**할당량:**
- 15 RPM (분당)
- 1,500 RPD (일당)

**비용:**
- $0/month (무료!)

---

## ✅ 체크리스트

- [x] 모델 변경: `gemini-1.5-flash`
- [ ] 백엔드 재시작
- [ ] 30초 기다림
- [ ] 테스트 성공

---

**지금 바로 백엔드를 재시작하세요!** 🚀

```bash
# Ctrl + C
cd /Users/jaylee222/resources/projects/orangec_at/orangec-at/apps/rag-service
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 7073
```

30초 기다린 후 다시 테스트해보세요! 😊
