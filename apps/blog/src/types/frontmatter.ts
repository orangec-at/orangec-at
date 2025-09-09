import { z } from "zod";

// 카테고리 및 태그 상수 (Zod enum 사용)
export const BLOG_CATEGORIES = [
  "개발일기",
  "기술리뷰",
  "프로젝트",
  "튜토리얼",
  "회고",
  "기술가이드",
] as const;

export const COMMON_TAGS = [
  "React",
  "React Native",
  "TypeScript",
  "Next.js",
  "Node.js",
  "iOS",
  "Android",
  "앱스토어",
  "개발일기",
  "Supabase",
  "TailwindCSS",
] as const;

// SEO 메타데이터 스키마
const seoSchema = z
  .object({
    keywords: z.array(z.string()).optional(),
    ogImage: z.string().url().optional(),
    canonicalUrl: z.string().url().optional(),
  })
  .optional();

// MDX Frontmatter Zod 스키마
export const frontmatterSchema = z.object({
  title: z
    .string()
    .min(1, "제목은 필수입니다")
    .max(100, "제목은 100자 이하여야 합니다"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "날짜 형식은 YYYY-MM-DD여야 합니다"),
  tags: z
    .array(z.string())
    .max(10, "태그는 최대 10개까지 가능합니다")
    .default([]),
  description: z.string().max(300, "설명은 300자 이하여야 합니다").optional(),
  author: z.string().default("Jaeil Lee"),
  category: z.enum(BLOG_CATEGORIES).optional(),
  readTime: z
    .string()
    .regex(/^\d+분$/, "읽기 시간 형식은 '5분' 형태여야 합니다")
    .optional(),
  relatedProjects: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  thumbnail: z.string().optional(), // URL 또는 상대 경로 허용
  draft: z.boolean().default(false),
  seo: seoSchema,
});

// 타입 추론
export type MDXFrontmatter = z.infer<typeof frontmatterSchema>;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
export type CommonTag = (typeof COMMON_TAGS)[number];

// MDX 파일 전체 구조
export interface MDXPost {
  frontmatter: MDXFrontmatter;
  content: string;
  slug: string;
}

// Zod 검증 및 파싱 함수
export function validateAndParseFrontmatter(data: unknown): MDXFrontmatter {
  try {
    return frontmatterSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Frontmatter validation errors:", error.issues);
      // 기본값으로 fallback
      const fallbackData = data as Record<string, unknown>;
      return frontmatterSchema.parse({
        title: fallbackData.title || "Untitled",
        date: fallbackData.date || new Date().toISOString().split("T")[0],
      });
    }
    throw error;
  }
}

// 안전한 파싱 (에러시 null 반환)
export function safeParseFrontmatter(data: unknown): MDXFrontmatter | null {
  const result = frontmatterSchema.safeParse(data);
  if (result.success) {
    return result.data;
  }

  console.warn("Frontmatter validation failed:", result.error.issues);
  return null;
}
