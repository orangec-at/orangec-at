import { getAllDocuments, getDocumentStats } from "@/lib/document-utils.server";
import DocumentsClient from "./client";

interface DocumentsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: DocumentsPageProps) {
  const { locale } = await params;

  return {
    title: locale === "ko" ? "문서 관리" : "Document Management",
    description:
      locale === "ko"
        ? "이력서, 자기소개서, 포트폴리오 문서 관리"
        : "Manage resumes, cover letters, and portfolio documents",
  };
}

export default async function DocumentsPage({ params }: DocumentsPageProps) {
  const { locale } = await params;

  const [documents, stats] = await Promise.all([
    getAllDocuments({ includeDrafts: true }),
    getDocumentStats(),
  ]);

  return <DocumentsClient documents={documents} stats={stats} locale={locale} />;
}
