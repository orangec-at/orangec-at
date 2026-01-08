# 프로젝트 구조 분석

## 📁 핵심 디렉토리 구조

### 1. Vault (레퍼런스 저장소)
```
vault/
├── career/                  # 커리어 관련 레퍼런스
│   ├── history/            # 프로젝트 상세 이력 (MD)
│   │   ├── PROJECT_SUMMARY.md
│   │   ├── 2024-08_YogaDay.md
│   │   ├── 2024-03_DrawHatha.md
│   │   └── ...
│   ├── applications/       # 회사별 지원서
│   │   ├── 04-dunamu/
│   │   │   ├── dunamu-jd.json
│   │   │   ├── dunamu-resume.md
│   │   │   └── dunamu-cover-letter.md
│   │   └── ...
│   ├── resume-en.md        # 영문 이력서
│   ├── specialized-expertise.md
│   └── interview/          # 면접 스토리/질문
├── knowledge/              # 지식 베이스
│   ├── tech/              # 기술 지식
│   ├── business/          # 비즈니스
│   └── life/              # 삶의 지혜
├── decisions/             # 중요 의사결정
├── projects/              # 프로젝트 노트
└── templates/             # 템플릿
```

### 2. Blog Documents (글 작성 위치)
```
apps/blog/
├── documents/             # MDX 문서
│   ├── resumes/          # 이력서 (MDX)
│   │   ├── data/
│   │   │   ├── experiences.json
│   │   │   └── projects.json
│   │   ├── resume-dunamu.mdx
│   │   └── flexwork.mdx
│   ├── cover-letters/    # 커버레터 (MDX)
│   └── portfolio/        # 포트폴리오
└── src/posts/            # 블로그 포스트 (ko/en)
```

## 🔄 현재 워크플로우

```
vault/ (레퍼런스 원본)
   ↓ 수동 복사/작성
apps/blog/documents/ (정제된 공개 문서)
   ↓
웹 배포 (Vercel)
```

## 📊 데이터 구조

### JD (Job Description) JSON
```json
{
  "title": "Frontend Engineer_운영플랫폼",
  "company": "두나무",
  "must": ["React", "TypeScript", "Next.js"],
  "nice": ["5년 이상 경력", "테스트 자동화"],
  "culture": ["코드 리뷰", "TDD"],
  "domain": ["운영", "어드민"]
}
```

### Resume Data JSON
- `experiences.json`: 경력 데이터
- `projects.json`: 프로젝트 상세 (13KB)

## 🎯 사용자 요구사항

> "레퍼런스 문서를 두고 내가 글을 쓸 때 해당 지식을 참조해서 글이 써지는 시스템"

**목표:**
1. 이력서/커버레터 작성 시 vault의 레퍼런스를 자동으로 참조
2. JD 분석 → 관련 프로젝트 매칭 → 맞춤형 이력서 생성
3. 지식 베이스 활용한 블로그 포스트 작성

## 💡 설계 방향

### 1. Reference Library Skill
- vault/career/history/ → 프로젝트 이력
- vault/career/applications/ → JD 분석
- vault/knowledge/ → 기술 지식

### 2. Writing Assistant Skill
- 이력서 작성: JD 분석 → 관련 경험 매칭 → 맞춤형 작성
- 커버레터 작성: 회사 문화 분석 → 스토리텔링
- 블로그 포스트: 지식 베이스 참조 → 글 작성

### 3. Auto-Reference System
- skill-rules.json: 문서 타입별 자동 활성화
- Progressive loading: 필요한 레퍼런스만 로드
- Context7 MCP: 외부 기술 문서 참조
