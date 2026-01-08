---
description: 팀장 - AI 콘텐츠 마케팅 팀 전체를 조율하고 각 전문가 에이전트에게 업무를 배정합니다.
---

이 워크플로우는 전체 팀의 오케스트레이터 역할을 수행합니다.

### 1단계: 분석 및 기획 (Planner 소환)
// turbo
1. 사용자에게 분석할 URL을 요청합니다.
2. `/marketing-planner`를 호출하여 원본 콘텐츠를 분석하고 `vault/content/outputs/brief.md`를 작성하게 합니다.

### 2단계: 플랫폼별 콘텐츠 제작 (Writers 소환)
// turbo
1. `./vault/content/outputs/brief.md`가 준비되면 다음 에이전트들을 순차적으로 소환합니다:
    - `/marketing-newsletter-writer`: 뉴스레터 작성
    - `/marketing-blog-writer`: 블로그 글 작성
    - `/marketing-sns-specialist`: 링크드인, X(스레드), 쇼츠 대본 작성

### 3단계: 최종 검수 (Reviewer 소환)
1. 모든 결과물이 생성되면 `/marketing-reviewer`를 소환하여 품질을 검수하고 `vault/content/outputs/review-report.md`를 발간하게 합니다.

### 4단계: 완료 보고
1. 모든 작업이 완료되었음을 사용자에게 알립니다.
