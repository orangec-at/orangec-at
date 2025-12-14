import { z } from "zod";

// 카테고리 및 태그 상수 (Zod enum 사용)
// 카테고리 key 상수
export const BLOG_CATEGORIES = [
  "dev-diary",
  "tech-review",
  "project",
  "tutorial",
  "retrospective",
  "tech-guide",
] as const;

// 태그 key 상수
export const COMMON_TAGS = [
  "react",
  "react-native",
  "typescript",
  "nextjs",
  "nodejs",
  "ios",
  "android",
  "app-store",
  "dev-diary",
  "supabase",
  "tailwindcss",
  "javascript",
  "tips",
  "development",
  "es6",
] as const;
// 카테고리 번역 맵핑
export const CATEGORY_TRANSLATIONS = {
  "dev-diary": { ko: "개발일기", en: "Dev Diary" },
  "tech-review": { ko: "기술리뷰", en: "Tech Review" },
  project: { ko: "프로젝트", en: "Project" },
  tutorial: { ko: "튜토리얼", en: "Tutorial" },
  retrospective: { ko: "회고", en: "Retrospective" },
  "tech-guide": { ko: "기술가이드", en: "Tech Guide" },
} as const;

// 태그 번역 맵핑
// 태그 번역 맵핑
export const TAG_TRANSLATIONS = {
  react: { ko: "React", en: "React" },
  "react-native": { ko: "React Native", en: "React Native" },
  typescript: { ko: "TypeScript", en: "TypeScript" },
  nextjs: { ko: "Next.js", en: "Next.js" },
  nodejs: { ko: "Node.js", en: "Node.js" },
  ios: { ko: "iOS", en: "iOS" },
  android: { ko: "Android", en: "Android" },
  "app-store": { ko: "앱스토어", en: "App Store" },
  "dev-diary": { ko: "개발일기", en: "Dev Diary" },
  supabase: { ko: "Supabase", en: "Supabase" },
  tailwindcss: { ko: "TailwindCSS", en: "TailwindCSS" },
  javascript: { ko: "JavaScript", en: "JavaScript" },
  tips: { ko: "팁", en: "Tips" },
  development: { ko: "개발", en: "Development" },
  es6: { ko: "ES6", en: "ES6" },
} as const;
// 번역 헬퍼 함수들
export function translateCategory(
  categoryKey: BlogCategory,
  locale: string = "ko"
): string {
  const translation = CATEGORY_TRANSLATIONS[categoryKey];
  return translation
    ? translation[locale as keyof typeof translation] || categoryKey
    : categoryKey;
}

export function translateTag(tagKey: string, locale: string = "ko"): string {
  const translation = TAG_TRANSLATIONS[tagKey as keyof typeof TAG_TRANSLATIONS];
  return translation
    ? translation[locale as keyof typeof translation] || tagKey
    : tagKey;
}

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
    .regex(
      /^(\d+분|\d+min)$/,
      "읽기 시간 형식은 '5분' 또는 '5min' 형태여야 합니다"
    )
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
