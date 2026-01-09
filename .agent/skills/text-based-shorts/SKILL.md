---
name: text-based-shorts
description: 영상 소스 없이 텍스트만으로 쇼츠 영상을 생성합니다. 명언, 팁 리스트, 스토리 등을 이미지 슬라이드로 만들고 ffmpeg로 영상화합니다.
---

# Text-Based Shorts

영상 소스 없이 텍스트 콘텐츠만으로 9:16 세로 쇼츠 영상을 생성하는 스킬

**Works With:** 명언/인용문 • 팁 리스트 • 스토리텔링 • 교육 콘텐츠

---

## When to Use This Skill

- YouTube URL 없이 텍스트만 있을 때
- 명언, 인용문 기반 쇼츠 제작
- "5가지 방법" 같은 리스트형 콘텐츠
- 카드뉴스 스타일 영상
- 교육/정보 전달 콘텐츠

---

## 워크플로우

```
텍스트 콘텐츠 (쇼츠 대본)
    ↓
슬라이드 분리 (씬별로 나누기)
    ↓
AI 이미지 생성 (generate_image 또는 API)
    ↓
ffmpeg로 영상 변환 (슬라이드쇼)
    ↓
자막 추가 (선택적)
    ↓
BGM 추가 (선택적)
    ↓
최종 쇼츠 영상 (.mp4)
```

---

## 사용 방법

### 1. 쇼츠 대본 준비

```markdown
# 쇼츠 대본: AI 시대 생존법

## 씬 1: 후킹 (0-5초)
"AI가 개발자를 대체한다고요?"

## 씬 2: 본론 1 (5-20초)
"하지만 진짜 중요한 건 기본기예요"

## 씬 3: 본론 2 (20-40초)
"계산기가 나와도 덧셈은 가치 있듯이"

## 씬 4: 결론 (40-55초)
"승객이 아닌 설계자가 되세요"

## 씬 5: CTA (55-60초)
"더 알고 싶다면 팔로우!"
```

### 2. 이미지 생성

각 씬에 맞는 이미지를 `generate_image` 도구로 생성:

```
프롬프트 예시:
"Modern minimalist slide design, dark gradient background,
bold white Korean text '기본기가 중요해요' centered,
subtle tech elements, 9:16 aspect ratio, professional infographic style"
```

### 3. 영상 생성

```bash
python3 .agent/skills/text-based-shorts/scripts/create_video.py \
  --input-dir vault/content/outputs/PROJECT/slides/ \
  --output vault/content/outputs/PROJECT/videos/shorts-01.mp4 \
  --duration 5 \
  --transition fade
```

---

## 스타일 템플릿

### 명언/인용문 스타일
- 다크 그라데이션 배경
- 중앙 정렬 텍스트
- 인용 부호 장식
- 하단에 화자 이름

### 팁 리스트 스타일
- 번호 + 아이콘
- 키포인트 강조
- 진행 표시 바

### 스토리 스타일
- 캐릭터/일러스트
- 말풍선
- 감정 표현 이모지

---

## 스크립트 레퍼런스

### create_video.py

**옵션:**
- `--input-dir`: 이미지 폴더 경로
- `--output`: 출력 영상 경로
- `--duration`: 각 슬라이드 표시 시간 (초)
- `--transition`: 전환 효과 (fade, slide, none)
- `--audio`: BGM 파일 경로 (선택)
- `--subtitle`: 자막 파일 경로 (선택)

**예시:**
```bash
# 기본 사용 (5초씩, fade 효과)
python3 create_video.py --input-dir slides/ --output shorts.mp4

# 커스텀 설정
python3 create_video.py \
  --input-dir slides/ \
  --output shorts.mp4 \
  --duration 4 \
  --transition slide \
  --audio bgm/upbeat.mp3 \
  --subtitle captions.srt
```

---

## 베스트 프랙티스

### 이미지 생성
- 해상도: 1080x1920 (9:16)
- 텍스트 크기: 큰 글씨 (모바일 가독성)
- 색상: 강한 대비 (다크모드 친화적)
- 여백: 상하 150px 이상 (플랫폼 UI 고려)

### 영상 구조
- 후킹: 0-3초 (질문 또는 충격적 문장)
- 본론: 3-50초 (핵심 내용)
- CTA: 50-60초 (팔로우, 좋아요 요청)

### 자막
- 1줄 최대 15글자
- 화면 하단 30% 영역
- 읽기 속도: 초당 3-4글자
