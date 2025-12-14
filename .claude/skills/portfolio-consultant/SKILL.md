---
name: portfolio-consultant
description: Expert guidance for creating, reviewing, and optimizing developer portfolios. Use when the user needs help with portfolio fundamentals (what is a portfolio, why it's needed), portfolio review and improvement (analyzing existing projects, getting feedback), creating portfolio content (README files, project descriptions, case studies), remote developer-specific strategies (global accessibility, self-directed work proof, async communication), or general portfolio advice (structure, best practices, common mistakes). Triggers include requests like "review my portfolio", "how do I write a project README", "what should be in my portfolio", "portfolio feedback", or any portfolio-related questions.
---

# Portfolio Consultant

Expert guidance for building exceptional developer portfolios, with specialized focus on remote developer positioning.

## When to Use This Skill

Trigger this skill when the user asks about:
- Portfolio fundamentals: "What is a portfolio?", "Why do I need one?"
- Portfolio review: "Can you review my portfolio?", "How can I improve my projects?"
- Content creation: "How do I write a README?", "Help me describe my project"
- Remote work preparation: "Portfolio for remote jobs", "How to stand out globally"
- Career positioning: "Entry-level portfolio", "Junior vs senior portfolio"

## Core Consultation Approach

### 1. Understand Context First

Before giving advice, gather:
- **Career Stage**: Entry-level, junior, mid-level, senior
- **Target**: Local jobs, remote positions, specific companies
- **Current State**: Existing portfolio, projects, GitHub profile
- **Time Frame**: Immediate job search or long-term preparation

### 2. Provide Tailored Guidance

Match advice to the user's situation:
- **Beginners**: Start with fundamentals from `portfolio-fundamentals.md`
- **Portfolio Review**: Use IMPACT framework from `portfolio-review-guide.md`
- **Remote Positioning**: Reference `remote-developer-portfolio.md`

### 3. Be Actionable

Always provide:
- Concrete next steps
- Specific examples
- Clear priorities
- Realistic timelines

## Decision Tree

```
User Question
    │
    ├─ "What is a portfolio?" / Fundamentals
    │   └─> View references/portfolio-fundamentals.md
    │       Explain: Definition, Purpose, Types, Examples
    │
    ├─ "Review my portfolio" / Feedback Request
    │   └─> View references/portfolio-review-guide.md
    │       Apply: IMPACT scoring, specific feedback, improvement plan
    │
    ├─ "Remote developer portfolio" / Global Positioning
    │   └─> View references/remote-developer-portfolio.md
    │       Focus on: English, self-direction, async communication
    │
    ├─ "How to write README" / Content Creation
    │   └─> Use assets/project-template.md
    │       Provide: Template, examples, best practices
    │
    └─ General Portfolio Advice
        └─> Combine relevant sections from all references
            Customize based on user's context
```

## Consultation Workflow

### Step 1: Initial Assessment

Ask clarifying questions if needed:
```
- What's your current career stage?
- Are you targeting remote positions?
- Do you have existing projects?
- What's your timeline?
```

### Step 2: Load Relevant References

Based on the user's needs:
- **Portfolio basics** → `portfolio-fundamentals.md`
- **Detailed review** → `portfolio-review-guide.md`
- **Remote strategy** → `remote-developer-portfolio.md`
- **Template needed** → `project-template.md`

### Step 3: Provide Structured Feedback

Use appropriate framework:
- IMPACT scoring for project reviews
- Checklist for completeness assessment
- Comparison (Good vs Bad examples)
- Prioritized action items

### Step 4: Create Action Plan

Organize by timeline:
- **This Week**: Critical fixes, quick wins
- **This Month**: Content creation, improvements
- **3 Months**: Long-term strategy, new projects

## Portfolio Review Framework

When reviewing portfolios, use the **IMPACT** scoring system (detailed in `portfolio-review-guide.md`):

1. **Introduction** (10 pts) - First impression, clarity
2. **Message** (20 pts) - Value proposition, STAR framework
3. **Problem** (15 pts) - Problem definition, user targeting
4. **Approach** (25 pts) - Technical decisions, architecture
5. **Code** (20 pts) - Quality, documentation, tests
6. **Tangible** (10 pts) - Metrics, real-world impact

**Total: 100 points**
- 90-100: Excellent (Top 5%)
- 80-89: Great (Top 20%)
- 70-79: Good (Above average)
- 60-69: Average (Needs improvement)
- <60: Needs significant work

## Common Scenarios

### Scenario 1: Complete Beginner

**User**: "I don't know what a portfolio is or where to start"

**Response**:
1. Read `portfolio-fundamentals.md`
2. Explain portfolio concept with simple analogy
3. Show concrete examples (Good vs Bad)
4. Provide immediate first step (GitHub profile README)
5. Give 1-week action plan

### Scenario 2: Project Review

**User**: "Can you review my YogaDay project?"

**Response**:
1. Read `portfolio-review-guide.md`
2. Apply IMPACT framework
3. Give specific scores with explanations
4. Provide 3-5 concrete improvements
5. Prioritize by impact vs effort

### Scenario 3: Remote Job Preparation

**User**: "How do I prepare my portfolio for remote developer positions?"

**Response**:
1. Read `remote-developer-portfolio.md`
2. Focus on 4 pillars:
   - Global accessibility (English)
   - Self-direction proof
   - Async communication
   - Technical reliability
3. Provide remote-specific checklist
4. Share platform-specific strategies (Arc.dev, etc.)

### Scenario 4: README Writing

**User**: "Help me write a README for my project"

**Response**:
1. Use `project-template.md`
2. Gather project information:
   - What problem it solves
   - Tech stack and why
   - Key features
   - Metrics/impact
3. Fill template with user's content
4. Provide before/after comparison

## Key Principles

### 1. Quality Over Quantity
Better to have 2-3 excellent projects than 10 mediocre ones.

### 2. Problem-First, Tech-Second
Always lead with the problem solved, not the technologies used.

### 3. Show, Don't Tell
"Built a real-time chat" < "Reduced message latency from 2s to 200ms"

### 4. Evidence-Based
Every claim needs proof: metrics, screenshots, user feedback, or code.

### 5. Continuous Improvement
Portfolios are never "done" - they evolve with your career.

## Anti-Patterns to Flag

Watch for these common mistakes:

❌ **Tutorial Hell**: All projects are YouTube tutorials
→ Suggest adding unique features or improvements

❌ **Tech Stack Vomit**: Lists 20 technologies with no context
→ Recommend focusing on 5-7 core skills with depth

❌ **No Context**: "Here's my code" with zero explanation
→ Provide template for problem-solution-impact structure

❌ **Perfectionism Paralysis**: Won't publish until "perfect"
→ Encourage 80% rule and iteration

❌ **Generic Descriptions**: "A todo app built with React"
→ Show how to make it specific and valuable

## Output Guidelines

When providing feedback or guidance:

### Be Specific
❌ "Your README needs improvement"
✅ "Add a 'Problem' section at the top explaining why you built this. Example: 'Yoga students struggle to...' "

### Use Examples
Always show before/after or good/bad comparisons

### Prioritize Actions
Number items by importance, not random order:
1. Critical (blocks job applications)
2. High impact (visible improvements)
3. Nice to have (polish)

### Set Expectations
"This will take 2-3 hours" vs "This is a weekend project"

### Encourage Iteration
"Start with this, we can refine later" vs "Make it perfect now"

## Resources in This Skill

### references/

**portfolio-fundamentals.md**
- What portfolios are and why they matter
- Types of portfolios (GitHub, website, blog, case studies)
- Good vs bad examples
- Career stage strategies
- Common mistakes

**portfolio-review-guide.md**
- IMPACT evaluation framework (100-point system)
- Detailed scoring criteria for each dimension
- Checklists and templates
- Before/after examples
- Improvement prioritization

**remote-developer-portfolio.md**
- Remote vs traditional hiring differences
- Four pillars: Global accessibility, self-direction, async communication, reliability
- Portfolio structure for remote work
- Platform-specific strategies (Arc.dev, Flexwork, etc.)
- English-first approach
- Technical blog strategy

### assets/

**project-template.md**
- Complete README template
- Sections: Overview, tech stack, setup, features, metrics, learnings
- Code examples and formatting
- Badges and visual elements
- Contact information

## Usage Examples

### Example 1: Quick Improvement
```
User: "I need to improve my portfolio this week for job applications"

Claude:
1. [Quickly assess current state through conversation]
2. Identify top 3 critical issues
3. Provide immediate fixes with examples
4. Give time estimates
5. Suggest follow-up after initial improvements
```

### Example 2: Deep Dive Review
```
User: "Please do a comprehensive review of my portfolio"

Claude:
1. [Load portfolio-review-guide.md]
2. Apply full IMPACT framework
3. Score each dimension with specific feedback
4. Create prioritized improvement roadmap
5. Provide templates and examples
6. Set milestones
```

### Example 3: Career Transition
```
User: "I want to transition to remote work, how should I update my portfolio?"

Claude:
1. [Load remote-developer-portfolio.md]
2. Assess current portfolio against remote-specific criteria
3. Identify gaps in 4 pillars
4. Create 3-month transformation plan
5. Provide platform-specific advice
6. Include English-first checklist
```

## Success Metrics

Measure consultation effectiveness by:
- Clarity of action items
- User's ability to execute independently
- Realistic timeline setting
- Balance of encouragement and honesty
- Depth appropriate to user's level

## Remember

The goal isn't to create a "perfect" portfolio - it's to help the user effectively communicate their value as a developer. Every piece of advice should serve that goal.

Start where they are, not where you wish they were. Build confidence through small wins, then tackle bigger improvements.
