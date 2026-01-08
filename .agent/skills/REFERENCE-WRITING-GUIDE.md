# Reference-Based Writing System Guide

**레퍼런스 기반 글쓰기 시스템** - vault의 지식을 자동으로 참조해서 이력서, 커버레터, 블로그 포스트를 작성하는 시스템

---

## 🎯 시스템 개요

### 문제
매번 이력서나 커버레터를 쓸 때:
- ❌ 어떤 프로젝트를 강조해야 할지 모름
- ❌ JD 요구사항과 경험을 매칭하기 어려움
- ❌ 블로그 글 쓸 때 예전 경험을 찾기 힘듦
- ❌ 일관성 없는 스타일과 구조

### 해결
**자동 레퍼런스 시스템:**
```
vault/ (레퍼런스 저장소)
  ↓ Claude가 자동 참조
reference-library skill (JD 분석 + 프로젝트 매칭)
  ↓
writing-assistant skill (맞춤형 글 작성)
  ↓
apps/blog/documents/ (완성된 문서)
```

---

## 📂 Vault 구조

### Career References
```
vault/career/
├── history/                    # 프로젝트 상세 이력
│   ├── PROJECT_SUMMARY.md      # 전체 프로젝트 요약
│   ├── 2024-08_YogaDay.md
│   ├── 2024-03_DrawHatha.md
│   └── ...
├── applications/               # 회사별 지원서
│   ├── dunamu/
│   │   ├── dunamu-jd.json     # JD 분석
│   │   ├── dunamu-resume.md
│   │   └── dunamu-cover-letter.md
│   └── ...
├── resume-en.md               # 영문 이력서 템플릿
└── specialized-expertise.md   # 핵심 역량
```

### Knowledge Base
```
vault/knowledge/
├── tech/                      # 기술 지식
│   ├── claude-code/
│   ├── react-query.md
│   └── ...
├── business/                  # 비즈니스
└── life/                      # 삶의 지혜
```

---

## 🚀 사용 방법

### 1. 이력서 작성

**Slash Command:**
```
/resume <회사명>
```

**수동 작성:**
```
User: "Stripe 지원용 이력서 작성해줘"

Claude:
1. reference-library skill 자동 활성화
2. vault/career/applications/stripe/stripe-jd.json 읽기
3. JD 분석: React, TypeScript, Payment Systems 요구
4. vault/career/history/ 검색 → 관련 프로젝트 매칭
   - YogaDay (React 19, TypeScript) - 92% 매치
   - 디자인시스템 (Component library) - 88% 매치
5. apps/blog/documents/resumes/stripe.mdx 생성
```

**결과:**
- JD 요구사항에 맞춘 프로젝트 선별
- 정량적 성과 포함
- ATS 최적화 (키워드 매칭)

### 2. JD 분석

**Slash Command:**
```
/analyze-jd <회사명>
```

**출력 예시:**
```markdown
# JD Analysis: Stripe

## Must-Have Requirements
1. React + TypeScript (senior) - ✅ Strong match (5년 경험)
2. Component library design - ✅ Strong match (디자인시스템 구축)
3. Performance optimization - ✅ Strong match (LCP 1.2s 달성)

## Top Matched Projects
1. YogaDay | Score: 0.92
   - Matches: React 19, TypeScript, Performance
   - Why: 최신 기술 스택 + 성능 최적화 실전 경험

2. 디자인시스템 | Score: 0.88
   - Matches: Component library, Reusable UI
   - Why: 대규모 컴포넌트 라이브러리 설계 경험

## Recommendations
- Lead with: YogaDay + 디자인시스템
- Highlight: 성능 최적화, 컴포넌트 설계
- Gap: Payment systems (DrawHatha 결제 통합으로 커버)
```

### 3. 커버레터 작성

**Slash Command:**
```
/cover-letter <회사명>
```

**자동 작업:**
1. JD 문화/도메인 분석
2. vault/career/interview/stories.md에서 관련 스토리 찾기
3. 스토리텔링 형식으로 작성

**구조:**
```markdown
Dear Hiring Manager,

**Hook:** Stripe의 developer-first 철학과 코드 리뷰 문화는...

**Story:** 플렉스웍에서 6개 프로덕트팀을 위한 디자인시스템을 구축하며...
- Context: 각 팀이 개별 컴포넌트를 만들며 비효율 발생
- Action: 공통 디자인시스템 제안 및 주도적 구축
- Result: 개발 생산성 2배 향상, 일관성 확보

**Technical:** React 19 RC를 실전 도입하며 성능 최적화로 LCP 30% 개선...

**Cultural Fit:** TDD와 페어 프로그래밍을 일상적으로...

Best regards,
이재일
```

### 4. 블로그 포스트 작성

**Slash Command:**
```
/write-blog <주제>
```

**자동 작업:**
1. vault/knowledge/tech/ 에서 관련 지식 로드
2. vault/career/history/ 에서 실전 예제 찾기
3. 기존 포스트 스타일 참조

**구조:**
```markdown
---
title: "React Query 실전 활용법"
tags: ["React", "TypeScript", "React Query"]
---

## 문제 상황
YogaDay 프로젝트에서 수강생 목록 조회 시 중복 요청 발생

## 해결 방법
### 1. staleTime 설정
[Code examples from vault/knowledge/tech/react-query.md]

## 결과
- API 호출 70% 감소
- 페이지 로딩 500ms → 150ms

## 배운 점
[Insights from project experience]
```

---

## 🎨 Skills 설명

### 1. reference-library
**역할:** vault 레퍼런스 자동 로드

**기능:**
- JD JSON 읽기 및 분석
- 프로젝트 매칭 알고리즘
- 관련성 점수 계산
- 지식 베이스 검색

**트리거:**
- 키워드: "resume", "이력서", "jd", "vault", "reference"
- 의도: "이력서 작성", "JD 분석", "프로젝트 매칭"
- 파일: `vault/career/**/*.md`, `*.json`

### 2. writing-assistant
**역할:** 레퍼런스 기반 글 작성

**기능:**
- 이력서 작성 (JD 맞춤형)
- 커버레터 작성 (스토리텔링)
- 블로그 포스트 작성 (실전 예제)
- ATS 최적화
- 정량적 성과 강조

**트리거:**
- 키워드: "write resume", "이력서 작성", "블로그 작성"
- 의도: "맞춤형 이력서", "커버레터 작성"
- 파일: `apps/blog/documents/**/*.mdx`

---

## 📊 워크플로우 상세

### Resume Writing Workflow

```
1. JD Analysis
   ↓
   - Read: vault/career/applications/X/X-jd.json
   - Extract: must/nice requirements, culture, domain
   - Prioritize: Top 5 critical requirements

2. Project Matching
   ↓
   - Search: vault/career/history/*.md
   - Match: Tech stack, domain, impact
   - Rank: Relevance score (0.0-1.0)
   - Select: Top 3-5 projects

3. Resume Composition
   ↓
   - Structure: ContentTable format (existing pattern)
   - Lead with: JD-matched achievements
   - Quantify: Specific metrics (LCP 1.2s, 성능 30% 개선)
   - Optimize: ATS keywords from JD

4. Output
   ↓
   apps/blog/documents/resumes/X.mdx
```

### Blog Writing Workflow

```
1. Topic Identification
   ↓
   - User: "React Query에 대한 글 쓰고 싶어"
   - Extract: Topic = "React Query"

2. Knowledge Loading
   ↓
   - Read: vault/knowledge/tech/react-query.md
   - Search: vault/career/history/ for "React Query"
   - Find: YogaDay, DrawHatha projects

3. Style Reference
   ↓
   - Analyze: apps/blog/src/posts/ko/*.mdx
   - Extract: Structure pattern, tone, code style

4. Composition
   ↓
   - Problem: Real project context
   - Solution: Knowledge + code examples
   - Result: Quantifiable improvement
   - Insights: Practical takeaways

5. Output
   ↓
   apps/blog/src/posts/ko/react-query-best-practices.mdx
```

---

## ✅ 품질 체크리스트

### Resume
- [ ] 모든 프로젝트가 JD 요구사항 ≥2개 매칭
- [ ] 정량적 성과 포함 (%, 초, 배 등)
- [ ] JD 키워드가 introduction에 포함
- [ ] 기술 스택이 JD 우선순위 반영
- [ ] 2페이지 이하

### Cover Letter
- [ ] 회사/포지션 특정 (generic 아님)
- [ ] 구체적 스토리 ≥1개 (결과 포함)
- [ ] 회사 문화 매칭
- [ ] 400단어 이하
- [ ] 자연스러운 톤

### Blog Post
- [ ] 실제 프로젝트 문제로 시작
- [ ] 작동하는 코드 예제 포함
- [ ] 정량적 결과/개선사항
- [ ] 실용적 takeaways
- [ ] 기존 포스트 스타일 일관성

---

## 🛠️ 유지보수

### Vault 업데이트

**새 프로젝트 추가:**
```bash
# 1. 상세 이력 작성
vim vault/career/history/2025-01_NewProject.md

# 2. PROJECT_SUMMARY.md 업데이트
# 3. apps/blog/documents/resumes/data/projects.json 동기화
```

**새 JD 추가:**
```bash
# 1. 디렉토리 생성
mkdir vault/career/applications/new-company

# 2. JD JSON 작성
vim vault/career/applications/new-company/new-company-jd.json

# 3. 구조:
{
  "title": "...",
  "company": "...",
  "must": [...],
  "nice": [...],
  "culture": [...],
  "domain": [...]
}
```

### Knowledge Base 업데이트

```bash
# 새 기술 지식 추가
vim vault/knowledge/tech/new-technology.md

# 구조:
# 문제 상황
# 해결 방법 (with code)
# 베스트 프랙티스
# 프로젝트 적용 사례
```

---

## 💡 팁 & 베스트 프랙티스

### 1. JD JSON은 구조화되게
```json
{
  "must": ["명확한 기술/역량"],  // 반드시 매칭해야 함
  "nice": ["우대사항"],          // 있으면 좋음
  "culture": ["문화 키워드"],     // 커버레터에 활용
  "domain": ["도메인 키워드"]     // 관련 프로젝트 찾기
}
```

### 2. 프로젝트 이력은 상세하게
```markdown
# 2024-08_YogaDay.md

## 기술 스택
React 19, TypeScript, Tailwind CSS

## 주요 성과
- React 19 RC 최신 기능 도입으로 렌더링 성능 30% 개선
- LCP 3.5s → 1.2s 달성 (Core Web Vitals 최적화)

## 배운 점
[실전 인사이트]
```

### 3. 정량적으로 작성
```
❌ "성능을 개선했습니다"
✅ "LCP 3.5s → 1.2s로 65% 개선"

❌ "개발 생산성 향상"
✅ "컴포넌트 개발 시간 50% 단축 (2시간 → 1시간)"
```

### 4. ATS 최적화
```
JD: "React, TypeScript, Next.js"
Resume Introduction:
"5년간 React, TypeScript, Next.js 기반 프론트엔드 개발"
→ 정확히 같은 키워드 사용
```

---

## 🎯 다음 단계

시스템 구축 완료 후:

1. **Vault 채우기**
   - [ ] 모든 프로젝트 이력 정리 (`vault/career/history/`)
   - [ ] 핵심 기술 지식 정리 (`vault/knowledge/tech/`)
   - [ ] 면접 스토리 정리 (`vault/career/interview/stories.md`)

2. **테스트**
   - [ ] 기존 회사 이력서 재작성 (`/resume dunamu`)
   - [ ] JD 분석 테스트 (`/analyze-jd stripe`)
   - [ ] 블로그 포스트 작성 (`/write-blog "React 19 새 기능"`)

3. **개선**
   - [ ] 프로젝트 매칭 알고리즘 피드백
   - [ ] 추가 레퍼런스 카테고리
   - [ ] 자동화 스크립트 (vault → blog data 동기화)

---

## 📚 참고 문서

- `.claude/skills/reference-library/SKILL.md` - 레퍼런스 시스템 상세
- `.claude/skills/writing-assistant/SKILL.md` - 글쓰기 워크플로우 상세
- `.claude/commands/` - Slash commands 사용법
- `vault/README.md` - Vault 시스템 가이드

---

**시작하기:**

```bash
# 1. Vault에 레퍼런스 작성
vim vault/career/history/2024-08_YogaDay.md
vim vault/career/applications/stripe/stripe-jd.json

# 2. Claude Code 실행
# 3. 이력서 작성 테스트
/resume stripe
```

✨ **Happy Writing with References!**
