# Grayscale Portfolio Design System

## Overview
This project follows a **minimal grayscale design system** emphasizing readability, professionalism, and consistency. All UI components should adhere to this color palette and token system.

## Design Philosophy
- **Grayscale First**: Black, white, and gray shades only
- **Semantic Naming**: Use design tokens, not hardcoded values
- **Component Consistency**: shadcn/ui components as the foundation
- **Accessibility**: WCAG AA compliant color contrasts

## Color System

### Approved Colors
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

### Forbidden Colors
❌ **Never use**: `blue-*`, `red-*`, `green-*`, `purple-*`, etc.  
✅ **Always use**: `gray-*`, `white`, CSS custom properties from shadcn/ui

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
import { Card, CardHeader, CardContent } from '@/components/ui/card';

<Card className={designTokens.components.card.default}>
  <CardHeader>
    <h3 className={designTokens.typography.cardTitle}>Title</h3>
  </CardHeader>
  <CardContent>
    <p className={designTokens.typography.body}>Content</p>
  </CardContent>
</Card>
```

### Badges/Tags
```tsx
// Use grayscale variants only
<Badge className="bg-gray-100 text-gray-800">Frontend</Badge>
<Badge className="bg-gray-200 text-gray-800">Backend</Badge>
<Badge className="bg-gray-800 text-gray-100">Infra</Badge>
```

## Implementation Rules

### ✅ Do
- Use `designTokens` from `/lib/design-tokens.ts`
- Follow shadcn/ui component patterns
- Use semantic CSS custom properties (`var(--primary)`)
- Test color contrast for accessibility

### ❌ Don't  
- Use hardcoded colors (`text-blue-600`)
- Mix color schemes (no blues, greens, etc.)
- Create custom color utilities outside the system
- Use non-semantic class names

## Enforcement

### Development Validation
```typescript
import { auditComponentColors } from '@/lib/design-system-validation';

// In development, audit your component
const audit = auditComponentColors(componentCode);
if (audit.totalViolations > 0) {
  console.warn('Design system violations:', audit.violations);
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