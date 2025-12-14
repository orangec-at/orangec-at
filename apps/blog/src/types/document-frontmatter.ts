import { z } from "zod";

// 문서 타입 상수
export const DOCUMENT_TYPES = ["resume", "cover-letter", "portfolio"] as const;

// 문서 상태 상수
export const DOCUMENT_STATUS = ["draft", "ready", "submitted", "archived"] as const;

// 문서 타입 번역
export const DOCUMENT_TYPE_TRANSLATIONS = {
  resume: { ko: "이력서", en: "Resume" },
  "cover-letter": { ko: "자기소개서", en: "Cover Letter" },
  portfolio: { ko: "포트폴리오", en: "Portfolio" },
} as const;

// 문서 상태 번역
export const DOCUMENT_STATUS_TRANSLATIONS = {
  draft: { ko: "작성중", en: "Draft" },
  ready: { ko: "준비완료", en: "Ready" },
  submitted: { ko: "제출완료", en: "Submitted" },
  archived: { ko: "보관", en: "Archived" },
} as const;

// 상태별 색상
export const DOCUMENT_STATUS_COLORS = {
  draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  ready: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  archived: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
} as const;

// 문서 Frontmatter Zod 스키마
export const documentFrontmatterSchema = z.object({
  title: z
    .string()
    .min(1, "제목은 필수입니다")
    .max(100, "제목은 100자 이하여야 합니다"),
  type: z.enum(DOCUMENT_TYPES),
  status: z.enum(DOCUMENT_STATUS).default("draft"),
  company: z.string().optional(), // 대상 회사
  targetPosition: z.string().optional(), // 지원 포지션
  description: z.string().max(500, "설명은 500자 이하여야 합니다").optional(),
  createdAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "날짜 형식은 YYYY-MM-DD여야 합니다"),
  updatedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "날짜 형식은 YYYY-MM-DD여야 합니다")
    .optional(),
  tags: z.array(z.string()).default([]),
  locale: z.enum(["ko", "en"]).default("ko"),
  // PDF 관련 설정
  pdfSettings: z
    .object({
      paperSize: z.enum(["a4", "letter"]).default("a4"),
      margins: z.enum(["normal", "narrow", "wide"]).default("normal"),
    })
    .optional(),
});

// 타입 추론
export type DocumentFrontmatter = z.infer<typeof documentFrontmatterSchema>;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];
export type DocumentStatus = (typeof DOCUMENT_STATUS)[number];

// 문서 메타데이터 (slug 포함)
export interface DocumentMeta extends DocumentFrontmatter {
  slug: string;
  filePath: string;
}

// 번역 헬퍼 함수
export function translateDocumentType(
  type: DocumentType,
  locale: string = "ko"
): string {
  const translation = DOCUMENT_TYPE_TRANSLATIONS[type];
  return translation
    ? translation[locale as keyof typeof translation] || type
    : type;
}

export function translateDocumentStatus(
  status: DocumentStatus,
  locale: string = "ko"
): string {
  const translation = DOCUMENT_STATUS_TRANSLATIONS[status];
  return translation
    ? translation[locale as keyof typeof translation] || status
    : status;
}

// Zod 검증 및 파싱 함수
export function validateAndParseDocumentFrontmatter(
  data: unknown
): DocumentFrontmatter {
  try {
    return documentFrontmatterSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Document frontmatter validation errors:", error.issues);
      // 기본값으로 fallback
      const fallbackData = data as Record<string, unknown>;
      return documentFrontmatterSchema.parse({
        title: fallbackData.title || "Untitled",
        type: fallbackData.type || "resume",
        status: fallbackData.status || "draft",
        createdAt:
          fallbackData.createdAt || new Date().toISOString().split("T")[0],
      });
    }
    throw error;
  }
}

// 안전한 파싱 (에러시 null 반환)
export function safeParseDocumentFrontmatter(
  data: unknown
): DocumentFrontmatter | null {
  const result = documentFrontmatterSchema.safeParse(data);
  if (result.success) {
    return result.data;
  }

  console.warn("Document frontmatter validation failed:", result.error.issues);
  return null;
}
