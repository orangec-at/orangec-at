# OrangeCat Blog Project Overview

## Purpose
Personal blog and portfolio site for Jaeil Lee (OrangeCat), showcasing projects, blog posts, and professional experience.

## Tech Stack
- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, custom components in /components/ui
- **Content**: MDX for blog posts via @next/mdx and next-mdx-remote
- **Animations**: Framer Motion, GSAP
- **Icons**: Lucide React, React Icons
- **Testing**: Playwright
- **Package Manager**: Yarn (with package-lock.json fallback)

## Project Structure
- **Monorepo**: packages/ and apps/ structure
- **Blog App**: apps/blog/ - main blog application
- **Admin App**: apps/admin/ (exists but not analyzed)

## Current Features
- Responsive design with mobile/desktop components
- Dark/light theme with ThemeProvider
- MDX blog posts with frontmatter
- Project showcase
- Contact form
- Control center component (macOS-style)
- Design system with tokens

## Development Commands
- `yarn dev` - Development server (port 3033, turbopack)
- `yarn build` - Production build (turbopack)
- `yarn lint` - ESLint
- `yarn typecheck` - TypeScript check