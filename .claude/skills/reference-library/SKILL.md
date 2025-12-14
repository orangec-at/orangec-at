# Reference Library Skill

**Purpose:** Automatically load and reference documents from vault/ for context-aware writing

**Tech Stack:** vault/ knowledge base • JD analysis • Project matching • Knowledge retrieval

---

## Quick Start Checklists

### Using References for Resume Writing
- [ ] Read JD (Job Description) JSON from vault/career/applications/
- [ ] Analyze must/nice requirements
- [ ] Search vault/career/history/ for matching projects
- [ ] Load project details from apps/blog/documents/resumes/data/
- [ ] Cross-reference with specialized-expertise.md

### Using References for Blog Writing
- [ ] Identify topic and technical domain
- [ ] Search vault/knowledge/tech/ for relevant knowledge
- [ ] Load related project experience from vault/career/history/
- [ ] Reference existing blog posts for style consistency

---

## Core Principles

### 1. Progressive Reference Loading

**Strategy:** Load only what's needed, when it's needed

**Pattern:**
```
1. Identify writing context (resume/cover-letter/blog)
2. Determine required references
3. Load minimal set first
4. Expand as needed
```

**Example:**
```
Writing resume for Company X
  ↓
Load: vault/career/applications/X/jd.json (JD analysis)
  ↓
Match: Search vault/career/history/ for keywords
  ↓
Detail: Load matched project files
  ↓
Enhance: Load specialized-expertise.md if needed
```

### 2. Vault Directory Structure

**Career References:**
```
vault/career/
├── history/                    # Detailed project history
│   ├── PROJECT_SUMMARY.md      # Overview of all projects
│   ├── PROJECT_SUMMARY_EN.md   # English version
│   ├── 2024-08_YogaDay.md
│   ├── 2024-03_DrawHatha.md
│   ├── 2023-06_MIDAS-CIVIL_웹뷰.md
│   └── ...
├── applications/               # Company-specific applications
│   ├── [company-name]/
│   │   ├── [company]-jd.json  # Structured JD analysis
│   │   ├── [company]-resume.md
│   │   └── [company]-cover-letter.md
│   └── ...
├── resume-en.md               # General English resume
├── resume-typescript-fullstack.md
└── specialized-expertise.md   # Core competencies
```

**Knowledge Base:**
```
vault/knowledge/
├── tech/                      # Technical knowledge
│   ├── claude-code/          # Claude Code expertise
│   ├── react-query.md
│   ├── rag.md
│   └── system.md
├── business/                  # Business knowledge
│   └── self-marketing.md
└── life/                      # Life wisdom
    └── choice-decision-acceptance.md
```

### 3. JD (Job Description) JSON Schema

**Structure:**
```json
{
  "title": "Frontend Engineer_운영플랫폼",
  "company": "두나무",
  "summary": "업비트 통합 어드민/운영 플랫폼 개발",
  "must": [
    "React", "TypeScript", "Next.js", 
    "재사용 UI 컴포넌트 설계", "성능 최적화"
  ],
  "nice": [
    "5년 이상 웹 서비스 FE 경력",
    "테스트 자동화 (Unit/Visual/E2E)",
    "Webpack/Vite 빌드 최적화"
  ],
  "culture": ["코드 리뷰", "TDD", "페어 프로그래밍"],
  "domain": ["운영", "컴플라이언스", "어드민"],
  "location": "서울시 서초구 강남대로 369",
  "process": ["서류전형", "사전과제", "1차면접", "2차면접"],
  "notes": ["수습 3개월"]
}
```

### 4. Project Matching Algorithm

**Step 1: Extract Keywords from JD**
```typescript
const extractKeywords = (jd: JD) => {
  return {
    tech: [...jd.must, ...jd.nice].filter(isTechStack),
    domain: jd.domain,
    culture: jd.culture
  }
}
```

**Step 2: Search Project History**
```typescript
const searchProjects = (keywords: Keywords) => {
  // Search in vault/career/history/*.md
  // Match based on:
  // 1. Tech stack (React, TypeScript, etc.)
  // 2. Domain (admin, e-commerce, etc.)
  // 3. Project type (optimization, component library, etc.)
}
```

**Step 3: Rank by Relevance**
```typescript
const rankProjects = (projects: Project[], jd: JD) => {
  return projects.map(p => ({
    project: p,
    score: calculateRelevance(p, jd),
    matchedRequirements: getMatches(p, jd.must)
  })).sort((a, b) => b.score - a.score)
}
```

### 5. Resume Data JSON Structure

**experiences.json:**
```json
[
  {
    "company": "플렉스웍",
    "period": "2022.01 - 2024.09",
    "role": "Frontend Developer",
    "team": "프론트엔드팀",
    "projects": ["project-1-id", "project-2-id"]
  }
]
```

**projects.json:**
```json
[
  {
    "id": "yogaday",
    "name": "YogaDay",
    "period": "2024.08 - 2024.09",
    "tech": ["React 19", "TypeScript", "Tailwind CSS"],
    "role": "Frontend Lead",
    "achievements": [
      "React 19 RC 최신 기능 도입",
      "성능 최적화로 LCP 1.2s 달성"
    ],
    "details": "..."
  }
]
```

---

## Reference Loading Patterns

### Pattern 1: Resume Writing

```markdown
**Context:** Writing resume for Company X

**Load Sequence:**
1. Read `vault/career/applications/X/X-jd.json`
2. Extract must/nice requirements
3. Search `vault/career/history/` for keyword matches
4. Load `apps/blog/documents/resumes/data/projects.json`
5. Cross-reference with `vault/career/specialized-expertise.md`

**Output:** Ranked list of relevant projects with justification
```

### Pattern 2: Cover Letter Writing

```markdown
**Context:** Writing cover letter for Company X

**Load Sequence:**
1. Read JD for culture/domain understanding
2. Search `vault/career/interview/stories.md` for relevant stories
3. Load matching projects from history/
4. Reference `vault/decisions/` for career motivation

**Output:** Story-based narrative matching company culture
```

### Pattern 3: Blog Post Writing

```markdown
**Context:** Writing technical blog post about React Query

**Load Sequence:**
1. Read `vault/knowledge/tech/react-query.md`
2. Search `vault/career/history/` for projects using React Query
3. Load existing posts from `apps/blog/src/posts/` for style
4. Reference `vault/knowledge/tech/system.md` for architecture context

**Output:** Technical post with real project examples
```

---

## Common Operations

### Operation 1: Analyze JD

**Input:** Company name or JD file path

**Process:**
```typescript
// 1. Read JD JSON
const jd = await readJD('vault/career/applications/stripe/stripe-jd.json')

// 2. Extract requirements
const requirements = {
  technical: jd.must.filter(isTech),
  soft: jd.must.filter(isSoft),
  preferred: jd.nice
}

// 3. Analyze domain and culture
const context = {
  domain: jd.domain,
  culture: jd.culture,
  workStyle: inferWorkStyle(jd)
}

// 4. Return analysis
return { requirements, context }
```

### Operation 2: Match Projects

**Input:** JD requirements

**Process:**
```typescript
// 1. Search project history
const allProjects = await loadProjectHistory()

// 2. Calculate relevance scores
const scored = allProjects.map(project => ({
  project,
  score: {
    tech: matchTechStack(project.tech, requirements.technical),
    domain: matchDomain(project.domain, context.domain),
    impact: evaluateImpact(project.achievements)
  }
}))

// 3. Rank and filter
const topMatches = scored
  .sort((a, b) => totalScore(b) - totalScore(a))
  .slice(0, 5)

// 4. Return with justification
return topMatches.map(m => ({
  ...m.project,
  whyRelevant: explainMatch(m.project, requirements)
}))
```

### Operation 3: Load Knowledge

**Input:** Topic or keyword

**Process:**
```typescript
// 1. Search knowledge base
const techKnowledge = await searchVault('vault/knowledge/tech/', topic)
const businessKnowledge = await searchVault('vault/knowledge/business/', topic)

// 2. Load related projects
const relatedProjects = await findProjectsByTech(topic)

// 3. Return structured knowledge
return {
  theory: techKnowledge,
  practice: relatedProjects,
  insights: businessKnowledge
}
```

---

## File Path Patterns

### Vault Paths
- JD: `vault/career/applications/{company}/{company}-jd.json`
- Projects: `vault/career/history/*.md`
- Knowledge: `vault/knowledge/{category}/*.md`
- Expertise: `vault/career/specialized-expertise.md`

### Blog Document Paths
- Resume: `apps/blog/documents/resumes/{company}.mdx`
- Cover Letter: `apps/blog/documents/cover-letters/cv-{company}.mdx`
- Resume Data: `apps/blog/documents/resumes/data/{experiences|projects}.json`
- Blog Posts: `apps/blog/src/posts/{ko|en}/*.mdx`

---

## Best Practices

### 1. Always Read JD First
```typescript
// ✅ Good
const jd = await readJD(company)
const matches = await matchProjects(jd)

// ❌ Bad: Matching without JD analysis
const matches = await matchProjects(company)
```

### 2. Progressive Loading
```typescript
// ✅ Good: Load incrementally
const jd = await readJD()           // Small JSON
const summary = await readSummary() // Overview only
// ... then load details if needed

// ❌ Bad: Load everything upfront
const allProjects = await readAllHistoryFiles()
```

### 3. Explain Matches
```typescript
// ✅ Good: Provide reasoning
return {
  project: "YogaDay",
  whyRelevant: "Matches 3/5 must requirements: React 19, TypeScript, Performance optimization"
}

// ❌ Bad: Just return project
return { project: "YogaDay" }
```

### 4. Cross-Reference Data
```typescript
// ✅ Good: Validate consistency
const vaultProject = await read('vault/career/history/YogaDay.md')
const dataProject = projects.find(p => p.id === 'yogaday')
validateConsistency(vaultProject, dataProject)
```

---

## Resources

When you need more detailed guidance on specific topics, request:
- `jd-analysis.md` - Deep JD analysis techniques
- `project-matching.md` - Advanced matching algorithms
- `knowledge-retrieval.md` - Semantic search strategies
- `data-validation.md` - Ensuring vault/blog data consistency

---

## Summary

✅ Load JD JSON from vault/career/applications/  
✅ Analyze must/nice requirements and culture fit  
✅ Search vault/career/history/ for relevant projects  
✅ Rank by relevance score (tech + domain + impact)  
✅ Cross-reference with apps/blog/documents/resumes/data/  
✅ Use vault/knowledge/ for technical blog posts  
✅ Progressive loading: minimal first, expand as needed  
✅ Always explain why projects match requirements
