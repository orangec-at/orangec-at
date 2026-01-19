# Vercel Deployment Readiness Checklist

> Complete guide for deploying the OrangeCat Blog to Vercel with external API services.

---

## 1. Environment Variables Configuration

### Required for Vercel Dashboard

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | Prisma PostgreSQL connection | `postgresql://user:pass@host:5432/db` |
| `DIRECT_URL` | Prisma direct connection (for migrations) | Same as DATABASE_URL |
| `AUTH_SECRET` | NextAuth.js session encryption | `openssl rand -base64 32` |
| `AUTH_URL` | NextAuth.js callback base URL | `https://orangec-at.vercel.app` |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID | From Google Cloud Console |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret | From Google Cloud Console |
| `NEXT_PUBLIC_BLOG_API_URL` | Blog API base URL (client-side) | `https://blog-api.fly.dev` |
| `BLOG_API_INTERNAL_KEY` | Internal API authentication key | Shared secret with Rust API |
| `NEXT_PUBLIC_BASE_URL` | Site URL for SEO/sitemap | `https://orangec-at.vercel.app` |

### Optional (Feature-dependent)

| Variable | Purpose | When Needed |
|----------|---------|-------------|
| `RESEND_API_KEY` | Email provider for magic links | Email login feature |
| `AUTH_EMAIL_FROM` | Email sender address | Email login feature |
| `NEWSLETTER_FROM` | Newsletter sender address | Newsletter feature |
| `STRIPE_SECRET_KEY` | Stripe payments | Shop feature |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook validation | Shop feature |

---

## 2. API Layer Architecture

### Current Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│   Rust Blog API  │────▶│   PostgreSQL    │
│   (Vercel)      │     │   (Fly.io/etc)   │     │   (Supabase)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │
        │ SSE streaming          │ RAG queries
        ▼                        ▼
┌─────────────────┐     ┌──────────────────┐
│  Client-side    │     │   Python RAG     │
│  Chat Widget    │     │   (optional)     │
└─────────────────┘     └──────────────────┘
```

### API Client Files

| File | Purpose | Auth |
|------|---------|------|
| `src/lib/blog-api.ts` | URL resolution helper | None |
| `src/lib/blog-api-server.ts` | Server-side fetch with auth | `x-internal-api-key` header |
| `src/lib/rag-client.ts` | SSE streaming for chat | None (public endpoint) |
| `src/lib/knowledge-shelf-marginalia.server.ts` | Marginalia fetch with ISR | `x-internal-api-key` header |

### Key Patterns

**Client-side API calls:**
```typescript
// Uses NEXT_PUBLIC_BLOG_API_URL
const response = await fetch(blogApiUrl("/api/chat"), {
  method: 'POST',
  body: JSON.stringify({ query, locale }),
});
```

**Server-side API calls:**
```typescript
// Uses BLOG_API_INTERNAL_KEY for authentication
const res = await blogApiServerFetch("/api/marginalia", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ user_id: userId, content, tags }),
});
```

---

## 3. Deployment Readiness Checklist

### Pre-Deployment

- [ ] **Database**: PostgreSQL is accessible from Vercel (Supabase/Neon/PlanetScale)
- [ ] **Rust API**: Deployed and accessible (Fly.io/Railway/etc)
- [ ] **Environment Variables**: All required vars set in Vercel dashboard
- [ ] **Google OAuth**: Redirect URI added for production domain
- [ ] **Prisma**: Schema is migrated on production database

### Build Configuration

```json
// vercel.json (if needed)
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

**Current next.config.ts settings:**
- `output: "standalone"` - Optimized for serverless
- `pageExtensions: ["ts", "tsx", "md", "mdx"]` - MDX support
- Custom webpack aliases for monorepo

### Post-Deployment Verification

- [ ] Homepage loads without errors
- [ ] API endpoints return data (check Network tab)
- [ ] Auth flow works (Google sign-in)
- [ ] RAG chat responds with streaming
- [ ] Dark mode toggle functions
- [ ] i18n routes work (`/en/`, `/ko/`)

---

## 4. API Endpoint Reference

### Blog API Endpoints (Rust)

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/chat` | POST | None | RAG chat with SSE streaming |
| `/api/marginalia` | GET | Internal | List thought fragments |
| `/api/marginalia` | POST | Internal | Create new fragment |
| `/api/shop/products` | GET | None | List shop products |
| `/health` | GET | None | Health check |

### Expected Response Formats

**Chat SSE Stream:**
```
data: {"type": "sources", "sources": [...]}
data: {"type": "content", "content": "Hello..."}
data: {"type": "done"}
```

**Marginalia List:**
```json
{
  "items": [
    {
      "id": "uuid",
      "content": "thought fragment",
      "tags": ["#code", "#design"],
      "created_at": "2024-01-15T00:00:00Z"
    }
  ]
}
```

---

## 5. Error Handling

### Current Implementation

| Scenario | Handling |
|----------|----------|
| API unavailable | Returns empty array, graceful degradation |
| Auth required | Redirects to login |
| Invalid internal key | Throws error (server-side only) |
| SSE stream failure | Sets `isError` flag, allows retry |

### Recommendations

```typescript
// Add timeout to RAG client (already implemented)
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 60000);

// Add retry logic for transient failures
if (!response.ok && response.status >= 500) {
  // Implement exponential backoff
}
```

---

## 6. ISR Configuration

Current caching strategy:

```typescript
// knowledge-shelf-marginalia.server.ts
fetch(url, {
  next: { revalidate: 60 }, // Revalidate every 60 seconds
});
```

For Vercel deployment, ISR works out of the box with this configuration.

---

## 7. Vercel-Specific Considerations

### Edge Functions
- Current middleware (`src/middleware.ts`) is compatible with Edge runtime
- Auth callbacks use Node.js runtime (standard)

### Static Optimization
- MDX pages are statically generated at build time
- Dynamic routes use ISR or SSR as configured

### Build Output
```
.next/
├── server/           # Server-side bundles
├── static/           # Static assets
└── standalone/       # Standalone deployment bundle
```

---

## 8. Quick Start Deployment

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Link project
vercel link

# 3. Add environment variables
vercel env add DATABASE_URL
vercel env add AUTH_SECRET
# ... add all required variables

# 4. Deploy
vercel --prod

# 5. Verify
curl https://orangec-at.vercel.app/api/health
```

---

## 9. Troubleshooting

| Issue | Solution |
|-------|----------|
| `BLOG_API_INTERNAL_KEY is not set` | Add to Vercel env vars |
| Auth callback fails | Check `AUTH_URL` matches deployment URL |
| API calls return 500 | Verify Rust API is running and accessible |
| SSE not streaming | Check CORS settings on Rust API |
| Prisma errors | Run `prisma generate` in build command |

---

*Document Version: 1.0*
*Last Updated: January 2026*
