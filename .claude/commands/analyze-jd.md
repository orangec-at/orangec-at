# Analyze Job Description

Analyze JD and match with relevant projects from vault.

## Task

1. **Load reference-library skill**
2. **Read JD:** `vault/career/applications/${1:company}/${1:company}-jd.json`
3. **Extract requirements:**
   - Must-have skills (technical + soft)
   - Nice-to-have qualifications
   - Culture indicators
   - Domain knowledge
4. **Match projects:** Search vault/career/history/ for relevant projects
5. **Rank by relevance:** Score based on tech + domain + impact
6. **Provide analysis:**
   - JD summary
   - Top 5 matched projects with justification
   - Gap analysis (what's missing)
   - Recommendations (which projects to highlight)

## Output Format

```markdown
# JD Analysis: ${1:company}

## Position
[title from JD]

## Must-Have Requirements (Critical)
1. [Requirement] - ✅/⚠️/❌ Match status
2. [Requirement] - ✅/⚠️/❌ Match status
...

## Nice-to-Have (Preferred)
1. [Qualification] - ✅/⚠️/❌ Match status
...

## Culture & Domain
- Culture: [culture keywords]
- Domain: [domain keywords]
- Work Style: [inferred work style]

---

## Matched Projects (Top 5)

### 1. [Project Name] | Score: 0.92
**Why Relevant:**
- Matches: [requirement 1], [requirement 2], [requirement 3]
- Tech: [matching tech stack]
- Impact: [quantifiable achievement]

**Justification:**
[Explain why this project is highly relevant]

### 2. [Project Name] | Score: 0.85
...

---

## Gap Analysis

**Strong Match:** [areas where you excel]
**Moderate Match:** [areas with partial experience]
**Gaps:** [skills to mention indirectly or learn]

---

## Recommendations

1. **Lead with:** [Project 1] and [Project 2] - strongest matches
2. **Highlight:** [specific achievements] to address must-haves
3. **Mention:** [skills] to fill gaps
4. **Emphasize:** [culture fit aspects]
```

---

**Company:** ${1:company}
