# 🤖 Gemini 모델 가이드

## ✅ 사용 가능한 모델 (2025년 기준)

### 추천 모델

#### 1. gemini-2.0-flash (안정 버전) ⭐ 현재 사용 중
```python
model_name = "models/gemini-2.0-flash"
```

**특징:**
- ✅ 안정적인 성능
- ✅ 빠른 응답 속도
- ✅ 합리적인 할당량
- ✅ Production-ready

**할당량 (예상):**
- 15 RPM (분당 요청)
- 1,500 RPD (일일 요청)

---

#### 2. gemini-2.5-flash (최신) 🆕
```python
model_name = "models/gemini-2.5-flash"
```

**특징:**
- ✅ 가장 최신 모델
- ✅ 더 나은 성능
- ⚠️ 할당량은 확인 필요

---

#### 3. gemini-2.0-flash-exp (실험) ⚠️ 사용 안 함
```python
model_name = "models/gemini-2.0-flash-exp"
```

**특징:**
- ⚠️ 실험 버전
- ❌ 낮은 할당량 (500 RPD)
- ❌ Production 부적합

---

## 📊 모델 비교

| 모델 | 상태 | 속도 | 할당량 | 추천 |
|------|------|------|--------|------|
| gemini-2.5-flash | 최신 | 빠름 | 미확인 | ⭐⭐⭐⭐ |
| **gemini-2.0-flash** | **안정** | **빠름** | **높음** | **⭐⭐⭐⭐⭐** |
| gemini-2.0-flash-exp | 실험 | 빠름 | 낮음 | ⚠️ |
| gemini-2.5-pro | 최신 | 느림 | 낮음 | ⭐⭐⭐ |

---

## 🚀 현재 설정

### Chat 모델
```python
# apps/rag-service/app/services/gemini.py
self.chat_model_name = "models/gemini-2.0-flash"  ✅
```

### Embeddings 모델
```python
self.embed_model_name = "models/text-embedding-004"  ✅
```

---

## 🔄 모델 변경 방법

### 1. gemini.py 파일 수정
```python
# apps/rag-service/app/services/gemini.py

self.chat_model_name = "models/gemini-2.0-flash"  # 현재
# 또는
self.chat_model_name = "models/gemini-2.5-flash"  # 최신
```

### 2. 백엔드 재시작
```bash
cd /Users/jaylee222/resources/projects/orangec_at/orangec-at/apps/rag-service
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 7073
```

---

## 🧪 사용 가능한 모델 확인

```python
import google.generativeai as genai
import os

genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

for model in genai.list_models():
    if 'generateContent' in model.supported_generation_methods:
        print(f"✅ {model.name}")
```

**출력 (2025-12-19):**
```
✅ models/gemini-2.5-flash
✅ models/gemini-2.5-pro
✅ models/gemini-2.0-flash-exp
✅ models/gemini-2.0-flash          ← 현재 사용!
✅ models/gemini-exp-1206
```

---

## ⚠️ 주의사항

### 1. 모델 이름 형식
```python
# ✅ 올바름
"models/gemini-2.0-flash"

# ❌ 잘못됨
"gemini-2.0-flash"           # "models/" 없음
"models/gemini-1.5-flash"    # 존재하지 않는 모델
```

### 2. API 라이브러리 경고
```
⚠️ google.generativeai는 deprecated
→ 나중에 google.genai로 마이그레이션 필요
```

현재는 작동하지만, 나중에 업데이트 필요!

---

## 📈 성능 최적화

### 빠른 응답이 필요할 때
```python
self.chat_model_name = "models/gemini-2.0-flash"
```

### 더 나은 품질이 필요할 때
```python
self.chat_model_name = "models/gemini-2.5-pro"
# 단, 더 느리고 할당량 낮음
```

---

## 🎯 권장 설정

**현재 Production:**
- Chat: `models/gemini-2.0-flash` ✅
- Embeddings: `models/text-embedding-004` ✅

**비용:** $0/month (무료!)

**할당량:** 충분함 (일 1,000+ 요청 가능)

---

## ✅ 완료!

**현재 사용 중:**
- `models/gemini-2.0-flash` (안정 버전)

**백엔드 재시작만 하면 됩니다!**

```bash
# Ctrl + C
cd /Users/jaylee222/resources/projects/orangec_at/orangec-at/apps/rag-service
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 7073
```
