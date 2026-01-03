/**
 * MUJI-Inspired Design Token System
 *
 * This file defines the design tokens used throughout the application.
 * All components should use these tokens instead of hardcoded values.
 *
 * Design Philosophy:
 * - Minimal, clean aesthetic inspired by MUJI retail displays
 * - Systematic grid-based organization
 * - Neutral color palette: white, wood tones, steel, black
 * - Generous whitespace and clear visual hierarchy
 */

// Color System - MUJI Minimal Aesthetic
export const colors = {
  // Primary text colors
  text: {
    primary: 'text-gray-900 dark:text-white',
    secondary: 'text-gray-600 dark:text-gray-300',
    muted: 'text-gray-500 dark:text-gray-400',
    inverse: 'text-white dark:text-gray-900',
    wood: 'text-wood-700 dark:text-wood-300',  // Warm accent text
  },

  // Background colors
  background: {
    primary: 'bg-white dark:bg-gray-900',
    secondary: 'bg-gray-50 dark:bg-gray-800',
    muted: 'bg-gray-100 dark:bg-gray-700',
    dark: 'bg-gray-900 dark:bg-white',
    wood: 'bg-wood-50 dark:bg-wood-900',  // Warm background
    woodAccent: 'bg-wood-100 dark:bg-wood-800',  // Subtle wood accent
  },

  // Border colors
  border: {
    default: 'border-gray-300 dark:border-gray-600',
    light: 'border-gray-200 dark:border-gray-700',
    dark: 'border-gray-400 dark:border-gray-500',
    wood: 'border-wood-300 dark:border-wood-700',  // Wood accent borders
  },

  // Interactive states
  interactive: {
    primary: 'bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900',
    secondary: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white',
    ghost: 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white',
    subtle: 'hover:bg-wood-50 dark:hover:bg-wood-900 text-gray-900 dark:text-white',  // Subtle warm hover
  }
} as const;

// Typography Scale
export const typography = {
  hero: 'text-hero font-bold text-gray-900 dark:text-white',
  section: 'text-section font-semibold text-gray-900 dark:text-white', 
  cardTitle: 'text-card-title font-medium text-gray-900 dark:text-white',
  body: 'text-base text-gray-600 dark:text-gray-300',
  caption: 'text-sm text-gray-500 dark:text-gray-400',
} as const;

// Spacing System - Systematic 8px base unit (MUJI-inspired)
export const spacing = {
  section: 'space-y-section',        // 64px
  subsection: 'space-y-subsection',  // 48px
  card: 'space-y-card',              // 32px
  element: 'space-y-element',        // 24px
  tight: 'space-y-tight',            // 16px
  compact: 'space-y-compact',        // 8px
} as const;

// Grid System - Systematic organization like MUJI displays
export const grid = {
  // Container max widths for different content types
  container: {
    narrow: 'max-w-3xl',   // 768px - For reading content
    default: 'max-w-5xl',  // 1024px - For general content
    wide: 'max-w-6xl',     // 1152px - For grid displays
    full: 'max-w-7xl',     // 1280px - Full width displays
  },

  // Grid layouts matching MUJI's systematic displays
  layout: {
    // 2-column grid (like project displays)
    twoColumn: 'grid gap-grid-gap md:grid-cols-2',
    // 3-column grid (like blog posts)
    threeColumn: 'grid gap-grid-gap md:grid-cols-2 lg:grid-cols-3',
    // 4-column grid (like category displays)
    fourColumn: 'grid gap-grid-gap sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    // Auto-fit grid (responsive, fills available space)
    autoFit: 'grid gap-grid-gap grid-cols-[repeat(auto-fit,minmax(280px,1fr))]',
  },

  // Padding for different container types
  padding: {
    page: 'px-4 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16',
    section: 'px-4 py-6 md:px-6 md:py-8',
    card: 'p-card',
    compact: 'p-tight',
  }
} as const;

// Component Variants - MUJI minimal aesthetic
export const components = {
  button: {
    primary: 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors',
    secondary: 'border border-gray-300 dark:border-gray-600 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white',
    ghost: 'px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white',
    minimal: 'px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors',
  },

  // Card variants inspired by MUJI product displays
  card: {
    // Flat minimal card (like items on shelves)
    flat: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none',
    // Subtle card with minimal shadow
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm',
    // Slightly elevated card
    elevated: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md',
    // Wood-toned card for special sections
    wood: 'bg-wood-50 dark:bg-wood-900 border border-wood-200 dark:border-wood-800 rounded-lg',
    // Interactive card with hover state
    interactive: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200',
  },

  // Badge/Tag variants - systematic like MUJI labels
  badge: {
    // Standard gray badge
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium',
    // Outlined badge for subtle emphasis
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium',
    // Minimal badge (flat, no border)
    minimal: 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 text-sm',
    // Wood-toned badge for warm accent
    wood: 'bg-wood-100 dark:bg-wood-800 text-wood-800 dark:text-wood-200 px-3 py-1 rounded-full text-sm font-medium',
    // Steel-toned badge for metallic accent
    steel: 'bg-steel-100 dark:bg-steel-800 text-steel-800 dark:text-steel-200 px-3 py-1 rounded-full text-sm font-medium',
  }
} as const;

// Animation & Transitions
export const animations = {
  transition: 'transition-colors',
  hover: 'transition-all duration-200',
} as const;

// Export commonly used combinations
export const designTokens = {
  colors,
  typography,
  spacing,
  grid,
  components,
  animations,
} as const;

export default designTokens;

// Individual exports are already available via `export const` declarations above