# Writing Assistant Skill

**Purpose:** AI-powered writing assistance using vault references for resumes, cover letters, and blog posts

**Works With:** reference-library skill • vault/ knowledge base • MDX documents

---

## Quick Start Checklists

### Writing Resume
- [ ] Activate reference-library skill first
- [ ] Read and analyze target company JD
- [ ] Match top 3-5 relevant projects
- [ ] Write resume highlighting matched requirements
- [ ] Use ContentTable format (apps/blog pattern)
- [ ] Include quantifiable achievements

### Writing Cover Letter
- [ ] Analyze company culture and domain
- [ ] Select 1-2 compelling stories from experience
- [ ] Structure: Hook → Story → Value proposition → Close
- [ ] Keep under 400 words
- [ ] Natural, conversational tone

### Writing Blog Post
- [ ] Load relevant knowledge from vault/knowledge/tech/
- [ ] Reference real project examples
- [ ] Follow existing post structure (apps/blog/src/posts/)
- [ ] Include code examples and practical tips
- [ ] Add frontmatter (title, description, date, tags)

---

## Core Principles

### 1. Reference-Driven Writing

**Never write from scratch** - Always start with references

**Pattern:**
```
Reference-Library Skill (loads context)
  ↓
Writing Assistant Skill (composes content)
  ↓
Final Document (tailored to purpose)
```

### 2. Document Types

**Resume (MDX):**
```typescript
// apps/blog/documents/resumes/[company].mdx
---
title: "이재일 | Frontend Engineer"
company: "Stripe"
position: "Senior Frontend Engineer"
date: "2025-12-05"
---

<PersonalInfo ... />
<Introduction jd={jd} />
<ExperienceSection projects={topMatches} />
<SkillsSection tech={jd.must} />
```

**Cover Letter (MDX):**
```typescript
// apps/blog/documents/cover-letters/cv-[company].mdx
---
title: "Cover Letter for Stripe"
company: "Stripe"
date: "2025-12-05"
---

Dear Hiring Manager,

[Hook: Why this company]
[Story: Relevant experience]
[Value: What I bring]
[Close: Call to action]
```

**Blog Post (MDX):**
```typescript
// apps/blog/src/posts/ko/react-query-best-practices.mdx
---
title: "React Query 실전 활용법"
description: "5년간의 프로젝트 경험으로 배운 React Query 패턴"
date: "2025-12-05"
tags: ["React", "TypeScript", "React Query"]
---

## 문제 상황
[Real project context from vault]

## 해결 방법
[Knowledge from vault/knowledge/tech/]
```

---

## Resume Writing Workflow

### Step 1: JD Analysis

**Input:** Company name or JD path

**Process:**
```typescript
// 1. Load JD
const jd = await loadJD('vault/career/applications/stripe/stripe-jd.json')

// 2. Analyze requirements
const analysis = {
  mustHave: jd.must,              // Critical requirements
  niceToHave: jd.nice,            // Preferred qualifications
  culture: jd.culture,            // Work culture indicators
  domain: jd.domain,              // Business domain
  keywords: extractKeywords(jd)   // For ATS optimization
}

// 3. Prioritize
const priorities = {
  critical: analysis.mustHave.slice(0, 5),
  important: analysis.niceToHave.slice(0, 3),
  cultural: analysis.culture.slice(0, 3)
}
```

**Output:**
```
Critical Requirements (Must Match):
1. React + TypeScript (senior level)
2. Component library design
3. Performance optimization
4. Unit/E2E testing

Important (Nice to Have):
1. 5+ years experience
2. Payment systems
3. CI/CD experience

Cultural Fit:
1. Code review culture
2. TDD/Pair programming
3. Collaborative mindset
```

### Step 2: Project Matching

**Use reference-library skill:**
```typescript
// Delegate to reference-library
const topProjects = await matchProjects(jd)

// Expected result:
[
  {
    project: "YogaDay",
    score: 0.92,
    matchedRequirements: [
      "React 19 (latest)",
      "TypeScript strict mode",
      "Performance optimization (LCP 1.2s)"
    ],
    whyRelevant: "Demonstrates cutting-edge React skills and performance focus"
  },
  {
    project: "디자인시스템",
    score: 0.88,
    matchedRequirements: [
      "Component library design",
      "Reusable UI components",
      "Developer experience"
    ],
    whyRelevant: "Direct experience building design systems"
  }
]
```

### Step 3: Resume Composition

**Structure:**
```markdown
# [이름] | [직군]

## 👤 Personal Information
- Location: [서울]
- Email: [email]
- GitHub: [link]

## 💡 Introduction
[2-3 sentences highlighting JD match]
- "5년간 React/TypeScript 기반 프론트엔드 개발"
- "[domain]에서 [achievement]를 달성한 경험"

## 💼 Experience
### [Company] | [Role] | [Period]

**[Project Name]** | [Period]
- [Achievement matching must requirement #1]
- [Achievement matching must requirement #2]
- [Quantifiable result]

**Tech Stack:** [JD keywords prioritized]

## 🛠️ Skills
**Languages:** [matching JD first]
**Frameworks:** [matching JD first]
**Tools:** [matching JD]

## 🎓 Education
[If relevant to JD]
```

**Principles:**
- ✅ Lead with JD-matched achievements
- ✅ Use quantifiable metrics (성능 50% 개선, LCP 1.2s)
- ✅ Highlight must requirements in every project
- ✅ ATS-optimize: Use exact keywords from JD
- ❌ Don't include irrelevant projects
- ❌ Don't use generic descriptions

### Step 4: ContentTable Format (Current Pattern)

**Based on existing resumes:**
```tsx
<ContentTable>
  <ContentRow label="역할">
    Frontend Lead • Full-stack Development
  </ContentRow>
  <ContentRow label="기간">
    2024.08 - 2024.09 (2개월)
  </ContentRow>
  <ContentRow label="기술스택">
    React 19, TypeScript, Tailwind CSS, Framer Motion
  </ContentRow>
  <ContentRow label="주요 성과">
    - React 19 RC 최신 기능 도입으로 렌더링 성능 30% 개선
    - LCP 1.2s 달성으로 Core Web Vitals 최적화
  </ContentRow>
</ContentTable>
```

---

## Cover Letter Writing Workflow

### Step 1: Company Research

**From JD:**
```typescript
const companyProfile = {
  culture: jd.culture,           // ["코드 리뷰", "TDD", "협업"]
  domain: jd.domain,             // ["핀테크", "결제"]
  workStyle: jd.culture,         // "수평적 소통", "페어 프로그래밍"
  pain: inferPainPoints(jd)      // What they're trying to solve
}
```

### Step 2: Story Selection

**From vault/career/interview/stories.md:**
```typescript
// Find stories matching company culture
const stories = selectStories({
  culture: companyProfile.culture,
  domain: companyProfile.domain,
  achievement: 'high-impact'
})

// Example:
{
  story: "디자인시스템 구축으로 개발 생산성 2배 향상",
  relevance: "Code review culture & collaboration",
  hook: "6개 프로덕트팀이 각자 UI 컴포넌트를 만들며 겪던 비효율을 해결"
}
```

### Step 3: Cover Letter Structure

**Template:**
```markdown
# Cover Letter for [Company]

Dear [Hiring Manager],

**Hook (1-2 sentences):**
[Why this company interests you - specific, authentic]
"Stripe의 developer-first 철학과 코드 리뷰 문화는..."

**Body (2-3 paragraphs):**

**Paragraph 1: Relevant Experience**
[Story showing you've solved similar problems]
"플렉스웍에서 6개 프로덕트팀을 위한 디자인시스템을 구축하며..."

**Paragraph 2: Technical Depth**
[Demonstrate technical strength matching JD]
"React 19 RC를 실전 도입하며 성능 최적화를..."

**Paragraph 3: Cultural Fit**
[Show you match their culture]
"TDD와 페어 프로그래밍을 일상적으로 실천하며..."

**Close:**
[Call to action]
"이러한 경험을 바탕으로 Stripe의 [team]에 기여하고 싶습니다."

Best regards,
[Name]
```

**Tone Guidelines:**
- ✅ Conversational but professional
- ✅ Specific examples over generic claims
- ✅ Show enthusiasm without being excessive
- ✅ Focus on value you bring, not what you want
- ❌ Don't repeat entire resume
- ❌ Don't use clichés ("passionate", "team player")

---

## Blog Post Writing Workflow

### Step 1: Topic & Knowledge Loading

**Input:** Topic or keyword

**Process:**
```typescript
// 1. Load technical knowledge
const knowledge = await loadKnowledge('vault/knowledge/tech/react-query.md')

// 2. Find related projects
const projects = await findProjectsByTech('React Query')

// 3. Review existing posts for style
const styleGuide = await analyzeExistingPosts('apps/blog/src/posts/ko/')
```

### Step 2: Blog Post Structure

**Frontmatter:**
```yaml
---
title: "React Query 실전 활용법"
description: "YogaDay 프로젝트에서 배운 React Query 최적화 패턴"
date: "2025-12-05"
tags: ["React", "TypeScript", "React Query", "Performance"]
author: "이재일"
---
```

**Content Structure:**
```markdown
## 문제 상황
[Real project context from vault/career/history/]

예시: YogaDay 프로젝트에서 수강생 목록 조회 시 중복 요청 발생

## 해결 방법
[Knowledge from vault/knowledge/tech/]

### 1. staleTime 설정
\`\`\`typescript
// Bad: 매번 refetch
useQuery({ queryKey: ['students'], queryFn: fetchStudents })

// Good: 5분간 fresh 상태 유지
useQuery({ 
  queryKey: ['students'], 
  queryFn: fetchStudents,
  staleTime: 5 * 60 * 1000
})
\`\`\`

### 2. 캐시 전략
[Explain with code examples]

## 결과
[Quantifiable improvement]
- API 호출 70% 감소
- 페이지 로딩 시간 500ms → 150ms

## 배운 점
[Insights and best practices]
```

**Style Consistency:**
- ✅ Start with real project problem
- ✅ Code examples with comments
- ✅ Before/After comparisons
- ✅ Quantifiable results
- ✅ Practical takeaways
- ❌ Don't write pure theory without context
- ❌ Don't skip code examples

---

## Common Patterns

### Pattern 1: ATS Optimization

**Keyword Placement:**
```typescript
// Extract exact keywords from JD
const keywords = jd.must.concat(jd.nice)

// Place in:
// 1. Introduction (top priority)
// 2. Project descriptions
// 3. Skills section
// 4. Technical stack

// Example:
"5년간 React, TypeScript, Next.js 기반 프론트엔드 개발" // Matches JD exactly
```

### Pattern 2: Achievement Quantification

**Format:**
```
[Action] + [Tech/Method] + [Measurable Result]

Examples:
✅ "React 19 최신 기능 도입으로 렌더링 성능 30% 개선"
✅ "디자인시스템 구축으로 개발 생산성 2배 향상"
✅ "번들 크기 최적화로 LCP 3.5s → 1.2s 달성"

❌ "프론트엔드 개발 담당" (too vague)
❌ "성능 개선 기여" (no metrics)
```

### Pattern 3: Project Relevance Explanation

**Always explain why each project matters:**
```markdown
**DrawHatha** | 요가 수련 플랫폼
- [Achievement 1 matching requirement A]
- [Achievement 2 matching requirement B]

**Why Relevant:** 
결제 시스템 통합 경험은 Stripe의 payment domain 이해에 직접 도움이 됩니다.
```

---

## Quality Checklist

### Resume Quality
- [ ] Every project matches at least 2 JD requirements
- [ ] Achievements include quantifiable metrics
- [ ] Keywords from JD appear in introduction
- [ ] Tech stack prioritizes JD requirements
- [ ] No generic/vague descriptions
- [ ] Under 2 pages (Korean) / 1 page (English)

### Cover Letter Quality
- [ ] Specific company/role reference (not generic)
- [ ] At least 1 concrete story with results
- [ ] Matches company culture indicators
- [ ] Under 400 words
- [ ] Natural, conversational tone
- [ ] Clear value proposition

### Blog Post Quality
- [ ] Starts with real project problem
- [ ] Includes working code examples
- [ ] Quantifiable results/improvements
- [ ] Practical takeaways
- [ ] Consistent with existing post style
- [ ] Proper frontmatter with tags

---

## Resources

When you need more detailed guidance:
- `resume-templates.md` - Resume structure variations
- `storytelling.md` - Effective story patterns for cover letters
- `ats-optimization.md` - ATS keyword strategies
- `blog-style-guide.md` - Detailed blog writing guidelines

---

## Summary

✅ **Resume:** JD analysis → Project matching → Tailored composition  
✅ **Cover Letter:** Company research → Story selection → Narrative structure  
✅ **Blog Post:** Knowledge loading → Real examples → Practical insights  
✅ Always use vault references - never write from scratch  
✅ Quantify achievements with specific metrics  
✅ Match JD keywords for ATS optimization  
✅ Show, don't tell - use concrete examples  
✅ Keep consistent with existing document patterns
