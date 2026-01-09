---
name: nanobanana-visual
description: |
  마케팅 이미지를 생성합니다. (썸네일, 카드뉴스, 쇼츠 표지)
  "카드뉴스 만들어줘", "썸네일 생성해줘" 등의 시각화 요청 시 USE PROACTIVELY.
---

# 나노바나나 비주얼 스킬

이 스킬은 텍스트 브리프를 바탕으로 고품질의 마케팅 이미지를 생성합니다.

## 지원 이미지 유형
1. **블로그 썸네일** (1280x720, 16:9)
2. **카드뉴스** (1080x1080, 1:1)
3. **쇼츠 표지** (1080x1920, 9:16)

## 워크플로우
1. `vault/content/outputs/YYYY-MM-DD_프로젝트명/brief.md`에서 핵심 포인트 추출
2. `.agent/skills/nanobanana-visual/templates/`의 템플릿 참조
   - `thumbnail-prompt.md` → 블로그 썸네일
   - `card-news-prompt.md` → 카드뉴스
3. `generate_image` 도구를 사용하여 이미지 생성
4. 결과물을 `vault/content/outputs/YYYY-MM-DD_프로젝트명/visuals/`에 저장

## 생성 예시

### 블로그 썸네일
```
Prompt: "A premium YouTube thumbnail about [Subject], modern minimalist design, 
vibrant gradient background, large bold Korean text saying '[Title]', 
4k resolution, professional marketing style"
```

### 카드뉴스
```
Prompt: "Instagram carousel slide design, clean modern layout, 
[Point] as main text in Korean, subtle gradient background, 
professional infographic style, premium feel"
```

### 쇼츠 표지
```
Prompt: "YouTube Shorts cover image, vertical 9:16 format, 
eye-catching design, bold Korean text '[Hook]', 
dynamic composition, vibrant colors, mobile-first design"
```

## 출력 파일
- `visuals/blog-thumbnail.png`
- `visuals/card-news-01.png`, `card-news-02.png`, `card-news-03.png`
- `visuals/shorts-cover-01.png`, `shorts-cover-02.png`, `shorts-cover-03.png`

