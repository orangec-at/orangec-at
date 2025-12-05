# Write Resume for Company

Create a tailored resume based on job description and vault references.

## Task

1. **Load reference-library skill** (if not already loaded)
2. **Read JD:** `vault/career/applications/${1:company}/${1:company}-jd.json`
3. **Analyze requirements:** Extract must/nice requirements, culture, domain
4. **Match projects:** Find top 3-5 relevant projects from vault/career/history/
5. **Load data:** Read `apps/blog/documents/resumes/data/projects.json`
6. **Write resume:** Create `apps/blog/documents/resumes/${1:company}.mdx`

## Output Format

Use ContentTable pattern (see existing resumes):

```mdx
---
title: "이재일 | Frontend Engineer"
company: "${1:company}"
position: "[position from JD]"
date: "[today]"
---

<PersonalInfo ... />

<Introduction>
[2-3 sentences highlighting JD match]
</Introduction>

<ContentTable>
  <ContentRow label="프로젝트">[Project Name]</ContentRow>
  <ContentRow label="기간">[Period]</ContentRow>
  <ContentRow label="기술스택">[Tech matching JD]</ContentRow>
  <ContentRow label="주요 성과">
    - [Achievement matching must requirement]
    - [Quantifiable result]
  </ContentRow>
</ContentTable>
```

## Success Criteria

- [ ] Every project matches ≥2 JD requirements
- [ ] Achievements include quantifiable metrics
- [ ] Keywords from JD appear in introduction
- [ ] Tech stack prioritizes JD requirements
- [ ] Under 2 pages

---

**Company:** ${1:company}
