# MUJI-Inspired Design Aesthetic Guide

## Overview

This blog follows a **MUJI-inspired minimal design aesthetic** emphasizing clean organization, neutral tones, and systematic presentation. The design takes inspiration from MUJI retail displays - organized, minimal, and purposeful.

## Core Design Philosophy

### 1. Minimalism
- **Less is More**: Remove unnecessary elements
- **Generous Whitespace**: Let content breathe
- **Clear Hierarchy**: Systematic organization over decoration
- **Functional Beauty**: Every element serves a purpose

### 2. Neutral Color Palette
- **Primary**: White, black, grays
- **Warm Accents**: Wood tones (beige, natural browns)
- **Cool Accents**: Steel tones (cool grays)
- **No Bright Colors**: Maintain calm, neutral aesthetic

### 3. Systematic Organization
- **Grid-Based Layout**: Everything aligns to systematic grid
- **Consistent Spacing**: 8px base unit (8, 16, 24, 32, 48, 64)
- **Clear Categories**: Well-defined sections and groupings
- **Predictable Structure**: Users know where to find things

## Color System

### Primary Palette
```
White:    rgb(255, 255, 255) - Primary background
Black:    rgb(17, 24, 39)    - Primary text, emphasis
Gray-50:  rgb(249, 250, 251) - Light background
Gray-100: rgb(243, 244, 246) - Subtle background
Gray-200: rgb(229, 231, 235) - Borders
Gray-600: rgb(75, 85, 99)    - Secondary text
Gray-900: rgb(17, 24, 39)    - Primary text
```

### Wood Tones (Warm Neutrals)
```
Wood-50:  rgb(250, 249, 246) - Very light warm white
Wood-100: rgb(245, 242, 237) - Light wood, subtle warmth
Wood-200: rgb(235, 230, 222) - Soft beige
Wood-300: rgb(220, 213, 203) - Natural wood accent
Wood-700: rgb(115, 100, 85)  - Deep wood for text
```

### Steel Tones (Cool Accents)
```
Steel-100: rgb(241, 243, 245) - Light metallic
Steel-600: rgb(108, 117, 125) - Medium metallic
Steel-800: rgb(52, 58, 64)    - Dark metallic
```

## Typography

### Scale
- **Hero**: 3rem (48px) - Landing page headers
- **Section**: 1.875rem (30px) - Major section headers
- **Card Title**: 1.25rem (20px) - Card/component titles
- **Body**: 1rem (16px) - Regular text
- **Caption**: 0.875rem (14px) - Small text, labels

### Principles
- Use system fonts for clean rendering
- Regular weight (400) for body text
- Semibold (600) for headings
- Never bold body text
- Maintain excellent line-height (1.5-1.6)

## Layout System

### Container Widths
```
Narrow:  768px  - Reading content (articles)
Default: 1024px - General content
Wide:    1152px - Grid displays (projects, blog)
Full:    1280px - Full-width displays
```

### Grid Patterns
```
Two-Column:   Projects, large cards
Three-Column: Blog posts, medium cards
Four-Column:  Categories, small items
Auto-Fit:     Responsive flexible grids
```

### Spacing Scale (8px base unit)
```
Compact:    8px   - Tight internal spacing
Tight:      16px  - Normal element spacing
Element:    24px  - Standard spacing between elements
Card:       32px  - Card internal padding
Subsection: 48px  - Between subsections
Section:    64px  - Between major sections
```

## Component Patterns

### Cards

**Default Card** (for content display):
```tsx
<Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
  <CardContent className="p-card">
    {/* Content */}
  </CardContent>
</Card>
```

**Interactive Card** (hover states):
```tsx
<Card className="bg-white border border-gray-200 rounded-lg
                 hover:shadow-md hover:border-gray-300
                 transition-all duration-200">
  {/* Content */}
</Card>
```

**Wood-Toned Card** (special sections):
```tsx
<Card className="bg-wood-50 border border-wood-200 rounded-lg">
  {/* Content with warm accent */}
</Card>
```

### Badges/Tags

**Systematic Labeling**:
```tsx
// Standard gray badge (most common)
<Badge className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
  Category
</Badge>

// Wood-toned badge (warm accent)
<Badge className="bg-wood-100 text-wood-800 px-3 py-1 rounded-full text-sm">
  Featured
</Badge>

// Minimal badge (flat, subtle)
<Badge className="bg-gray-50 text-gray-600 px-3 py-1 text-sm">
  Tag
</Badge>
```

### Buttons

```tsx
// Primary action (black on white)
<Button className="bg-gray-900 text-white hover:bg-gray-800">
  Primary
</Button>

// Secondary action (outlined)
<Button className="border border-gray-300 hover:bg-gray-50">
  Secondary
</Button>

// Minimal action (text only)
<Button className="text-gray-600 hover:text-gray-900">
  Minimal
</Button>
```

## Real-World Examples

### Blog Post Grid
```tsx
<section className="max-w-6xl mx-auto px-4 py-12">
  {/* Header */}
  <div className="mb-12">
    <h1 className="text-3xl font-bold mb-3">Blog</h1>
    <p className="text-gray-600">Systematic collection of thoughts</p>
  </div>

  {/* Three-column grid */}
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {posts.map(post => (
      <BlogCard key={post.id} {...post} />
    ))}
  </div>
</section>
```

### Project Display
```tsx
<section className="max-w-6xl mx-auto px-4 py-12">
  {/* Header */}
  <div className="mb-12">
    <h1 className="text-3xl font-bold mb-3">Projects</h1>
    <p className="text-gray-600">A systematic collection of my work</p>
  </div>

  {/* Two-column grid for larger cards */}
  <div className="grid gap-6 md:grid-cols-2">
    {projects.map(project => (
      <ProjectCard key={project.id} {...project} />
    ))}
  </div>
</section>
```

## Visual Inspiration

Think of:
- MUJI retail stores: organized shelves, clear labels, neutral tones
- Japanese stationery: minimal, functional, beautiful
- Scandinavian design: clean lines, natural materials, whitespace
- Product packaging: clear hierarchy, systematic information

## Implementation Checklist

✅ **Colors**
- [ ] Only use gray-*, wood-*, steel-* colors
- [ ] No blue, red, green, purple colors
- [ ] Wood tones for warm accents only
- [ ] Steel tones for cool metallic accents

✅ **Layout**
- [ ] Use grid system from design tokens
- [ ] Maintain consistent spacing (8px units)
- [ ] Generous whitespace between sections
- [ ] Clear visual hierarchy

✅ **Components**
- [ ] Minimal card designs
- [ ] Systematic badge/tag styling
- [ ] Clean hover states (subtle transitions)
- [ ] No excessive shadows or gradients

✅ **Typography**
- [ ] Clear hierarchy (hero → section → body)
- [ ] Consistent weights (400, 600 only)
- [ ] Excellent readability (line-height 1.5+)
- [ ] System fonts for clean rendering

## Forbidden Patterns

❌ **Don't Use**:
- Bright colors (blue, red, green, yellow, purple)
- Colorful gradients
- Heavy shadows or 3D effects
- Decorative elements without purpose
- Inconsistent spacing
- Multiple font weights
- Rounded corners everywhere (use selectively)

## Questions?

When in doubt, ask:
1. Would MUJI display it this way?
2. Does it add value or just decoration?
3. Can I remove anything without losing meaning?
4. Is the spacing systematic and consistent?
5. Does it maintain the calm, neutral aesthetic?

**Remember**: The goal is calm, organized, purposeful design that lets content shine.
