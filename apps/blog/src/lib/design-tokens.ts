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
    primary: 'text-gray-900 dark:text-white',
    secondary: 'text-gray-600 dark:text-gray-300', 
    muted: 'text-gray-500 dark:text-gray-400',
    inverse: 'text-white dark:text-gray-900',
  },
  
  // Background colors
  background: {
    primary: 'bg-white dark:bg-gray-900',
    secondary: 'bg-gray-50 dark:bg-gray-800',
    muted: 'bg-gray-100 dark:bg-gray-700',
    dark: 'bg-gray-900 dark:bg-white',
  },
  
  // Border colors
  border: {
    default: 'border-gray-300 dark:border-gray-600',
    light: 'border-gray-200 dark:border-gray-700',
    dark: 'border-gray-400 dark:border-gray-500',
  },
  
  // Interactive states
  interactive: {
    primary: 'bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900',
    secondary: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white',
    ghost: 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white',
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

// Spacing System
export const spacing = {
  section: 'space-y-section',
  card: 'space-y-card',
  element: 'space-y-element',
} as const;

// Component Variants
export const components = {
  button: {
    primary: 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors',
    secondary: 'border border-gray-300 dark:border-gray-600 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white',
    ghost: 'px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white',
  },
  card: {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm',
    elevated: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md',
  },
  badge: {
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium',
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