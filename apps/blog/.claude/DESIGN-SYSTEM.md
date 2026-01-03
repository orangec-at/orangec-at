# MUJI-Inspired Design System

## Overview

This project follows a **MUJI-inspired minimal design aesthetic** emphasizing clean organization, neutral tones, systematic presentation, and generous whitespace. All UI components should adhere to this design philosophy and token system.

**For comprehensive design guidelines, see**: [MUJI-AESTHETIC-GUIDE.md](./MUJI-AESTHETIC-GUIDE.md)

## Design Philosophy

- **Minimalism**: Clean, purposeful, organized like MUJI retail displays
- **Neutral Palette**: Grayscale + wood tones (warm) + steel tones (cool)
- **Systematic Layout**: Grid-based organization with 8px base unit
- **Generous Whitespace**: Let content breathe
- **Semantic Naming**: Use design tokens from `/lib/design-tokens.ts`
- **Component Consistency**: shadcn/ui components as the foundation
- **Accessibility**: WCAG AA compliant color contrasts

## Color System

### Approved Colors

#### Primary Grayscale
```css
/* Text Colors */
text-gray-900  /* Primary text */
text-gray-600  /* Secondary text */
text-gray-500  /* Muted text */
text-white     /* Inverse text */

/* Background Colors */
bg-white       /* Primary background */
bg-gray-50     /* Light background */
bg-gray-100    /* Subtle background */
bg-gray-900    /* Dark/primary actions */

/* Border Colors */
border-gray-200  /* Light borders */
border-gray-300  /* Default borders */
border-gray-400  /* Emphasized borders */
```

#### Wood Tones (Warm Accents)
```css
/* For warm, natural accents - use sparingly */
bg-wood-50      /* Very light warm background */
bg-wood-100     /* Light wood accent background */
text-wood-700   /* Warm accent text */
border-wood-200 /* Warm accent borders */
```

#### Steel Tones (Cool Accents)
```css
/* For metallic, cool accents - use sparingly */
bg-steel-100    /* Light metallic background */
text-steel-700  /* Cool metallic text */
border-steel-300 /* Metallic borders */
```

### Forbidden Colors

❌ **Never use**: `blue-*`, `red-*`, `green-*`, `purple-*`, `yellow-*`, `orange-*`
✅ **Always use**: `gray-*`, `wood-*` (sparingly), `steel-*` (sparingly), `white`
⚠️ **Wood/Steel usage**: Only for subtle accents, not as primary colors

## Grid System (MUJI-Inspired)

All layouts should use the systematic grid system for consistent organization:

```typescript
import { grid } from '@/lib/design-tokens';

// Container widths
<section className={`${grid.container.wide} mx-auto ${grid.padding.page}`}>
  {/* Content */}
</section>

// Grid layouts
<div className={grid.layout.twoColumn}>      {/* Projects, large cards */}
<div className={grid.layout.threeColumn}>    {/* Blog posts */}
<div className={grid.layout.fourColumn}>     {/* Categories */}
```

### Spacing Scale (8px base unit)
```
compact:    8px   - Tight internal spacing
tight:      16px  - Normal element spacing
element:    24px  - Standard spacing between elements
card:       32px  - Card internal padding
subsection: 48px  - Between subsections
section:    64px  - Between major sections
```

## Typography Scale

```typescript
// Import and use design tokens
import { designTokens } from '@/lib/design-tokens';

// Hero headings (landing page)
className={designTokens.typography.hero}

// Section headings (h2)
className={designTokens.typography.section}

// Card titles (h3)
className={designTokens.typography.cardTitle}

// Body text
className={designTokens.typography.body}

// Small/muted text
className={designTokens.typography.caption}
```

## Component Patterns

### Buttons

```tsx
// Primary action (dark)
<Button>Primary Action</Button>

// Secondary action (outline)
<Button variant="secondary">Secondary Action</Button>

// Ghost action (minimal)
<Button variant="ghost">Ghost Action</Button>
```

### Cards

```tsx
import { Card, CardHeader, CardContent } from "@/components/ui/card";

<Card className={designTokens.components.card.default}>
  <CardHeader>
    <h3 className={designTokens.typography.cardTitle}>Title</h3>
  </CardHeader>
  <CardContent>
    <p className={designTokens.typography.body}>Content</p>
  </CardContent>
</Card>;
```

### Badges/Tags

```tsx
import { components } from '@/lib/design-tokens';

// Standard gray badge (most common)
<Badge className={components.badge.default}>Frontend</Badge>

// Outlined badge (subtle emphasis)
<Badge className={components.badge.outline}>Backend</Badge>

// Minimal badge (flat, subtle)
<Badge className={components.badge.minimal}>Tag</Badge>

// Wood-toned badge (warm accent - use sparingly)
<Badge className={components.badge.wood}>Featured</Badge>

// Steel-toned badge (cool accent - use sparingly)
<Badge className={components.badge.steel}>System</Badge>
```

### Cards (MUJI-Style)

```tsx
import { components } from '@/lib/design-tokens';

// Default card (most common)
<Card className={components.card.default}>
  <CardContent>{/* Content */}</CardContent>
</Card>

// Interactive card (with hover state)
<Card className={components.card.interactive}>
  <CardContent>{/* Content */}</CardContent>
</Card>

// Flat card (minimal, like items on shelves)
<Card className={components.card.flat}>
  <CardContent>{/* Content */}</CardContent>
</Card>

// Wood-toned card (warm accent section)
<Card className={components.card.wood}>
  <CardContent>{/* Content */}</CardContent>
</Card>
```

## Implementation Rules

### ✅ Do

- Use `designTokens` from `/lib/design-tokens.ts`
- Follow MUJI-inspired systematic layouts
- Use the grid system for all page layouts
- Maintain 8px base unit spacing
- Use wood/steel tones sparingly for subtle accents
- Follow shadcn/ui component patterns
- Test color contrast for accessibility
- Generous whitespace between sections
- Clear visual hierarchy

### ❌ Don't

- Use hardcoded colors (use design tokens)
- Mix bright color schemes (no blues, greens, reds, etc.)
- Create custom color utilities outside the system
- Inconsistent spacing (stick to 8px units)
- Overuse wood/steel tones (they're accents only)
- Excessive shadows or decorative elements
- Skip the grid system for layouts

## Enforcement

### Development Validation

```typescript
import { auditComponentColors } from "@/lib/design-system-validation";

// In development, audit your component
const audit = auditComponentColors(componentCode);
if (audit.totalViolations > 0) {
  console.warn("Design system violations:", audit.violations);
}
```

### Pre-commit Hook (Optional)

```bash
# Add to package.json scripts
"design-audit": "grep -r 'blue-\\|red-\\|green-' src/ && exit 1 || exit 0"
```

## Migration Guide

If you find non-grayscale colors in existing components:

1. **Identify the violation**: `grep -r "blue-" src/`
2. **Find the appropriate token**: Check `/lib/design-tokens.ts`
3. **Replace with semantic equivalent**:
   - `bg-blue-600` → `bg-gray-900` (primary action)
   - `text-blue-600` → `text-gray-700` (link text)
   - `hover:bg-blue-50` → `hover:bg-gray-50` (hover state)

## Resources

- **Design Tokens**: `/src/lib/design-tokens.ts`
- **Validation**: `/src/lib/design-system-validation.ts`
- **shadcn/ui Components**: `/src/components/ui/`
- **Tailwind Config**: `/tailwind.config.ts`

## Questions?

When in doubt:

1. Check existing components for patterns
2. Use `designTokens` instead of hardcoded values
3. Prefer grayscale over any color
4. Test with design system validation utilities
