# Frontend Development Guidelines

**Tech Stack:** Next.js 15 (App Router) • React 19 • TypeScript • Tailwind CSS 4 • Radix UI

---

## Quick Start Checklists

### New Component Checklist
- [ ] TypeScript: Use proper types, avoid `any`
- [ ] File location: `components/` for shared, `app/[locale]/[route]/` for page-specific
- [ ] Naming: PascalCase for components, kebab-case for files
- [ ] Styling: Tailwind classes with `cn()` utility
- [ ] Client components: Add `"use client"` if using hooks/interactivity
- [ ] Accessibility: Proper semantic HTML, ARIA labels when needed

### New Page/Route Checklist
- [ ] Create `app/[locale]/[route]/page.tsx` for page
- [ ] Add `client.tsx` if client-side logic needed
- [ ] Update metadata exports for SEO
- [ ] Add i18n translations in `messages/[locale].json`
- [ ] Test both `ko` and `en` locales

---

## Core Principles

### 1. App Router Structure (Next.js 15)
```
app/
├── [locale]/              # Internationalization
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   ├── [route]/
│   │   ├── page.tsx      # Server component (default)
│   │   └── client.tsx    # Client component logic
│   └── globals.css       # Global styles
└── middleware.ts         # i18n middleware
```

**Server Components (Default):**
- Use for static content, data fetching, SEO-critical pages
- No `"use client"` directive needed
- Can directly access backend/database

**Client Components:**
- Add `"use client"` at top of file
- Required for: useState, useEffect, event handlers, browser APIs
- Separate into `client.tsx` for better organization

### 2. Component Organization

**Shared Components** (`components/`)
```typescript
// components/ui/button.tsx
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input hover:bg-accent"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8"
      }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = ({ className, variant, size, asChild, ...props }: ButtonProps) => {
  const Comp = asChild ? Slot : "button"
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
```

**Page-Specific Components** (`app/[locale]/[route]/components/`)
- Keep components close to where they're used
- Only extract to `components/` if reused across multiple pages

### 3. Styling with Tailwind CSS 4

**Best Practices:**
- Use `cn()` utility for conditional classes
- Use CSS variables for theming: `var(--foreground)`, `var(--primary)`
- Prefer Tailwind utilities over custom CSS
- Use `@layer` for custom utilities in `globals.css`

**Example:**
```typescript
import { cn } from "@/lib/utils"

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
}
```

### 4. TypeScript Patterns

**Strict Mode (Always):**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

**Type Definitions:**
```typescript
// types/document-frontmatter.ts
import { z } from "zod"

export const DocumentFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  tags: z.array(z.string()).optional()
})

export type DocumentFrontmatter = z.infer<typeof DocumentFrontmatterSchema>
```

**Avoid `any`, use proper types:**
```typescript
// ❌ Bad
const handleClick = (data: any) => { ... }

// ✅ Good
interface ClickData {
  id: string
  timestamp: number
}
const handleClick = (data: ClickData) => { ... }
```

### 5. Internationalization (next-intl)

**Setup:**
```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)
```

**Usage in Components:**
```typescript
import { useTranslations } from 'next-intl'

export function WelcomeMessage() {
  const t = useTranslations('HomePage')
  return <h1>{t('title')}</h1>
}
```

**Translation Files:**
```json
// messages/ko.json
{
  "HomePage": {
    "title": "환영합니다"
  }
}
```

### 6. MDX Content

**Frontmatter Schema:**
```typescript
import matter from 'gray-matter'
import { DocumentFrontmatterSchema } from '@/types/document-frontmatter'

const { data, content } = matter(fileContent)
const frontmatter = DocumentFrontmatterSchema.parse(data)
```

**MDX Components:**
```typescript
// mdx-components.tsx
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="text-4xl font-bold">{children}</h1>,
    p: ({ children }) => <p className="mb-4 text-base">{children}</p>,
    ...components,
  }
}
```

### 7. Radix UI Integration

**Example Pattern:**
```typescript
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

export function UserMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="rounded-full">Menu</button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="min-w-[220px] bg-white rounded-md p-1">
          <DropdownMenu.Item className="px-2 py-1.5 cursor-pointer">
            Profile
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
```

### 8. Animation with Framer Motion

**Basic Pattern:**
```typescript
"use client"

import { motion } from "framer-motion"

export function AnimatedCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
```

**Layout Animations:**
```typescript
<motion.div layout>
  {items.map(item => (
    <motion.div key={item.id} layout>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### 9. Data Table Pattern (@tanstack/react-table)

**Setup:**
```typescript
"use client"

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef
} from "@tanstack/react-table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

### 10. Performance Optimization

**Image Optimization:**
```typescript
import Image from "next/image"

<Image
  src="/profile.jpg"
  alt="Profile"
  width={500}
  height={500}
  priority // for above-fold images
/>
```

**Code Splitting:**
```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>
})
```

**React Compiler (React 19):**
- Automatic memoization enabled in React 19
- Reduce manual `useMemo`/`useCallback` usage
- Let compiler optimize rendering

---

## Common Patterns

### Form Handling
```typescript
"use client"

import { useState } from "react"

export function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "" })
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle submission
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full rounded-md border px-3 py-2"
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Theme Context
```typescript
"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Theme = "light" | "dark"

const ThemeContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
} | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}
```

---

## File Naming Conventions

- **Components:** `PascalCase.tsx` → `Button.tsx`, `UserProfile.tsx`
- **Utilities:** `kebab-case.ts` → `cn.ts`, `format-date.ts`
- **Types:** `kebab-case.ts` → `document-frontmatter.ts`
- **Pages:** Next.js convention → `page.tsx`, `layout.tsx`, `not-found.tsx`

---

## Testing with Playwright

**E2E Test Pattern:**
```typescript
import { test, expect } from '@playwright/test'

test('homepage has title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/OrangeC/)
})

test('navigation works', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Projects')
  await expect(page).toHaveURL(/\/projects/)
})
```

---

## Resources

When you need more detailed guidance on specific topics, request:
- `component-patterns.md` - Advanced component composition
- `mdx-configuration.md` - MDX setup and custom components
- `animation-patterns.md` - Framer Motion advanced techniques
- `accessibility.md` - WCAG compliance guidelines

---

## Summary

✅ Use Server Components by default, Client Components when needed  
✅ Organize by feature proximity (colocate when possible)  
✅ Tailwind CSS 4 with `cn()` utility for styling  
✅ TypeScript strict mode, avoid `any`  
✅ next-intl for i18n, support `ko` and `en` locales  
✅ Radix UI for accessible components  
✅ Framer Motion for animations  
✅ Next.js Image optimization  
✅ Playwright for E2E testing
