/**
 * Design System Validation Utilities
 * 
 * These utilities help prevent inconsistent styling patterns.
 * Use in development to catch design token violations.
 */

// Approved color patterns for the grayscale design system
const APPROVED_COLORS = {
  text: [
    'text-gray-900',
    'text-gray-800', 
    'text-gray-700',
    'text-gray-600',
    'text-gray-500',
    'text-white',
  ],
  background: [
    'bg-white',
    'bg-gray-50',
    'bg-gray-100',
    'bg-gray-800',
    'bg-gray-900',
  ],
  border: [
    'border-gray-200',
    'border-gray-300',
    'border-gray-400',
  ],
  hover: [
    'hover:bg-gray-50',
    'hover:bg-gray-100',
    'hover:bg-gray-800',
    'hover:text-gray-700',
    'hover:text-gray-900',
  ]
} as const;

// Forbidden color patterns (non-grayscale)
const FORBIDDEN_PATTERNS = [
  'blue-', 'red-', 'green-', 'yellow-', 'purple-', 'pink-', 
  'indigo-', 'cyan-', 'teal-', 'lime-', 'orange-', 'violet-'
];

/**
 * Validates if a className follows the approved design system
 */
export function validateClassName(className: string): {
  isValid: boolean;
  violations: string[];
  suggestions?: string[];
} {
  const violations: string[] = [];
  const suggestions: string[] = [];
  
  // Check for forbidden color patterns
  FORBIDDEN_PATTERNS.forEach(pattern => {
    if (className.includes(pattern)) {
      violations.push(`Found forbidden color pattern: ${pattern}`);
      
      // Suggest grayscale alternatives
      if (pattern === 'blue-') {
        suggestions.push('Use gray-900 for primary actions, gray-600 for secondary');
      }
    }
  });
  
  return {
    isValid: violations.length === 0,
    violations,
    suggestions: suggestions.length > 0 ? suggestions : undefined
  };
}

/**
 * Development-only function to scan component for design violations
 * Call this in development to check your components
 */
export function auditComponentColors(componentCode: string): {
  totalViolations: number;
  violations: Array<{ line: string; issue: string; suggestion?: string }>;
} {
  if (process.env.NODE_ENV === 'production') {
    return { totalViolations: 0, violations: [] };
  }
  
  const lines = componentCode.split('\n');
  const violations: Array<{ line: string; issue: string; suggestion?: string }> = [];
  
  lines.forEach((line, index) => {
    FORBIDDEN_PATTERNS.forEach(pattern => {
      if (line.includes(pattern)) {
        violations.push({
          line: `Line ${index + 1}: ${line.trim()}`,
          issue: `Uses forbidden color pattern: ${pattern}`,
          suggestion: pattern === 'blue-' ? 'Replace with gray- for grayscale consistency' : 'Use approved grayscale colors'
        });
      }
    });
  });
  
  return {
    totalViolations: violations.length,
    violations
  };
}

/**
 * Recommended className patterns for common use cases
 */
export const RECOMMENDED_PATTERNS = {
  primaryButton: 'bg-gray-900 text-white hover:bg-gray-800',
  secondaryButton: 'border border-gray-300 text-gray-900 hover:bg-gray-50',
  cardTitle: 'text-xl font-medium text-gray-900',
  bodyText: 'text-gray-600',
  mutedText: 'text-gray-500',
  primaryHeading: 'text-3rem font-bold text-gray-900',
  sectionHeading: 'text-1.875rem font-semibold text-gray-900',
} as const;

const designSystemValidation = {
  validateClassName,
  auditComponentColors,
  APPROVED_COLORS,
  RECOMMENDED_PATTERNS
};

export default designSystemValidation;