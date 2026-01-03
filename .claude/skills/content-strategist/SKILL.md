---
name: content-strategist
description: Strategic content planning with monthly calendars, topic clusters, and trending topic identification. Plan blog content strategy aligned with business goals using data-driven topic selection.
---

# Content Strategist

Plan comprehensive blog content strategy with calendars, topic clusters, and data-driven topic selection.

**Works With:** WebSearch MCP (trending topics, content gaps) • seo-optimizer (keyword validation) • apps/blog/ content

---

## When to Use This Skill

- Creating monthly content calendars
- Building topic clusters for SEO authority
- Identifying trending topics in your niche
- Content gap analysis
- Strategic content planning for growth
- Balancing content types and themes

---

## Core Principles

### 1. Audience-First Thinking
Who are you writing for? What problems do they face?

### 2. Topic Cluster Architecture
Pillar content + supporting cluster posts for topical authority

### 3. Strategic Consistency
Regular publishing schedule builds momentum

### 4. Data-Driven Decisions
Analytics + trends guide what to create

---

## Monthly Content Calendar Workflow

**Goal**: Plan 12-16 posts per month (3-4 per week)

### Step 1: Analyze Existing Content

**Questions to Answer**:
- What topics performed well? (check analytics)
- What's missing? (content gaps)
- What projects can be showcased?
- What's outdated and needs refreshing?

**Use WebSearch**:
```
site:yourdomain.com/blog [topic]
```

### Step 2: Research Trending Topics

**WebSearch Queries**:
```
"react 2025 trends"
"next.js 15 new features"
"[your tech] best practices 2025"
"[your niche] predictions"
"what's new in [tech]"
```

**Check**:
- Tech announcements (React 19, Next.js 15, etc.)
- Industry needs and pain points
- Seasonal topics (year-end reviews, Q1 planning)
- Framework/tool updates

### Step 3: Balance Content Types

**Distribution** (per month):
- **40% Educational** (tutorials, guides, how-tos)
- **30% Project Showcases** (portfolio pieces, case studies)
- **20% Opinion/Insights** (thought leadership, analysis)
- **10% Industry News** (trending topics, updates)

**Example Month**:
- Week 1: React Tutorial (Educational)
- Week 2: YogaDay Project Deep Dive (Showcase)
- Week 3: State Management in 2025 (Opinion)
- Week 4: Next.js 15 Features (Industry News)

### Step 4: Create Calendar

Use template from `assets/calendar-template.md`

**Plan Each Post**:
- Title (working title)
- Primary keyword
- Content type
- Target word count
- Publishing date
- Related posts for internal linking

---

## Topic Cluster Strategy

### What is a Topic Cluster?

**Structure**:
```
Pillar Content: "Complete React Performance Guide" (3000+ words)
├── Cluster 1: "React.memo vs useMemo: When to Use"
├── Cluster 2: "Virtual Scrolling for Large Lists"
├── Cluster 3: "Code Splitting with React.lazy"
├── Cluster 4: "React Profiler Deep Dive"
└── Cluster 5: "Performance Metrics That Matter"
```

**Benefits**:
- Internal linking boosts SEO (search engines see topical authority)
- Comprehensive coverage builds expertise reputation
- Each cluster post drives traffic to pillar
- Easy content repurposing (pillar → multiple clusters)

### Creating Topic Clusters

**Step 1: Choose Pillar Topic**

Criteria:
- Broad enough for 8-10 subtopics
- High search volume
- Core to your expertise
- Aligns with business goals

Examples:
- "Complete Next.js Guide"
- "React State Management Masterclass"
- "Full-Stack Development Best Practices"

**Step 2: Identify Cluster Topics**

Use WebSearch:
```
"[pillar topic] subtopics"
"[pillar topic] common questions"
"[pillar topic] advanced techniques"
```

Look for:
- Frequently asked questions
- Specific techniques/patterns
- Common problems/solutions
- Tool/library comparisons

**Step 3: Plan Publishing Schedule**

**Option A - Sequential**:
- Week 1: Publish pillar content
- Weeks 2-10: Publish one cluster post per week
- Link each cluster back to pillar

**Option B - Gradual**:
- Month 1: Publish pillar
- Months 2-4: Publish 2-3 clusters per month
- Allows for feedback and adjustments

---

## Content Scoring Matrix

Evaluate potential topics on 4 dimensions (1-5 scale each):

### 1. Relevance (Audience Match)
- **5**: Perfect match for target audience (frontend devs)
- **3**: Somewhat relevant
- **1**: Off-topic or marginal interest

### 2. Uniqueness (Differentiation)
- **5**: Provides completely unique insights or angle
- **3**: Some unique value, mostly covered elsewhere
- **1**: Duplicate of existing content

### 3. SEO Potential (Ranking Opportunity)
- **5**: High search volume + achievable ranking
- **3**: Moderate volume or tough competition
- **1**: Low volume or impossible to rank

### 4. Career Value (Portfolio Building)
- **5**: Showcases advanced skills, impressive to employers
- **3**: Demonstrates competence
- **1**: Basic skill, limited portfolio value

**Score Interpretation**:
- **16-20**: High Priority - Create ASAP
- **11-15**: Medium Priority - Add to calendar
- **6-10**: Low Priority - Consider if capacity
- **Below 6**: Skip - Not worth the effort

**Example Scoring**:

Topic: "Building a Real-Time Chat with Next.js and WebSockets"
- Relevance: 5 (frontend devs love real-time features)
- Uniqueness: 4 (most guides use Socket.io, yours uses native WebSockets)
- SEO: 4 (good volume, moderate competition)
- Career: 5 (impressive portfolio piece)
- **Total: 18/20 - High Priority**

---

## Trending Topic Research (WebSearch)

### Identifying Trends

**Query Patterns**:
```
"[tech] 2025"
"what's new in [framework]"
"[framework] vs [alternative] 2025"
"[tech] best practices 2025"
"future of [technology]"
```

**Sources to Check** (via WebSearch):
- Official blogs (React, Next.js, Vercel)
- Tech news (Hacker News, Dev.to trending)
- Conference announcements
- Framework release notes
- Developer surveys (State of JS, Stack Overflow)

### Validating Trend Viability

**Questions**:
1. Is this a flash-in-the-pan or lasting trend?
2. Does it align with my expertise?
3. Can I provide unique value on this?
4. Will readers care in 3 months?

**Green Flags**:
- Multiple sources discussing it
- Official framework adoption
- Real-world use cases
- Community momentum

**Red Flags**:
- Single source/hype
- No practical applications yet
- Contradicts established best practices
- Fading interest already

---

## Content Gap Analysis

### Finding Gaps

**Competitor Analysis**:

Use WebSearch:
```
site:dev.to "[topic]"
site:medium.com "[topic]"
site:freecodecamp.org "[topic]"
```

**Analyze**:
- What are competitors NOT covering?
- What depth is missing?
- What examples/frameworks are ignored?
- What pain points remain unsolved?

**Your Opportunity**:
- Cover the missing subtopics
- Provide deeper technical analysis
- Use newer frameworks/versions
- Include real-world examples from your projects

### Example Gap Analysis

**Topic**: React State Management

**Competitor Content** (from WebSearch):
- Redux tutorials (many)
- Context API basics (many)
- Zustand intro (few)
- Jotai intro (very few)

**Content Gaps** (Your opportunities):
- Zustand vs Redux comparison (2025)
- Zustand + React Server Components
- State management patterns for Next.js 15
- When NOT to use state management libraries

---

## Integration with Other Skills

### With SEO Optimizer

**Workflow**:
1. content-strategist identifies topic: "React Server Components Tutorial"
2. seo-optimizer validates keyword: WebSearch for volume/competition
3. If good SEO potential (score 4-5), prioritize in calendar
4. seo-optimizer provides target keyword and LSI keywords

### With Social Media Writer

**Workflow**:
1. content-strategist creates calendar with 16 posts/month
2. User writes and publishes post
3. social-media-writer repurposes each post for social distribution
4. All posts amplified across platforms

---

## Example Calendar Planning Session

**Goal**: Plan January 2025 (16 posts)

### Step 1: Analyze December Performance

(Use analytics or hypothetical):
- "Next.js 15 App Router" → 5K views (top performer)
- "React Hooks Guide" → 3.5K views (solid)
- "CSS Tips" → 800 views (underperformed)

**Insight**: Next.js and React topics perform well, CSS less so

### Step 2: Research January Trends

WebSearch:
- "react 2025 trends" → React 19 adoption growing
- "next.js 15 features" → Parallel routes, intercepting routes hot topics
- "web development 2025" → Performance, AI integration trending

### Step 3: Balance Content Types

**6 Educational** (40%):
- Next.js 15 Parallel Routes Tutorial
- React 19 Server Actions Guide
- TypeScript Generics Deep Dive
- Web Performance Optimization
- Docker for Frontend Devs
- Git Advanced Workflows

**5 Project Showcases** (30%):
- YogaDay SaaS Case Study
- Design System Build Log
- E-commerce Checkout Flow
- Real-Time Chat Implementation
- Portfolio Redesign Breakdown

**3 Opinion/Analysis** (20%):
- State Management in 2025
- Why I Ditched Redux
- Server Components vs Client Components

**2 Industry News** (10%):
- React 19 New Features
- Next.js 15 Performance Improvements

### Step 4: Create Calendar

**Week 1** (Jan 1-7):
- Mon: Next.js 15 Parallel Routes Tutorial (Educational)
- Wed: YogaDay Case Study Part 1 (Showcase)
- Fri: React 19 New Features (News)

**Week 2** (Jan 8-14):
- Mon: React 19 Server Actions Guide (Educational)
- Wed: State Management in 2025 (Opinion)
- Fri: Design System Build Log (Showcase)

**Week 3** (Jan 15-21):
- Mon: TypeScript Generics Deep Dive (Educational)
- Wed: YogaDay Case Study Part 2 (Showcase)
- Fri: Web Performance Optimization (Educational)

**Week 4** (Jan 22-31):
- Mon: Why I Ditched Redux (Opinion)
- Wed: E-commerce Checkout Flow (Showcase)
- Fri: Next.js 15 Performance (News)

---

## Quick Reference

**Monthly Planning Checklist**:
- [ ] Review last month's performance
- [ ] Research trending topics (WebSearch)
- [ ] Identify content gaps
- [ ] Score potential topics (scoring matrix)
- [ ] Balance content types (40/30/20/10)
- [ ] Create detailed calendar
- [ ] Validate keywords (seo-optimizer)
- [ ] Plan social distribution (social-media-writer)

**Topic Cluster Checklist**:
- [ ] Choose broad pillar topic
- [ ] Identify 8-10 cluster subtopics
- [ ] Plan publishing schedule
- [ ] Set up internal linking strategy
- [ ] Track cluster performance over time

---

## Summary

Content Strategist provides strategic planning using:
- Monthly calendar creation (12-16 posts/month)
- Topic cluster architecture
- Content scoring matrix (4 dimensions)
- Trending topic research (WebSearch)
- Content gap analysis

**Workflow**: Analyze → Research (WebSearch) → Score → Balance → Calendar → Validate (SEO) → Execute

**Integration**: Coordinates with seo-optimizer for keyword validation and social-media-writer for distribution.
