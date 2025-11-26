"use client";

import { mdxComponents } from "@/components/blog/mdx-components";
import DocumentEditor from "@/components/documents/document-editor";
import { Badge, Button } from "@/components/ui";
import {
  DocumentMeta,
  DOCUMENT_STATUS_COLORS,
  translateDocumentStatus,
  translateDocumentType,
} from "@/types/document-frontmatter";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Download,
  Edit,
  Briefcase,
} from "lucide-react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Link from "next/link";
import { useRef, useState } from "react";

interface DocumentDetailClientProps {
  mdxSource: MDXRemoteSerializeResult;
  meta: DocumentMeta;
  rawContent: string;
  locale: string;
}

export default function DocumentDetailClient({
  mdxSource,
  meta,
  rawContent,
  locale,
}: DocumentDetailClientProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const isDraft = meta.status === "draft";

  const t = {
    back: locale === "ko" ? "목록으로" : "Back to List",
    exportPdf: locale === "ko" ? "PDF 내보내기" : "Export PDF",
    edit: locale === "ko" ? "편집" : "Edit",
    company: locale === "ko" ? "대상 회사" : "Company",
    position: locale === "ko" ? "지원 포지션" : "Position",
    created: locale === "ko" ? "작성일" : "Created",
    updated: locale === "ko" ? "수정일" : "Updated",
  };

  return (
    <>
      {/* Editor Modal */}
      {isEditorOpen && (
        <DocumentEditor
          meta={meta}
          initialContent={rawContent}
          locale={locale}
          onClose={() => setIsEditorOpen(false)}
        />
      )}

      <div className="min-h-screen bg-background print:bg-white">
        {/* Toolbar - 프린트 시 숨김 */}
        <div className="print:hidden sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 max-w-5xl">
            <div className="flex items-center justify-between">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/${locale}/documents`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t.back}
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                {isDraft && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setIsEditorOpen(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {t.edit}
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Download className="w-4 h-4 mr-2" />
                  {t.exportPdf}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl print:max-w-full print:p-0 print:m-0"
        >
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700 print:border-b-2 print:border-gray-300">
            <div className="flex items-center gap-2 mb-4 print:hidden">
              <Badge variant="outline">
                {translateDocumentType(meta.type, locale)}
              </Badge>
              <Badge
                variant="outline"
                className={DOCUMENT_STATUS_COLORS[meta.status]}
              >
                {translateDocumentStatus(meta.status, locale)}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white print:text-black mb-4">
              {meta.title}
            </h1>

            {meta.description && (
              <p className="text-lg text-gray-600 dark:text-gray-400 print:text-gray-700 mb-4">
                {meta.description}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 print:text-gray-600">
              {meta.company && (
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  <span>{meta.company}</span>
                </div>
              )}
              {meta.targetPosition && (
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{meta.targetPosition}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {t.created}:{" "}
                  {new Date(meta.createdAt).toLocaleDateString(
                    locale === "ko" ? "ko-KR" : "en-US"
                  )}
                </span>
              </div>
              {meta.updatedAt && meta.updatedAt !== meta.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {t.updated}:{" "}
                    {new Date(meta.updatedAt).toLocaleDateString(
                      locale === "ko" ? "ko-KR" : "en-US"
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* MDX Content */}
          <article
            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-p:text-gray-700 dark:prose-p:text-gray-300
            prose-a:text-blue-600 dark:prose-a:text-blue-400
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-li:text-gray-700 dark:prose-li:text-gray-300
            print:prose-sm print:text-black print:prose-headings:text-black"
          >
            <MDXRemote {...mdxSource} components={mdxComponents} />
          </article>
        </div>
      </div>
    </>
  );
}
