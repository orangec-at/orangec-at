# Write Blog Post

Create a technical blog post using vault knowledge and project examples.

## Task

1. **Load reference-library skill**
2. **Load writing-assistant skill**
3. **Load knowledge:** Search `vault/knowledge/tech/` for topic
4. **Find examples:** Search `vault/career/history/` for related projects
5. **Check style:** Review `apps/blog/src/posts/ko/` for existing style
6. **Write post:** Create `apps/blog/src/posts/ko/${1:slug}.mdx`

## Structure

```mdx
---
title: "${1:title}"
description: "[1-2 sentence summary]"
date: "[today]"
tags: ["${2:tag1}", "${3:tag2}", "${4:tag3}"]
---

## 문제 상황
[Real project context from vault/career/history/]

예시: [Project name]에서 [problem]를 겪음

## 해결 방법
[Knowledge from vault/knowledge/tech/]

### 1. [Solution approach 1]
\`\`\`typescript
// Bad: [problem code]

// Good: [solution code]
\`\`\`

### 2. [Solution approach 2]
[Explain with code examples]

## 결과
[Quantifiable improvement]
- [Metric 1]: [before] → [after]
- [Metric 2]: [before] → [after]

## 배운 점
[Insights and best practices]

1. [Learning 1]
2. [Learning 2]
3. [Learning 3]
```

## Style Guidelines

- ✅ Start with real project problem
- ✅ Code examples with comments
- ✅ Before/After comparisons
- ✅ Quantifiable results
- ✅ Practical takeaways
- ❌ Don't write pure theory
- ❌ Don't skip code examples

## Success Criteria

- [ ] Real project context (not hypothetical)
- [ ] Working code examples
- [ ] Quantifiable results
- [ ] Practical takeaways
- [ ] Consistent with existing style
- [ ] Proper frontmatter with tags

---

**Topic:** ${1:topic}
**Slug:** ${1:slug}
