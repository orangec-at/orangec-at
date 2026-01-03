# orangec-at Portfolio

A modern, MUJI-inspired portfolio and blog built with Next.js 15, featuring a custom design system with 62 production-ready components.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=flat-square)](https://orangec-at.vercel.app)
[![Design System](https://img.shields.io/badge/Design-System-green?style=flat-square)](./DESIGN-SYSTEM.md)

## Features

- **Design System**: 62 reusable components with centralized design tokens
- **MUJI Aesthetic**: Minimal, clean design with systematic 8px grid
- **Dark Mode**: Full light/dark theme support
- **Accessibility**: WCAG 2.1 AA compliant (Radix UI)
- **i18n**: Multi-language support (EN/KO)
- **MDX Blog**: Rich content with custom components
- **Control Center**: macOS-inspired settings panel
- **AI Chat**: RAG-powered chat widget

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 15 (App Router), React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4, CSS Variables |
| **UI** | Radix UI, Framer Motion |
| **Patterns** | CVA (class-variance-authority) |
| **Testing** | Jest, Testing Library |

## Design System

This project includes a comprehensive design system. See [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) for full documentation.

### Component Architecture

```
src/components/
├── ui/             # 13 primitives (Button, Card, Badge, etc.)
├── layout/         # Navigation, Header, Footer
├── home/           # Home page sections
├── blog/           # Blog components
├── control-center/ # macOS-style control panel
├── resume/         # Resume sections
└── ...             # Domain-specific components
```

### Design Tokens

```typescript
// Centralized in src/lib/design-tokens.ts
import { colors, typography, spacing, grid } from '@/lib/design-tokens';

// Usage
<div className={`${colors.background.primary} ${spacing.section}`}>
  <h1 className={typography.hero}>Welcome</h1>
</div>
```

### Tailwind Config

```typescript
// tailwind.config.ts - MUJI-inspired tokens
{
  colors: {
    wood: { 50-900 },   // Warm neutrals
    steel: { 50-900 }   // Cool accents
  },
  spacing: {
    'section': '4rem',   // Systematic 8px base
    'card': '2rem',
    'compact': '0.5rem'
  }
}
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

## Project Structure

```
apps/blog/
├── src/
│   ├── app/              # Next.js App Router
│   │   └── [locale]/     # i18n routes
│   ├── components/       # 62 React components
│   ├── lib/              # Utilities & design tokens
│   └── content/          # MDX blog posts
├── tailwind.config.ts    # Design tokens
├── DESIGN-SYSTEM.md      # Component documentation
└── README.md
```

## Key Components

### UI Primitives

| Component | Variants | Description |
|-----------|----------|-------------|
| `Button` | default, outline, ghost, link | Interactive button with CVA |
| `Card` | Compound | Container with Header, Content, Footer |
| `Badge` | default, outline, wood, steel | Status labels |
| `DropdownMenu` | - | Radix-based menu |

### Domain Components

- **Control Center**: macOS-inspired quick settings (theme, language, music)
- **Blog Card**: Article preview with hover effects
- **Resume Sections**: Modular resume builder
- **Chat Widget**: AI-powered assistant

## Performance

- **Lighthouse Score**: 90+ across all metrics
- **Core Web Vitals**: Optimized LCP, FID, CLS
- **Bundle**: Tree-shaking + code splitting

## Author

**Jaeil Lee** - Full-Stack Engineer

- Portfolio: [orangec-at.vercel.app](https://orangec-at.vercel.app)
- GitHub: [github.com/orangec-at](https://github.com/orangec-at)
- Email: radio941016@gmail.com

## License

MIT
