/**
 * MDX 커스텀 컴포넌트 중앙 레지스트리
 * Simplified version for standalone MDX editor
 */

import type { ComponentType, ReactNode } from "react";

// ============================================
// Component Metadata
// ============================================

export interface ComponentMeta {
  id: string;
  name: string;
  nameKo: string;
  icon: string;
  category: string;
  template: string;
  description?: string;
  component?: ComponentType<any>;
  props?: Record<string, any>;
}

// ============================================
// Component Categories
// ============================================

export const COMPONENT_CATEGORIES = {
  ui: { name: "UI Components", nameKo: "UI 컴포넌트" },
  layout: { name: "Layout", nameKo: "레이아웃" },
  resume: { name: "Resume", nameKo: "이력서" },
  data: { name: "Data Display", nameKo: "데이터 표시" },
} as const;

// ============================================
// Component Registry
// ============================================

const COMPONENT_REGISTRY: ComponentMeta[] = [
  // Add your custom components here
];

// ============================================
// Export Functions
// ============================================

/**
 * Get all component blocks for editor
 */
export function getComponentBlocks(): ComponentMeta[] {
  return COMPONENT_REGISTRY;
}

/**
 * Get component by ID
 */
export function getComponentById(id: string): ComponentMeta | undefined {
  return COMPONENT_REGISTRY.find((comp) => comp.id === id);
}

/**
 * Get components by category
 */
export function getComponentsByCategory(
  category: keyof typeof COMPONENT_CATEGORIES
): ComponentMeta[] {
  return COMPONENT_REGISTRY.filter((comp) => comp.category === category);
}

/**
 * MDX custom components map (for rendering)
 */
export const mdxCustomComponents: Record<string, ComponentType<any>> = {};
