# Write Cover Letter

Create a compelling cover letter based on company research and relevant stories.

## Task

1. **Load reference-library skill**
2. **Load writing-assistant skill**
3. **Read JD:** Understand culture, domain, pain points
4. **Select story:** Find 1-2 relevant stories from vault/career/interview/stories.md
5. **Write cover letter:** Create `apps/blog/documents/cover-letters/cv-${1:company}.mdx`

## Structure

```markdown
---
title: "Cover Letter for ${1:company}"
company: "${1:company}"
date: "[today]"
---

Dear Hiring Manager,

**Hook (1-2 sentences):**
[Why this company interests you - specific, authentic]

**Body Paragraph 1: Relevant Experience**
[Story showing you've solved similar problems]
- Context: What was the challenge?
- Action: What did you do?
- Result: What was the impact?

**Body Paragraph 2: Technical Depth**
[Demonstrate technical strength matching JD]
- Specific tech/methodology from JD
- Concrete example from experience
- Quantifiable result

**Body Paragraph 3: Cultural Fit**
[Show you match their culture]
- Reference specific culture aspects from JD
- Example of practicing those values
- How you'd contribute

**Close:**
[Call to action]

Best regards,
이재일
```

## Tone Guidelines

- ✅ Conversational but professional
- ✅ Specific examples over generic claims
- ✅ Show enthusiasm without being excessive
- ✅ Focus on value you bring
- ❌ Don't repeat entire resume
- ❌ Don't use clichés

## Success Criteria

- [ ] Specific company/role reference (not generic)
- [ ] At least 1 concrete story with results
- [ ] Matches company culture indicators
- [ ] Under 400 words
- [ ] Natural, conversational tone

---

**Company:** ${1:company}
