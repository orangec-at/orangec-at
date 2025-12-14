import { getDocumentWithContent } from "@/lib/document-utils.server";
import { DocumentType } from "@/types/document-frontmatter";
import { serialize } from "next-mdx-remote/serialize";
import { notFound } from "next/navigation";
import DocumentDetailClient from "./client";

// 폴더명을 문서 타입으로 변환
const FOLDER_TYPE_MAP: Record<string, DocumentType> = {
  resumes: "resume",
  "cover-letters": "cover-letter",
  portfolio: "portfolio",
};

interface DocumentPageProps {
  params: Promise<{ locale: string; type: string; slug: string }>;
}

export async function generateMetadata({ params }: DocumentPageProps) {
  const { type, slug } = await params;

  const docType = FOLDER_TYPE_MAP[type];
  if (!docType) {
    return { title: "Not Found" };
  }

  const result = await getDocumentWithContent(docType, slug);
  if (!result) {
    return { title: "Not Found" };
  }

  return {
    title: result.meta.title,
    description: result.meta.description || result.meta.title,
    robots: {
      index: false, // 문서는 검색 엔진에서 제외
      follow: false,
    },
  };
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { locale, type, slug } = await params;

  const docType = FOLDER_TYPE_MAP[type];
  if (!docType) {
    notFound();
  }

  const result = await getDocumentWithContent(docType, slug);
  if (!result) {
    notFound();
  }

  const mdxSource = await serialize(result.content);

  return (
    <DocumentDetailClient
      mdxSource={mdxSource}
      meta={result.meta}
      locale={locale}
    />
  );
}
