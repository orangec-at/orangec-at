/**
 * Design Token System for Grayscale Portfolio
 * 
 * This file defines the design tokens used throughout the application.
 * All components should use these tokens instead of hardcoded values.
 */

// Color System - Grayscale Based
export const colors = {
  // Primary text colors
  text: {
    primary: 'text-gray-900',
    secondary: 'text-gray-600', 
    muted: 'text-gray-500',
    inverse: 'text-white',
  },
  
  // Background colors
  background: {
    primary: 'bg-white',
    secondary: 'bg-gray-50',
    muted: 'bg-gray-100',
    dark: 'bg-gray-900',
  },
  
  // Border colors
  border: {
    default: 'border-gray-300',
    light: 'border-gray-200',
    dark: 'border-gray-400',
  },
  
  // Interactive states
  interactive: {
    primary: 'bg-gray-900 hover:bg-gray-800 text-white',
    secondary: 'border border-gray-300 hover:bg-gray-50 text-gray-900',
    ghost: 'hover:bg-gray-50 text-gray-900',
  }
} as const;

// Typography Scale
export const typography = {
  hero: 'text-hero font-bold text-gray-900',
  section: 'text-section font-semibold text-gray-900', 
  cardTitle: 'text-card-title font-medium text-gray-900',
  body: 'text-base text-gray-600',
  caption: 'text-sm text-gray-500',
} as const;

// Spacing System
export const spacing = {
  section: 'space-y-section',
  card: 'space-y-card',
  element: 'space-y-element',
} as const;

// Component Variants
export const components = {
  button: {
    primary: 'bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors',
    secondary: 'border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-900',
    ghost: 'px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-900',
  },
  card: {
    default: 'bg-white border border-gray-200 rounded-lg shadow-sm',
    elevated: 'bg-white border border-gray-200 rounded-lg shadow-md',
  },
  badge: {
    default: 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium',
    outline: 'border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm font-medium',
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
  components,
  animations,
} as const;

export default designTokens;