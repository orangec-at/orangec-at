---
name: learning-tracker
description: Manage personal knowledge with TIL entries, reading notes, learning logs, and Second Brain system for continuous growth
---

# Learning Tracker

Build a Second Brain to capture, organize, and grow your knowledge systematically.

---

## When to Use This Skill

**Perfect for**:
- Creating TIL (Today I Learned) entries
- Taking book/article notes
- Managing learning goals
- Building a Second Brain / Zettelkasten
- Tracking technical skills growth
- Organizing ideas and insights

**Triggers**: TIL, learning log, book notes, Second Brain, knowledge management

---

## Core Principles

### 1. **Capture Everything**
Your brain is for thinking, not storing. Write it down.

### 2. **Connect Ideas**
Isolated notes are useless. Link related concepts.

### 3. **Review Regularly**
Knowledge decays. Review weekly.

### 4. **Make It Actionable**
Every note should lead to action or insight.

---

## Workflow 1: TIL (Today I Learned)

**Goal**: Capture daily learnings

### Daily Template

\`\`\`markdown
# TIL - [Date]

## [Topic/Technology]

**Context**: [What were you working on?]

**What I Learned**:
- [Key insight 1]
- [Key insight 2]
- [Key insight 3]

**Code Example** (if applicable):
\`\`\`[language]
// Example demonstrating the learning
\`\`\`

**Why It Matters**: [Practical application]

**Links**: [Related docs, articles]

**Next Steps**: [What to explore next]
\`\`\`

---

### Example TIL

\`\`\`markdown
# TIL - 2025-01-15

## React Server Components

**Context**: Migrating blog to Next.js 14 App Router

**What I Learned**:
- Server Components render on server, reducing client bundle
- Can't use useState/useEffect in Server Components
- Mix Server + Client Components in same tree

**Code Example**:
\`\`\`tsx
// Server Component (default in App Router)
async function BlogPost({ slug }) {
  const post = await fetchPost(slug); // Direct DB access!
  return <Article post={post} />;
}
\`\`\`

**Why It Matters**: Reduces bundle size by 40%, improves initial load

**Links**: 
- [Next.js Docs](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

**Next Steps**: Learn streaming and Suspense integration
\`\`\`

---

## Workflow 2: Book/Article Notes

**Goal**: Capture and apply insights from reading

### Template

\`\`\`markdown
# [Book/Article Title]

**Author**: [Name]
**Date Read**: [Date]
**Rating**: ⭐⭐⭐⭐ (4/5)

## Summary (3 sentences)
[Brief overview of main thesis]

## Key Takeaways
1. **[Insight 1]**: [Explanation]
   - Action: [How to apply]

2. **[Insight 2]**: [Explanation]
   - Action: [How to apply]

3. **[Insight 3]**: [Explanation]
   - Action: [How to apply]

## Favorite Quotes
> "[Quote that resonated]"

> "[Another impactful quote]"

## My Thoughts
[Personal reflections, agreements, disagreements]

## Action Items
- [ ] [Specific action from learning]
- [ ] [Another action]

## Related To
- [[Other note or concept]]
- [[Related book/article]]
\`\`\`

---

## Workflow 3: Second Brain Setup

**Goal**: Build a sustainable knowledge system

### PARA Method

**P - Projects**: Active work with deadlines
**A - Areas**: Ongoing responsibilities
**R - Resources**: Topics of interest
**A - Archives**: Completed/inactive

### Folder Structure

\`\`\`
vault/
├── projects/          # Active projects
│   ├── blog-redesign/
│   └── portfolio-update/
├── areas/             # Ongoing areas
│   ├── career/
│   ├── learning/
│   └── health/
├── resources/         # Reference material
│   ├── frontend/
│   ├── backend/
│   └── productivity/
└── archives/          # Completed items
\`\`\`

---

### Linking Strategy

**Create connections**:
\`\`\`markdown
## React Server Components

Related: [[Next.js App Router]], [[Bundle Optimization]]

Builds on: [[React Fundamentals]]
Enables: [[Streaming and Suspense]]
\`\`\`

---

## Workflow 4: Learning Goals Tracking

**Goal**: Systematic skill development

### Template

\`\`\`markdown
# Q1 2025 Learning Goals

## Primary Goal: Master Next.js 14

**Why**: Needed for current project + high job demand

**Success Criteria**:
- [ ] Build 3 production apps with App Router
- [ ] Understand Server Components deeply
- [ ] Write 5 blog posts teaching concepts
- [ ] Contribute to Next.js docs/community

**Resources**:
- Next.js docs
- Lee Robinson videos
- FrontendMasters course

**Timeline**: Jan-Mar 2025

**Weekly Actions**:
- Mon: Read 1 doc page
- Wed: Build feature using new concept
- Fri: Write TIL or mini-tutorial

## Secondary Goal: TypeScript Advanced Patterns

[Similar structure]
\`\`\`

---

## Reference Files

1. **references/til-system.md** - Daily learning capture
2. **references/second-brain-setup.md** - PARA method and linking
3. **references/reading-notes-guide.md** - Book/article processing

---

## Assets

1. **assets/til-template.md** - Copy-paste TIL structure
2. **assets/learning-goal-template.md** - Quarterly goal tracking

---

## Integration

**With Portfolio Consultant**:
- Learning notes → Blog post ideas
- TILs → Project showcases

**With Resume Builder**:
- Skills tracked → Resume skills section
- Learning goals → "Currently learning" on resume

---

## Quality Checklist

**Good TIL**:
- [ ] Specific (not "learned React")
- [ ] Actionable insight
- [ ] Code example if technical
- [ ] Practical application noted
- [ ] Links to references

**Good Book Notes**:
- [ ] 3-5 key takeaways
- [ ] Action items for each
- [ ] Personal reflections
- [ ] Links to related concepts

---

지식을 체계적으로 쌓고 성장하세요! 📚
