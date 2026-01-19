# Clean Architecture Restructuring Plan

> A step-by-step migration guide to unify the OrangeCat Blog codebase, eliminate the dual-navigation problem, and establish a feature-based component structure.

---

## 1. Current State Analysis

### The "Split-Brain" Problem

The codebase currently has **two parallel navigation systems** that create jarring visual transitions:

```tsx
// src/components/layout/conditional-app-shell.tsx
const standaloneSegments = [null, "knowledge-shelf", "about", "threads", "profile", "catalog"];
if (standaloneSegments.includes(segment)) {
  return <ArchivesNavigation>{children}</ArchivesNavigation>;  // Library theme
}
return <AppNavigation>{children}</AppNavigation>;  // MUJI theme
```

| Route | Navigation Used | Visual Style |
|-------|-----------------|--------------|
| `/` (home) | ArchivesNavigation | Library/scholarly |
| `/catalog`, `/threads`, `/about`, `/profile` | ArchivesNavigation | Library/scholarly |
| `/blog`, `/projects`, `/resume`, `/shop` | AppNavigation | MUJI/minimal |

**User Impact**: When navigating from `/catalog` to `/blog`, the entire header/navigation changes abruptly.

### Current Component Spread (84 files)

```
src/components/
├── layout/                    # 6 files - Navigation chaos lives here
│   ├── conditional-app-shell.tsx   # THE PROBLEM
│   ├── app-navigation.tsx          # MUJI nav
│   ├── archives-navigation.tsx     # Library nav
│   ├── responsive-header.tsx       # Yet another header
│   ├── footer.tsx
│   └── background-music.tsx
├── knowledge-shelf/           # 15 files - Legacy SPA-style components
│   ├── knowledge-shelf-app.tsx     # State management hub
│   └── components/
│       ├── Hero.tsx
│       ├── Navbar.tsx              # Duplicate navigation!
│       ├── FeaturedPosts.tsx
│       └── ...
├── home/                      # 7 files - Home page sections
├── blog/                      # 5 files - Blog components
├── resume/                    # 12 files - Resume components
├── control-center/            # 13 files - macOS-style panel
├── rag/                       # 3 files - Chat components
├── ui/                        # 15 files - Primitives
└── ...                        # 8 more scattered files
```

### Key Issues

1. **Duplicate Navigation**: `Navbar.tsx` in knowledge-shelf duplicates `responsive-header.tsx`
2. **Duplicate Toolbars**: Two `GadgetToolbar.tsx` files exist
3. **SPA-Style State**: `knowledge-shelf-app.tsx` manages view state like a SPA
4. **Scattered Features**: Components not organized by feature/domain
5. **Inconsistent API Layer**: Multiple files for API calls with different patterns

---

## 2. Target Architecture

### Proposed Folder Structure

```
src/
├── app/                       # Next.js App Router (unchanged)
│   └── [locale]/
│       ├── layout.tsx         # Uses UnifiedLayout
│       ├── page.tsx           # Home
│       ├── blog/
│       ├── projects/
│       ├── catalog/
│       └── ...
│
├── components/
│   ├── ui/                    # Primitives (15 files - keep as-is)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   │
│   ├── layout/                # Global layout components
│   │   ├── unified-navigation.tsx    # NEW: Single nav system
│   │   ├── unified-footer.tsx        # NEW: Merged footer
│   │   ├── unified-layout.tsx        # NEW: Main layout wrapper
│   │   └── background-music.tsx      # Keep
│   │
│   ├── features/              # NEW: Feature-based organization
│   │   ├── chat/              # All chat-related components
│   │   │   ├── chat-widget.tsx
│   │   │   ├── chat-messages.tsx
│   │   │   ├── chat-input.tsx
│   │   │   └── gadget-toolbar.tsx
│   │   │
│   │   ├── control-center/    # macOS-style panel (move here)
│   │   │   ├── control-center.tsx
│   │   │   ├── control-center-dock.tsx
│   │   │   └── items/
│   │   │
│   │   ├── marginalia/        # Thought fragments feature
│   │   │   └── marginalia-list.tsx
│   │   │
│   │   └── search/            # Search functionality
│   │       └── search-modal.tsx
│   │
│   ├── sections/              # Page sections (reusable across routes)
│   │   ├── hero/
│   │   │   ├── kinetic-hero.tsx      # NEW: Unified hero
│   │   │   └── page-hero.tsx         # Generic page header
│   │   │
│   │   ├── posts/
│   │   │   ├── featured-posts.tsx
│   │   │   ├── blog-card.tsx
│   │   │   └── post-detail.tsx
│   │   │
│   │   ├── skills/
│   │   │   └── skills-section.tsx
│   │   │
│   │   ├── services/
│   │   │   └── services-section.tsx
│   │   │
│   │   ├── cta/
│   │   │   └── contact-cta.tsx
│   │   │
│   │   └── footer/
│   │       └── kinetic-footer.tsx    # NEW: Bold footer
│   │
│   └── pages/                 # Page-specific compositions
│       ├── home/
│       │   └── home-client.tsx       # Assembles sections
│       ├── catalog/
│       ├── resume/
│       └── ...
│
├── lib/
│   ├── api/                   # NEW: Consolidated API layer
│   │   ├── client.ts          # Base fetch wrapper
│   │   ├── blog.ts            # Blog API endpoints
│   │   ├── marginalia.ts      # Marginalia endpoints
│   │   ├── chat.ts            # RAG/chat endpoints
│   │   └── types.ts           # API response types
│   │
│   ├── hooks/                 # Custom hooks
│   │   ├── use-chat.ts
│   │   ├── use-marginalia.ts
│   │   └── use-scroll-direction.ts
│   │
│   ├── design-tokens.ts       # Keep (will be extended)
│   └── utils.ts               # Utility functions
│
└── styles/
    └── globals.css            # With kinetic CSS variables
```

### Key Changes

| Before | After |
|--------|-------|
| `conditional-app-shell.tsx` | **DELETED** - replaced by `unified-layout.tsx` |
| `app-navigation.tsx` + `archives-navigation.tsx` | **MERGED** into `unified-navigation.tsx` |
| `knowledge-shelf/components/*` | **MOVED** to `sections/*` or `features/*` |
| 2x `GadgetToolbar.tsx` | **MERGED** into `features/chat/gadget-toolbar.tsx` |
| Scattered API files | **CONSOLIDATED** into `lib/api/*` |

---

## 3. Unified Navigation Design

### Component: `unified-navigation.tsx`

Replace both navigation systems with a single, cohesive component:

```tsx
// src/components/layout/unified-navigation.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/threads", label: "Threads" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

export function UnifiedNavigation() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll-triggered size reduction
  useEffect(() => {
    return scrollY.on("change", (y) => setIsScrolled(y > 50));
  }, [scrollY]);

  return (
    <motion.header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        isScrolled ? "py-2" : "py-4"
      )}
    >
      <nav className="container mx-auto flex items-center justify-between px-4">
        {/* Logo - Library branding with orange accent */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-sm bg-kinetic-orange text-white 
                          flex items-center justify-center font-display italic
                          group-hover:scale-110 transition-transform">
            A
          </div>
          <span className="font-display italic text-xl font-bold hidden sm:block">
            Archives.
          </span>
        </Link>

        {/* Nav Items - Floating pill style */}
        <div className={cn(
          "flex items-center gap-1 bg-background/80 backdrop-blur-md",
          "rounded-full px-2 py-1.5 border border-stone-200 dark:border-stone-800",
          "shadow-sm transition-all",
          isScrolled && "shadow-md"
        )}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                  isActive
                    ? "bg-kinetic-orange text-white"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right actions - Theme toggle, etc. */}
        <div className="flex items-center gap-2">
          {/* ControlCenter trigger, theme toggle, etc. */}
        </div>
      </nav>
    </motion.header>
  );
}
```

### Component: `unified-layout.tsx`

Single layout wrapper for all pages:

```tsx
// src/components/layout/unified-layout.tsx
import type { ReactNode } from "react";
import { UnifiedNavigation } from "./unified-navigation";
import { UnifiedFooter } from "./unified-footer";
import { ChatWidget } from "@/components/features/chat/chat-widget";

export function UnifiedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <UnifiedNavigation />
      <main className="min-h-screen pt-20">
        {children}
      </main>
      <UnifiedFooter />
      <ChatWidget />
    </>
  );
}
```

---

## 4. API Layer Consolidation

### Current State (Fragmented)

```
src/lib/
├── blog-api.ts                    # URL helper only
├── blog-api-server.ts             # Server fetch with auth
├── rag-client.ts                  # SSE streaming
└── knowledge-shelf-marginalia.server.ts  # ISR fetch
```

### Target State (Consolidated)

```
src/lib/api/
├── client.ts                      # Base configuration
├── types.ts                       # Shared types
├── blog.ts                        # Blog endpoints
├── marginalia.ts                  # Marginalia endpoints
└── chat.ts                        # RAG chat endpoints
```

### Implementation: `lib/api/client.ts`

```typescript
// src/lib/api/client.ts

const BLOG_API_URL = process.env.NEXT_PUBLIC_BLOG_API_URL || "";
const INTERNAL_KEY = process.env.BLOG_API_INTERNAL_KEY || "";

export type FetchOptions = RequestInit & {
  requiresAuth?: boolean;
  revalidate?: number | false;
};

/**
 * Unified API client for both client and server-side requests.
 */
export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requiresAuth = false, revalidate, ...fetchOptions } = options;
  
  const headers = new Headers(fetchOptions.headers);
  headers.set("Content-Type", "application/json");
  
  if (requiresAuth && INTERNAL_KEY) {
    headers.set("x-internal-api-key", INTERNAL_KEY);
  }

  const url = `${BLOG_API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    ...(revalidate !== undefined && { next: { revalidate } }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Streaming client for SSE endpoints (RAG chat).
 */
export function streamClient(endpoint: string, body: unknown): ReadableStream {
  const url = `${BLOG_API_URL}${endpoint}`;
  
  return new ReadableStream({
    async start(controller) {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok || !response.body) {
        controller.error(new Error("Stream failed"));
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        controller.enqueue(decoder.decode(value));
      }

      controller.close();
    },
  });
}
```

### Implementation: `lib/api/marginalia.ts`

```typescript
// src/lib/api/marginalia.ts

import { apiClient } from "./client";
import type { MarginaliaItem, CreateMarginaliaInput } from "./types";

export async function getMarginalia(): Promise<MarginaliaItem[]> {
  const data = await apiClient<{ items: MarginaliaItem[] }>("/api/marginalia", {
    requiresAuth: true,
    revalidate: 60,
  });
  return data.items;
}

export async function createMarginalia(
  input: CreateMarginaliaInput
): Promise<MarginaliaItem> {
  return apiClient<MarginaliaItem>("/api/marginalia", {
    method: "POST",
    body: JSON.stringify(input),
    requiresAuth: true,
  });
}
```

---

## 5. Migration Roadmap

### Phase 1: Unified Navigation (Day 1-2)

**Goal**: Eliminate the dual-navigation problem.

| Step | Action | Risk |
|------|--------|------|
| 1.1 | Create `unified-navigation.tsx` | Low |
| 1.2 | Create `unified-layout.tsx` | Low |
| 1.3 | Update `app/[locale]/layout.tsx` to use `UnifiedLayout` | Medium |
| 1.4 | Delete `conditional-app-shell.tsx` | Low |
| 1.5 | Delete `app-navigation.tsx`, `archives-navigation.tsx` | Low |
| 1.6 | Test all routes for navigation consistency | Required |

**Files Changed:**
```diff
+ src/components/layout/unified-navigation.tsx (new)
+ src/components/layout/unified-layout.tsx (new)
~ src/app/[locale]/layout.tsx (modify)
- src/components/layout/conditional-app-shell.tsx (delete)
- src/components/layout/app-navigation.tsx (delete)
- src/components/layout/archives-navigation.tsx (delete)
```

### Phase 2: Component Reorganization (Day 2-3)

**Goal**: Move components to feature-based structure.

| Step | Action | Files Affected |
|------|--------|----------------|
| 2.1 | Create `components/features/chat/` directory | 4 files |
| 2.2 | Move and merge chat components | rag/*.tsx, GadgetToolbar.tsx |
| 2.3 | Create `components/sections/` directories | - |
| 2.4 | Move knowledge-shelf components to sections | 10+ files |
| 2.5 | Update all import paths | Many |
| 2.6 | Delete empty `knowledge-shelf/` directory | - |

**Component Mapping:**
```
OLD → NEW
knowledge-shelf/components/Hero.tsx → sections/hero/kinetic-hero.tsx
knowledge-shelf/components/FeaturedPosts.tsx → sections/posts/featured-posts.tsx
knowledge-shelf/components/SkillsSection.tsx → sections/skills/skills-section.tsx
knowledge-shelf/components/Navbar.tsx → DELETED (replaced by unified-navigation)
knowledge-shelf/components/Footer.tsx → sections/footer/kinetic-footer.tsx
knowledge-shelf/components/GadgetToolbar.tsx → features/chat/gadget-toolbar.tsx
rag/chat-widget.tsx → features/chat/chat-widget.tsx
```

### Phase 3: API Layer Consolidation (Day 3-4)

**Goal**: Single source of truth for API calls.

| Step | Action |
|------|--------|
| 3.1 | Create `lib/api/client.ts` with base configuration |
| 3.2 | Create `lib/api/types.ts` with shared types |
| 3.3 | Create domain-specific files (blog.ts, marginalia.ts, chat.ts) |
| 3.4 | Update all components to use new API layer |
| 3.5 | Delete old API files |

**Files Changed:**
```diff
+ src/lib/api/client.ts (new)
+ src/lib/api/types.ts (new)
+ src/lib/api/blog.ts (new)
+ src/lib/api/marginalia.ts (new)
+ src/lib/api/chat.ts (new)
- src/lib/blog-api.ts (delete)
- src/lib/blog-api-server.ts (delete)
- src/lib/rag-client.ts (delete)
- src/lib/knowledge-shelf-marginalia.server.ts (delete)
```

### Phase 4: Design System Updates (Day 4-5)

**Goal**: Apply Kinetic Library design tokens.

| Step | Action |
|------|--------|
| 4.1 | Add kinetic CSS variables to `globals.css` |
| 4.2 | Update `design-tokens.ts` with kinetic tokens |
| 4.3 | Create `Marquee` component |
| 4.4 | Update Hero with kinetic typography |
| 4.5 | Update footer with kinetic CTA |

See `KINETIC-LIBRARY-DESIGN-SPEC.md` for detailed design specifications.

### Phase 5: Cleanup & Testing (Day 5-6)

**Goal**: Remove dead code, verify functionality.

| Step | Action |
|------|--------|
| 5.1 | Remove `knowledge-shelf-app.tsx` (legacy SPA state) |
| 5.2 | Audit for unused components |
| 5.3 | Run TypeScript compiler (no errors) |
| 5.4 | Run build (`pnpm build`) |
| 5.5 | Test all routes manually |
| 5.6 | Deploy to Vercel preview |

---

## 6. Component Deletion List

Components to be **deleted** after migration:

| File | Reason |
|------|--------|
| `conditional-app-shell.tsx` | Replaced by unified-layout |
| `app-navigation.tsx` | Merged into unified-navigation |
| `archives-navigation.tsx` | Merged into unified-navigation |
| `knowledge-shelf/components/Navbar.tsx` | Duplicate of responsive-header |
| `knowledge-shelf/knowledge-shelf-app.tsx` | Legacy SPA state management |
| `GadgetToolbar.tsx` (root) | Duplicate - keep knowledge-shelf version |

---

## 7. Import Path Updates

Use VS Code's "Find and Replace" or a codemod:

```bash
# Example sed commands (run from apps/blog/)

# Update chat component imports
sed -i '' 's|@/components/rag/|@/components/features/chat/|g' src/**/*.tsx

# Update section imports
sed -i '' 's|@/components/knowledge-shelf/components/Hero|@/components/sections/hero/kinetic-hero|g' src/**/*.tsx

# Update API imports
sed -i '' 's|@/lib/blog-api-server|@/lib/api/blog|g' src/**/*.tsx
```

Alternatively, rely on TypeScript errors after moves to identify broken imports.

---

## 8. Testing Checklist

### After Phase 1 (Navigation)

- [ ] All routes render without 500 errors
- [ ] Navigation is consistent across all pages
- [ ] No jarring layout shifts when navigating
- [ ] Mobile menu works
- [ ] Scroll behavior is correct (navbar shrinks)

### After Phase 2 (Components)

- [ ] Home page renders all sections
- [ ] Catalog page works
- [ ] Blog page works
- [ ] Chat widget opens and closes
- [ ] No console errors

### After Phase 3 (API)

- [ ] Marginalia loads on home page
- [ ] Blog posts load on blog page
- [ ] Chat streaming works
- [ ] ISR revalidation works

### After Phase 4 (Design)

- [ ] Orange accent visible on every page
- [ ] Dark mode fully functional
- [ ] Marquee animates smoothly
- [ ] Hero typography is large and impactful

### After Phase 5 (Cleanup)

- [ ] `pnpm build` succeeds
- [ ] No TypeScript errors
- [ ] No unused component warnings
- [ ] Lighthouse score > 90

---

## 9. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Breaking navigation on all pages | Do Phase 1 in a feature branch, test thoroughly |
| Lost component functionality | Keep old files until new ones are verified |
| API integration breaks | Write unit tests for API layer before migration |
| Deployment failure | Deploy to Vercel preview before production |

---

## 10. Success Criteria

- [ ] Single navigation component used across all pages
- [ ] No more `conditional-app-shell.tsx` logic
- [ ] Feature-based component organization
- [ ] Consolidated API layer in `lib/api/`
- [ ] All kinetic design tokens in place
- [ ] Build passes, no TypeScript errors
- [ ] Lighthouse Performance > 90
- [ ] All routes working in production

---

*Architecture Plan Version: 1.0*
*Created: January 2026*
*Author: OrangeCat Portfolio Team*
