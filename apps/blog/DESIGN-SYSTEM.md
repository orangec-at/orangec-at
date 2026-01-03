# Design System - orangec-at

A comprehensive design system powering the orangec-at portfolio blog, featuring **62 production-ready components** built with React, TypeScript, Tailwind CSS, and Radix UI.

## Overview

| Metric                | Value                                                  |
| --------------------- | ------------------------------------------------------ |
| **Total Components**  | 62                                                     |
| **UI Primitives**     | 13                                                     |
| **Domain Components** | 49                                                     |
| **Design Tokens**     | Centralized (Tailwind + TypeScript) - Used in 8+ files |
| **Typography System** | CVA-based with 8 components, 40+ variants              |
| **MUJI Utilities**    | Used in 20+ files (149+ occurrences)                   |
| **Accessibility**     | WCAG 2.1 AA (Radix UI)                                 |
| **Dark Mode**         | Full support                                           |
| **Testing**           | Jest + Testing Library                                 |

**Live Demo**: [orangec-at.vercel.app](https://orangec-at.vercel.app)

---

## Design Philosophy

Inspired by **MUJI's minimal aesthetic**:

- **Clean & Minimal**: Generous whitespace, clear visual hierarchy
- **Systematic**: 8px base unit grid system
- **Neutral Palette**: White, wood tones, steel, black
- **Accessible**: WCAG 2.1 AA compliant with Radix UI primitives
- **Dark Mode First**: All components support light/dark themes

---

## Design Tokens

### Color System

```typescript
// src/lib/design-tokens.ts

export const colors = {
  // Text Colors
  text: {
    primary: "text-gray-900 dark:text-white",
    secondary: "text-gray-600 dark:text-gray-300",
    muted: "text-gray-500 dark:text-gray-400",
    wood: "text-wood-700 dark:text-wood-300", // Warm accent
  },

  // Background Colors
  background: {
    primary: "bg-white dark:bg-gray-900",
    secondary: "bg-gray-50 dark:bg-gray-800",
    wood: "bg-wood-50 dark:bg-wood-900", // MUJI-inspired warm
  },

  // Interactive States
  interactive: {
    primary: "bg-gray-900 dark:bg-white hover:bg-gray-800",
    ghost: "hover:bg-gray-50 dark:hover:bg-gray-800",
    subtle: "hover:bg-wood-50 dark:hover:bg-wood-900",
  },
};
```

### Tailwind Config Tokens

```typescript
// tailwind.config.ts

{
  colors: {
    brand: { primary, secondary, accent },
    gray: { 50-900 },
    wood: { 50-900 },   // MUJI-inspired wood tones
    steel: { 50-900 }   // Metallic accents
  },
  fontSize: {
    'hero': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
    'section': ['1.875rem', { lineHeight: '1.2', fontWeight: '600' }],
    'card-title': ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
  },
  spacing: {
    'section': '4rem',      // 64px - Major sections
    'subsection': '3rem',   // 48px
    'card': '2rem',         // 32px
    'element': '1.5rem',    // 24px
    'tight': '1rem',        // 16px
    'compact': '0.5rem',    // 8px base unit
    'grid-gap': '1.5rem',   // 24px
  }
}
```

### Grid System

```typescript
export const grid = {
  container: {
    narrow: "max-w-3xl", // 768px - Reading content
    default: "max-w-5xl", // 1024px - General content
    wide: "max-w-6xl", // 1152px - Grid displays
    full: "max-w-7xl", // 1280px - Full width
  },
  layout: {
    twoColumn: "grid gap-grid-gap md:grid-cols-2",
    threeColumn: "grid gap-grid-gap md:grid-cols-2 lg:grid-cols-3",
    autoFit: "grid gap-grid-gap grid-cols-[repeat(auto-fit,minmax(280px,1fr))]",
  },
};
```

---

## Component Architecture

### Tech Stack

- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Radix UI** - Accessible primitives
- **class-variance-authority (CVA)** - Variant management
- **Framer Motion** - Animations

### Component Patterns

#### 1. Variant-Based Components (CVA)

```tsx
// components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md transition-all...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs",
        destructive: "bg-destructive text-white shadow-xs",
        outline: "border bg-background shadow-xs",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-10 rounded-md px-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

#### 2. Compound Components

```tsx
// components/ui/card.tsx
export {
  Card, // Container
  CardHeader, // Header section
  CardTitle, // Title text
  CardDescription, // Description text
  CardAction, // Action buttons
  CardContent, // Main content
  CardFooter, // Footer section
};

// Usage
<Card>
  <CardHeader>
    <CardTitle>Project Title</CardTitle>
    <CardDescription>Description here</CardDescription>
  </CardHeader>
  <CardContent>{/* Content */}</CardContent>
</Card>;
```

#### 3. Slot-Based Composition (Radix)

```tsx
// Polymorphic component with asChild
<Button asChild>
  <Link href="/projects">View Projects</Link>
</Button>
```

---

## Component Catalog

### UI Primitives (13 components)

| Component       | Description            | Variants                                              |
| --------------- | ---------------------- | ----------------------------------------------------- |
| `Button`        | Interactive button     | default, destructive, outline, secondary, ghost, link |
| `Card`          | Container component    | Compound: Header, Title, Description, Content, Footer |
| `Badge`         | Status/category label  | default, outline, minimal, wood, steel                |
| `Avatar`        | User profile image     | sizes: sm, md, lg                                     |
| `Typography`    | Text styles            | h1-h6, body, caption                                  |
| `DropdownMenu`  | Context menu           | Radix UI based                                        |
| `CodeBlock`     | Syntax highlighting    | With copy button                                      |
| `Textarea`      | Multi-line input       | With validation states                                |
| `DotGrid`       | Decorative background  | -                                                     |
| `SpotlightCard` | Hover spotlight effect | -                                                     |
| `ProfileCard`   | User profile display   | -                                                     |
| `SplitText`     | Animated text reveal   | -                                                     |
| `PageBreak`     | Visual separator       | -                                                     |

### Domain Components (49 components)

#### Layout (4)

- `AppNavigation` - Main navigation
- `ResponsiveHeader` - Mobile/desktop header
- `Footer` - Site footer
- `BackgroundMusic` - Ambient audio player

#### Home Page (7)

- `HomeHero` - Hero section
- `AboutMe` - Bio section
- `TechStack` - Skills display
- `FeaturedProjects` - Project showcase
- `ServicesSection` - Services offered
- `CareerTimeline` - Work history
- `ContactCTA` - Contact call-to-action

#### Blog (4)

- `BlogCard` - Article preview
- `BlogCTASection` - Newsletter signup
- `MDXComponents` - MDX rendering
- `RelatedProjectsSection` - Related content

#### Control Center (13)

- `ControlCenter` - macOS-style control panel
- `ControlCenterDock` - Dock container
- `ControlCenterTrigger` - Toggle button
- Items: Theme, Language, MusicPlayer, Connectivity, Info, Media, QuickAction, Slider

#### Resume (12)

- `ResumeSection` - Section container
- `ResumeTable` - Data table
- Sections: PersonalInfo, Introduction, Experience, Skills, Education, Certificate, Military, ProjectHighlights

#### Project (1)

- `ProjectCard` - Project showcase card

#### Contact (3)

- `ContactHero` - Contact page hero
- `ContactForm` - Contact form
- `SocialLinks` - Social media links

#### RAG Chat (3)

- `ChatWidget` - AI chat interface
- `ChatMessages` - Message list
- `ChatInput` - Message input

#### Theme (1)

- `ThemeToggle` - Dark/light mode switch

---

## Accessibility

### WCAG 2.1 AA Compliance

- **Radix UI Primitives**: All interactive components use Radix UI for built-in accessibility
- **Keyboard Navigation**: Full keyboard support (Tab, Enter, Escape, Arrow keys)
- **Screen Reader**: Semantic HTML, ARIA labels, live regions
- **Focus Management**: Visible focus indicators, focus trapping in modals
- **Color Contrast**: Minimum 4.5:1 ratio for text

### Accessibility Features by Component

| Component    | Features                                         |
| ------------ | ------------------------------------------------ |
| Button       | `role="button"`, keyboard activation, focus ring |
| DropdownMenu | Arrow key navigation, Escape to close            |
| Card         | Semantic structure, landmark regions             |
| Badge        | Color-independent meaning                        |

---

## Dark Mode

Full dark mode support with CSS custom properties:

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
```

All components automatically adapt:

- Text colors invert
- Background colors adjust
- Interactive states update
- Shadows reduce in dark mode

---

## Testing

### Jest + Testing Library

```bash
# Run tests
pnpm test

# Run with coverage
pnpm test:coverage
```

Example test:

```typescript
// components/ui/__tests__/badge.test.tsx
import { render, screen } from "@testing-library/react";
import { Badge } from "../badge";

describe("Badge", () => {
  it("renders with default variant", () => {
    render(<Badge>Test</Badge>);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("applies variant classes correctly", () => {
    render(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText("Outline")).toHaveClass("border");
  });
});
```

---

## Usage Examples

### Basic Button

```tsx
import { Button } from '@/components/ui/button';

<Button variant="default">Primary Action</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Tertiary</Button>
```

### Card with Content

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Project Name</CardTitle>
    <CardDescription>A brief description of the project</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Detailed content goes here...</p>
  </CardContent>
</Card>;
```

### Using Design Tokens

```tsx
import { colors, typography, spacing } from "@/lib/design-tokens";

<div className={`${colors.background.primary} ${spacing.section}`}>
  <h1 className={typography.hero}>Welcome</h1>
  <p className={typography.body}>Description text</p>
</div>;
```

---

## File Structure

```
src/
├── components/
│   ├── ui/                 # Primitives (13)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── typography.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── code-block.tsx
│   │   ├── textarea.tsx
│   │   ├── DotGrid.tsx
│   │   ├── SpotlightCard.tsx
│   │   ├── ProfileCard.tsx
│   │   ├── split-text.tsx
│   │   ├── page-break.tsx
│   │   └── __tests__/
│   │       └── badge.test.tsx
│   │
│   ├── layout/             # Layout (4)
│   ├── home/               # Home page (7)
│   ├── blog/               # Blog (4)
│   ├── control-center/     # Control panel (13)
│   ├── resume/             # Resume (12)
│   ├── project/            # Project (1)
│   ├── contact/            # Contact (3)
│   ├── rag/                # AI Chat (3)
│   └── theme/              # Theme (1)
│
├── lib/
│   ├── design-tokens.ts    # Centralized tokens
│   └── utils.ts            # Utility functions (cn)
│
└── app/
    └── globals.css         # CSS custom properties
```

---

## Design Decisions

### Why Tailwind CSS?

- **Design tokens in config**: Single source of truth
- **Utility-first**: Rapid iteration, no context switching
- **Dark mode**: Built-in support with `dark:` prefix
- **Bundle size**: Purges unused styles

### Why Radix UI?

- **Accessibility**: WAI-ARIA compliant out of the box
- **Unstyled**: Full control over appearance
- **Composable**: Flexible component composition
- **Focus management**: Proper focus trapping and restoration

### Why CVA (class-variance-authority)?

- **Type-safe variants**: Full TypeScript support
- **Composable**: Combine with `cn()` utility
- **Readable**: Clear variant definitions
- **Maintainable**: Centralized variant logic

---

## Contributing

### Adding New Components

1. Create component in appropriate directory
2. Use CVA for variants
3. Apply design tokens from `design-tokens.ts`
4. Ensure dark mode support
5. Add accessibility attributes
6. Write tests in `__tests__/`
7. Update this documentation

### Design Token Updates

1. Update `tailwind.config.ts` for Tailwind tokens
2. Update `src/lib/design-tokens.ts` for TypeScript tokens
3. Ensure consistency between both systems
4. Test across light/dark modes

---

## Author

**Jaeil Lee** - Full-Stack Engineer

- Portfolio: [orangec-at.vercel.app](https://orangec-at.vercel.app)
- GitHub: [github.com/orangec-at](https://github.com/orangec-at)

---

_This design system is production-tested and actively maintained._
