// 서버 전용 문서 유틸리티
import { promises as fs } from "fs";
import matter from "gray-matter";
import path from "path";
import {
  DocumentFrontmatter,
  DocumentMeta,
  DocumentStatus,
  DocumentType,
  DOCUMENT_TYPES,
  validateAndParseDocumentFrontmatter,
} from "../types/document-frontmatter";

const DOCUMENTS_DIR = "documents";

// 문서 타입별 폴더 매핑
const TYPE_FOLDER_MAP: Record<DocumentType, string> = {
  resume: "resumes",
  "cover-letter": "cover-letters",
  portfolio: "portfolio",
};

// 폴더명을 문서 타입으로 변환
const FOLDER_TYPE_MAP: Record<string, DocumentType> = {
  resumes: "resume",
  "cover-letters": "cover-letter",
  portfolio: "portfolio",
};

/**
 * 단일 문서 메타데이터 가져오기
 */
export async function getDocumentMeta(
  type: DocumentType,
  slug: string
): Promise<DocumentMeta | null> {
  try {
    const folder = TYPE_FOLDER_MAP[type];
    const filePath = path.join(
      process.cwd(),
      DOCUMENTS_DIR,
      folder,
      `${slug}.mdx`
    );
    const source = await fs.readFile(filePath, "utf-8");
    const { data } = matter(source);

    const frontmatter = validateAndParseDocumentFrontmatter(data);

    return {
      ...frontmatter,
      slug,
      filePath: `${folder}/${slug}.mdx`,
    };
  } catch (error) {
    console.error(`Failed to read document meta for ${type}/${slug}:`, error);
    return null;
  }
}

/**
 * 문서 콘텐츠와 메타데이터 함께 가져오기
 */
export async function getDocumentWithContent(
  type: DocumentType,
  slug: string
): Promise<{ meta: DocumentMeta; content: string } | null> {
  try {
    const folder = TYPE_FOLDER_MAP[type];
    const filePath = path.join(
      process.cwd(),
      DOCUMENTS_DIR,
      folder,
      `${slug}.mdx`
    );
    const source = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(source);

    const frontmatter = validateAndParseDocumentFrontmatter(data);

    return {
      meta: {
        ...frontmatter,
        slug,
        filePath: `${folder}/${slug}.mdx`,
      },
      content,
    };
  } catch (error) {
    console.error(
      `Failed to read document with content for ${type}/${slug}:`,
      error
    );
    return null;
  }
}

/**
 * 특정 타입의 모든 문서 가져오기
 */
export async function getDocumentsByType(
  type: DocumentType,
  options?: {
    status?: DocumentStatus[];
    includeDrafts?: boolean;
  }
): Promise<DocumentMeta[]> {
  try {
    const folder = TYPE_FOLDER_MAP[type];
    const dir = path.join(process.cwd(), DOCUMENTS_DIR, folder);

    // 폴더가 없으면 빈 배열 반환
    try {
      await fs.access(dir);
    } catch {
      return [];
    }

    const files = await fs.readdir(dir);
    const mdxFiles = files.filter(
      (file) => file.endsWith(".mdx") && !file.startsWith("_")
    );

    const documents = await Promise.all(
      mdxFiles.map(async (filename) => {
        const slug = filename.replace(/\.mdx$/, "");
        return await getDocumentMeta(type, slug);
      })
    );

    let filtered = documents.filter(
      (doc): doc is DocumentMeta => doc !== null
    );

    // 상태 필터링
    if (options?.status && options.status.length > 0) {
      filtered = filtered.filter((doc) => options.status!.includes(doc.status));
    }

    // draft 제외 (프로덕션 환경에서)
    if (!options?.includeDrafts && process.env.NODE_ENV === "production") {
      filtered = filtered.filter((doc) => doc.status !== "draft");
    }

    // 최신순 정렬
    return filtered.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt);
      const dateB = new Date(b.updatedAt || b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error(`Failed to get documents for type ${type}:`, error);
    return [];
  }
}

/**
 * 모든 문서 가져오기
 */
export async function getAllDocuments(options?: {
  status?: DocumentStatus[];
  includeDrafts?: boolean;
}): Promise<DocumentMeta[]> {
  const allDocuments: DocumentMeta[] = [];

  for (const type of DOCUMENT_TYPES) {
    const docs = await getDocumentsByType(type, options);
    allDocuments.push(...docs);
  }

  // 최신순 정렬
  return allDocuments.sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt);
    const dateB = new Date(b.updatedAt || b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * 회사별 문서 그룹화
 */
export async function getDocumentsGroupedByCompany(): Promise<
  Map<string, DocumentMeta[]>
> {
  const allDocs = await getAllDocuments({ includeDrafts: true });
  const grouped = new Map<string, DocumentMeta[]>();

  for (const doc of allDocs) {
    const company = doc.company || "기타";
    if (!grouped.has(company)) {
      grouped.set(company, []);
    }
    grouped.get(company)!.push(doc);
  }

  return grouped;
}

/**
 * 문서 slug 목록 가져오기 (정적 경로 생성용)
 */
export async function getAllDocumentSlugs(): Promise<
  Array<{ type: DocumentType; slug: string }>
> {
  const allSlugs: Array<{ type: DocumentType; slug: string }> = [];

  for (const type of DOCUMENT_TYPES) {
    const folder = TYPE_FOLDER_MAP[type];
    const dir = path.join(process.cwd(), DOCUMENTS_DIR, folder);

    try {
      await fs.access(dir);
      const files = await fs.readdir(dir);
      const mdxFiles = files.filter(
        (file) => file.endsWith(".mdx") && !file.startsWith("_")
      );

      mdxFiles.forEach((filename) => {
        const slug = filename.replace(/\.mdx$/, "");
        allSlugs.push({ type, slug });
      });
    } catch {
      // 폴더가 없으면 skip
    }
  }

  return allSlugs;
}

/**
 * 문서 통계 가져오기
 */
export async function getDocumentStats(): Promise<{
  total: number;
  byType: Record<DocumentType, number>;
  byStatus: Record<DocumentStatus, number>;
}> {
  const allDocs = await getAllDocuments({ includeDrafts: true });

  const byType = DOCUMENT_TYPES.reduce(
    (acc, type) => {
      acc[type] = allDocs.filter((doc) => doc.type === type).length;
      return acc;
    },
    {} as Record<DocumentType, number>
  );

  const byStatus = {
    draft: allDocs.filter((doc) => doc.status === "draft").length,
    ready: allDocs.filter((doc) => doc.status === "ready").length,
    submitted: allDocs.filter((doc) => doc.status === "submitted").length,
    archived: allDocs.filter((doc) => doc.status === "archived").length,
  };

  return {
    total: allDocs.length,
    byType,
    byStatus,
  };
}
