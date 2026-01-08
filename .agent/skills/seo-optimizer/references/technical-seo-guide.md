# Technical SEO Guide

Essential technical SEO setup for Next.js blog.

## Sitemap

**Location**: `apps/blog/public/sitemap.xml`

**Requirements**:
- All published posts included
- Auto-updates on new post
- Submitted to Google Search Console

**Next.js** (use `next-sitemap`):
```bash
pnpm add next-sitemap
```

## Robots.txt

**Location**: `apps/blog/public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

## Canonical URLs

**Purpose**: Prevent duplicate content issues

```tsx
// app/blog/[slug]/page.tsx
export const metadata = {
  alternates: {
    canonical: `https://yourdomain.com/blog/${slug}`
  }
}
```

## Schema Markup (JSON-LD)

**Article Schema** (for blog posts):

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Post Title",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "datePublished": "2025-01-15",
  "dateModified": "2025-01-20",
  "image": "https://domain.com/image.png",
  "publisher": {
    "@type": "Organization",
    "name": "Your Blog",
    "logo": {
      "@type": "ImageObject",
      "url": "https://domain.com/logo.png"
    }
  }
}
```

**BreadcrumbList Schema**:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Blog",
    "item": "https://domain.com/blog"
  }, {
    "@type": "ListItem",
    "position": 2,
    "name": "Post Title"
  }]
}
```

## Open Graph Tags

```tsx
export const metadata = {
  openGraph: {
    title: 'Post Title',
    description: 'Post description',
    url: 'https://domain.com/blog/slug',
    type: 'article',
    publishedTime: '2025-01-15',
    authors: ['Author Name'],
    images: [{
      url: 'https://domain.com/og-image.png',
      width: 1200,
      height: 630,
      alt: 'OG Image Description'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Post Title',
    description: 'Post description',
    images: ['https://domain.com/og-image.png']
  }
}
```

## Core Web Vitals

**LCP (Largest Contentful Paint)**: < 2.5s
- Optimize images
- Reduce server response time
- Remove render-blocking resources

**FID (First Input Delay)**: < 100ms
- Minimize JavaScript
- Break up long tasks
- Use web workers

**CLS (Cumulative Layout Shift)**: < 0.1
- Set image dimensions
- Avoid inserting content above existing
- Reserve space for ads/embeds

## Mobile Optimization

- [ ] Responsive design
- [ ] Touch targets (min 48x48px)
- [ ] Readable text (min 16px)
- [ ] No horizontal scrolling
- [ ] Fast mobile load time

## Security

- [ ] HTTPS enabled
- [ ] Security headers (CSP, X-Frame-Options)
- [ ] No mixed content warnings

## Quick Check Tools

- Google PageSpeed Insights
- Google Search Console
- Lighthouse (Chrome DevTools)
- schema.org validator
