---
name: nanobanana-visual
description: |
  나노바나나 3.0 API를 사용하여 마케팅 이미지를 생성합니다.
  "카드뉴스 만들어줘", "썸네일 생성해줘" 등의 시각화 요청 시 USE PROACTIVELY.
---

# 나노바나나 비주얼 스킬
이 스킬은 텍스트 브리프를 바탕으로 고품질의 카드뉴스와 썸네일 프롬프트를 생성하고 이미지를 제작합니다.

## 워크플로우
1. `vault/content/outputs/brief.md`에서 핵심 포인트 추출.
2. `.claude/skills/nanobanana-visual/templates/`의 템플릿 로드.
3. API 호출을 위한 최종 JSON 프롬프트 구성.
4. (현재는 플레이스홀더) 이미지 생성 후 `vault/content/outputs/visuals/`에 저장.

## 도구 연동
- 나노바나나 API 연동 로직 (향후 구현 예정)
