---
name: seo-optimizer
description: Comprehensive SEO analysis and optimization for blog content. Analyze posts for search ranking potential, keyword optimization, technical SEO, and provide actionable improvements with scoring system.
---

# SEO Optimizer

Analyze and optimize blog content for search engines with data-driven recommendations and a 100-point scoring system.

**Works With:** WebSearch MCP (keyword research, SERP analysis) • apps/blog/ content • Next.js metadata

---

## When to Use This Skill

- Optimizing existing blog posts for better ranking
- Keyword research for new content planning
- Technical SEO health checks
- Meta tag optimization and Open Graph
- Competitive content analysis
- Pre-publish SEO validation

---

## Core Principles

### 1. Search Intent Matching
Understand what users actually want when they search, not just keywords

### 2. E-E-A-T (Google's Quality Framework)
- **Experience**: First-hand experience with topic
- **Expertise**: Demonstrated knowledge
- **Authoritativeness**: Recognized in field
- **Trust**: Accurate, honest, safe content

### 3. User-First Content
Readability and value before keyword stuffing

### 4. Technical Performance
Core Web Vitals and mobile-first indexing matter

---

## SEO Analysis Workflows

### Content SEO Checklist

**Title Optimization** (/15 points):
- [ ] 50-60 characters
- [ ] Primary keyword in first 60 chars
- [ ] Compelling and accurate
- [ ] Unique across site

**Meta Description** (/10 points):
- [ ] 150-160 characters
- [ ] Includes primary keyword
- [ ] Has compelling CTA
- [ ] Accurately summarizes content

**Header Structure** (/10 points):
- [ ] One H1 tag (contains primary keyword)
- [ ] H2-H6 hierarchy logical
- [ ] Headers descriptive and keyword-aware
- [ ] Table of contents for long posts

**Keyword Usage** (/15 points):
- [ ] Primary keyword density 1-2%
- [ ] Natural language (not stuffed)
- [ ] LSI keywords (related terms) included
- [ ] Keywords in first 100 words

**Content Quality** (/20 points):
- [ ] 1500+ words for competitive topics
- [ ] Comprehensive topic coverage
- [ ] Original insights and examples
- [ ] Readability score 60-70 (Flesch)
- [ ] Short paragraphs (2-3 sentences)

**Internal Linking** (/10 points):
- [ ] 3-5 relevant internal links
- [ ] Descriptive anchor text (not "click here")
- [ ] Links to related posts
- [ ] Links to cornerstone content

**Image Optimization** (/10 points):
- [ ] All images have alt text
- [ ] Alt text descriptive and keyword-aware
- [ ] Images compressed/optimized
- [ ] File names descriptive (not IMG_1234.jpg)

**Technical SEO** (/10 points):
- [ ] URL structure clean and descriptive
- [ ] Canonical URL set
- [ ] Schema markup (Article, BreadcrumbList)
- [ ] Open Graph tags for social sharing

**Mobile & Performance** (/5 points):
- [ ] Mobile responsive
- [ ] Fast loading (< 3s)
- [ ] Core Web Vitals passing

**Page Speed** (/5 points):
- [ ] LCP < 2.5s (Largest Contentful Paint)
- [ ] FID < 100ms (First Input Delay)
- [ ] CLS < 0.1 (Cumulative Layout Shift)

**Total: /100 points**

---

## SEO Score Rubric

**90-100**: Excellent - Ready to rank
**75-89**: Good - Minor improvements needed
**60-74**: Fair - Moderate optimization required
**Below 60**: Needs Work - Major improvements needed

---

## Keyword Research Workflow (WebSearch)

### Step 1: Identify Primary Keyword

Use WebSearch to find target keyword:

```
WebSearch: "[topic] tutorial 2025"
WebSearch: "how to [action] with [tech]"
WebSearch: "[tech] best practices"
```

Analyze top 10 results:
- What keywords appear in titles?
- What questions are answered?
- What's the average content length?
- What's the search intent (informational, tutorial, comparison)?

### Step 2: Find Related Keywords

```
WebSearch: "people also search for [primary keyword]"
WebSearch: "[primary keyword] related searches"
```

Look for:
- LSI keywords (Latent Semantic Indexing)
- Question variations
- Long-tail opportunities

### Step 3: Analyze Competition

```
WebSearch: "[primary keyword]" site:dev.to
WebSearch: "[primary keyword]" site:medium.com
```

Assess:
- Can you provide unique value?
- Is competition too strong (big publications)?
- What content gaps exist?

---

## On-Page SEO Optimization

### Title Tag Formula

**Pattern**: [Primary Keyword] - [Benefit/Context] | [Brand]

**Examples**:
- "Next.js Server Components - Complete Guide with Examples | YourBlog"
- "React Performance Optimization - 5 Proven Techniques | YourBlog"
- "TailwindCSS Setup Guide - From Zero to Production | YourBlog"

**Rules**:
- 50-60 characters (Google truncates at ~60)
- Primary keyword in first 60 characters
- Unique for every page
- Compelling (impacts click-through rate)

### Meta Description Formula

**Pattern**: [What it is]. [Key benefit]. [What you'll learn]. [CTA]

**Example**:
```
Learn React Server Components in Next.js 15. Reduce client JavaScript by 70% and improve performance. Step-by-step tutorial with code examples. Read now →
```

**Rules**:
- 150-160 characters
- Include primary keyword naturally
- Clear benefit/value proposition
- Action-oriented CTA

### URL Structure

**Good URLs**:
- `/blog/react-performance-optimization`
- `/tutorials/nextjs-server-components`
- `/guides/tailwindcss-setup`

**Bad URLs**:
- `/blog/post-12345`
- `/p/abc-def-ghi`
- `/blog/2024/01/15/untitled`

**Rules**:
- Lowercase, hyphen-separated
- Includes primary keyword
- Descriptive and concise
- No dates unless content is time-sensitive

---

## Technical SEO Checklist

### Sitemap
```xml
<!-- apps/blog/public/sitemap.xml -->
- All published posts included
- Updated automatically on publish
- Submitted to Google Search Console
```

### Robots.txt
```
# apps/blog/public/robots.txt
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml
```

### Canonical URLs
```tsx
// apps/blog/src/app/[slug]/page.tsx
export const metadata = {
  alternates: {
    canonical: `https://yourdomain.com/blog/${slug}`
  }
}
```

### Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your Post Title",
  "author": {
    "@type": "Person",
    "name": "Your Name"
  },
  "datePublished": "2025-01-15",
  "dateModified": "2025-01-20",
  "image": "https://yourdomain.com/og-image.png"
}
```

### Open Graph Tags
```tsx
export const metadata = {
  openGraph: {
    title: 'Your Post Title',
    description: 'Compelling description',
    url: 'https://yourdomain.com/blog/slug',
    type: 'article',
    images: [{
      url: 'https://yourdomain.com/og-image.png',
      width: 1200,
      height: 630
    }]
  }
}
```

---

## WebSearch Integration (Critical)

### Keyword Research Queries

```
"[topic] tutorial" - Find how people search for guides
"how to [action]" - Question-based searches
"[tech] best practices" - Best practice content
"[tech] vs [tech]" - Comparison searches
"[problem] solution" - Problem-solving searches
```

### SERP Analysis Queries

```
"[keyword]" - See top 10 results
"[keyword] 2025" - Recent/updated content
site:[competitor].com "[topic]" - Competitor analysis
```

### Content Gap Queries

```
"[topic] NOT tutorial" - Find non-tutorial angles
"[tech] [use case]" - Specific use cases
"[topic] mistakes" - Common pitfalls content
```

---

## Example SEO Analysis

### Input: Blog Post Analysis

**Post**: `apps/blog/src/posts/ko/tailwindcss-component-driven-development.mdx`

**Analysis**:

**Title** (/15):
- Current: "TailwindCSS로 컴포넌트 중심 개발하기" (11/15)
- Issue: Missing benefit, no English SEO
- Fix: "TailwindCSS Component-Driven Development - 50% Faster Styling"

**Meta Description** (/10):
- Current: 120 chars (6/10)
- Issue: Too short, missing CTA
- Fix: Expand to 155 chars with benefit and CTA

**Headers** (/10):
- H1: ✅ Good
- H2-H3: ✅ Logical structure
- Score: 10/10

**Keywords** (/15):
- "TailwindCSS" appears 8 times (1.2%) ✅
- LSI keywords: component, utility-first, atomic design ✅
- Score: 13/15

**Content Quality** (/20):
- Length: 1200 words (target 1500+)
- Readability: Good
- Examples: ✅ Has code examples
- Score: 16/20

**Internal Links** (/10):
- Current: 0 links ❌
- Fix: Add 3-5 links to related Next.js/React posts
- Score: 0/10

**Images** (/10):
- 3 code screenshots
- Alt text: Missing ❌
- Fix: Add descriptive alt text
- Score: 5/10

**Technical** (/10):
- Canonical: ✅
- Schema: ✅
- OG tags: ✅
- Score: 10/10

**Mobile/Performance** (/10):
- Core Web Vitals: ✅
- Score: 10/10

**Total Score: 71/100 (Fair - Moderate optimization needed)**

**Priority Fixes**:
1. Add 3-5 internal links (+10 points)
2. Optimize title for English SEO (+4 points)
3. Expand meta description (+4 points)
4. Add image alt text (+5 points)
5. Expand content to 1500+ words (+4 points)

**After fixes: 98/100 (Excellent)**

---

## Content Optimization Workflow

1. **Read blog post** (frontmatter + content)
2. **Run through SEO checklist** (100-point rubric)
3. **Use WebSearch** for keyword research and SERP analysis
4. **Identify top 3-5 issues** (highest point impact)
5. **Provide specific fixes** (exact recommendations)
6. **Estimate ranking potential** (based on competition)

---

## Quick Wins for Immediate Impact

**5-Minute Fixes**:
- Add missing alt text to images
- Optimize title tag (keyword-first)
- Expand meta description to 150-160 chars
- Add 3-5 internal links

**30-Minute Fixes**:
- Research and add LSI keywords naturally
- Improve header structure (H2-H6)
- Add schema markup (JSON-LD)
- Optimize URL structure

**2-Hour Fixes**:
- Expand content to 1500+ words
- Add comprehensive examples
- Create visual aids/diagrams
- Improve readability (shorter paragraphs)

---

## Anti-Patterns

❌ **Keyword Stuffing**
```
TailwindCSS is the best CSS framework. TailwindCSS makes styling easy. Learn TailwindCSS today with our TailwindCSS guide.
```

✅ **Natural Usage**
```
TailwindCSS simplifies component styling with utility-first classes. This guide covers everything from setup to production optimization.
```

❌ **Thin Content**
```
500 words barely covering the topic
```

✅ **Comprehensive**
```
1500+ words with examples, code snippets, and detailed explanations
```

❌ **Generic Titles**
```
"React Tutorial" (too broad, impossible to rank)
```

✅ **Specific Titles**
```
"React Server Components in Next.js 15 - Complete Guide"
```

---

## Summary

SEO Optimizer provides data-driven analysis using:
- 100-point scoring rubric
- WebSearch for keyword research
- Technical SEO validation
- Actionable recommendations prioritized by impact

**Workflow**: Analyze → Score → Research (WebSearch) → Recommend → Optimize

**Integration**: Works with apps/blog/ content, coordinates with content-strategist for keyword planning.
