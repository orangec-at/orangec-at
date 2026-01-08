---
name: shorts-video-maker
description: |
  원본 영상에서 쇼츠 클립을 자동으로 추출하고 가공합니다.
  "쇼츠 만들어줘", "영상 편집해줘" 요청 시 USE PROACTIVELY.
---

# 쇼츠 비디오 메이커 스킬
이 스킬은 yt-dlp, whisper, ffmpeg를 사용하여 원본 영상에서 60초 미만의 쇼츠를 제작합니다.

## 워크플로우
1. `download_video.py`를 실행하여 원본 다운로드.
2. `transcribe.py`를 실행하여 텍스트 및 타임스탬프 추출.
3. `shorts-scriptwriter`의 대본과 타임스탬프를 매칭.
4. `cut_shorts.py`를 실행하여 9:16 비율 크롭 및 자막 병합.

## 도구 필수 사항
- 시스템에 `ffmpeg`, `yt-dlp`가 설치되어 있어야 합니다.
- Python 패키지: `openai-whisper` (또는 API 라이브러리)
