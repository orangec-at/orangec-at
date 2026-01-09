---
description: 팀장 - AI 콘텐츠 마케팅 팀 전체를 조율하고 각 전문가 에이전트에게 업무를 배정합니다.
---

이 워크플로우는 전체 팀의 오케스트레이터 역할을 수행합니다.

# 폴더 구조
모든 콘텐츠는 `vault/content/outputs/YYYY-MM-DD_프로젝트명/` 폴더에 저장됩니다.
- 예: `vault/content/outputs/2026-01-08_naval-how-to-get-rich/`
- 각 프로젝트 폴더에는 `_metadata.md`가 포함되어 원본 정보와 상태를 추적합니다.

# 팀 구성
1. **오케스트레이터 팀**: planner, reviewer
2. **텍스트 마케팅 팀**: newsletter, blog, linkedin, thread, shorts-script writers
3. **비주얼 마케팅 팀**: nanobanana-visual (카드뉴스, 썸네일)
4. **영상 제작 팀**: shorts-video-maker (쇼츠 영상)

---

### 1단계: 분석 및 기획 (Planner 소환)
// turbo
1. 사용자에게 분석할 URL 또는 PDF를 요청합니다.
2. `/planner` 워크플로우를 실행하여:
   - 프로젝트 폴더 생성 (`YYYY-MM-DD_프로젝트명/`)
   - `_metadata.md` 생성 (원본 정보 기록)
   - `brief.md` 작성

### 2단계: 플랫폼별 텍스트 콘텐츠 제작 (Writers 소환)
// turbo
1. 프로젝트 폴더 내 `brief.md`가 준비되면 다음 에이전트들을 순차적으로 소환합니다:
   - `/newsletter-writer`: 뉴스레터 작성 → `newsletter.md`
   - `/blog-writer`: 블로그 글 작성 → `blog.md`
   - `/linkedin-writer`: 링크드인 포스트 작성 → `linkedin.md`
   - `/thread-writer`: X 스레드 작성 → `threads/`
   - `/shorts-scriptwriter`: 쇼츠 대본 작성 → `shorts-scripts/`

2. 모든 파일은 해당 프로젝트 폴더 내에 저장합니다.

### 2.5단계: 비주얼 콘텐츠 제작 (Visual Team 소환)
// turbo
1. 텍스트 콘텐츠가 완성되면 `nanobanana-visual` 스킬을 실행합니다:
   - `brief.md`에서 핵심 포인트 추출
   - `.agent/skills/nanobanana-visual/templates/` 템플릿 참조
   - 다음 이미지를 생성합니다:
     - **블로그 썸네일**: `visuals/blog-thumbnail.png`
     - **카드뉴스**: `visuals/card-news-01~03.png`
     - **쇼츠 표지**: `visuals/shorts-cover-01~03.png`
2. 모든 이미지는 `vault/content/outputs/YYYY-MM-DD_프로젝트명/visuals/`에 저장합니다.

### 2.7단계: 영상 콘텐츠 제작 (Video Team 소환)

#### 옵션 A: YouTube URL이 제공된 경우 (영상 기반)
1. `shorts-video-maker` 스킬을 실행합니다:
   - `scripts/download_video.py` → 원본 영상 다운로드
   - `scripts/transcribe.py` → 텍스트/타임스탬프 추출
   - `shorts-scripts/`의 대본과 타임스탬프 매칭
   - `scripts/cut_shorts.py` → 9:16 크롭 + 자막 병합
2. 결과물: `videos/shorts-01~03.mp4`

#### 옵션 B: YouTube URL이 없는 경우 (텍스트 기반)
1. `text-based-shorts` 스킬을 실행합니다:
   - `shorts-scripts/`의 대본을 씬별로 분리
   - `generate_image` 도구로 각 씬 이미지 생성 (템플릿: quote-style, tips-list-style)
   - `scripts/create_video.py` → 이미지들을 슬라이드쇼 영상으로 변환
2. 결과물: `videos/shorts-01~03.mp4`

**필수 도구**: 시스템에 `ffmpeg` 설치 필요 (YouTube 옵션은 추가로 `yt-dlp` 필요)

### 3단계: 최종 검수 (Reviewer 소환)
1. 모든 결과물이 생성되면 `/reviewer`를 소환하여 품질을 검수합니다.
2. 검수 대상:
   - 텍스트 콘텐츠 (newsletter, blog, linkedin, threads, shorts-scripts)
   - 비주얼 콘텐츠 (thumbnails, card-news)
   - 영상 콘텐츠 (shorts videos) [있는 경우]
3. `review-report.md`를 프로젝트 폴더 내에 발간합니다.
4. `_metadata.md`의 검수 상태를 업데이트합니다.

### 4단계: 완료 보고
1. 모든 작업이 완료되었음을 사용자에게 알립니다.
2. 배포 권장 순서와 함께 프로젝트 폴더 경로를 안내합니다:
   - 텍스트: Newsletter → Blog → LinkedIn → X Thread → Shorts Script
   - 비주얼: 블로그 썸네일 적용 → 카드뉴스 SNS 배포
   - 영상: YouTube Shorts, 릴스, 틱톡 업로드
