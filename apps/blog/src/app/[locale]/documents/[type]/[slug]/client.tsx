"use client";

import { mdxComponents } from "@/components/blog/mdx-components";
import { Badge, Button } from "@orangec-at/design";
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
  Briefcase,
} from "lucide-react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Link from "next/link";
import { useRef } from "react";
import { withLocalePath } from "@/lib/locale-path";

interface DocumentDetailClientProps {
  mdxSource: MDXRemoteSerializeResult;
  meta: DocumentMeta;
  locale: string;
}

export default function DocumentDetailClient({
  mdxSource,
  meta,
  locale,
}: DocumentDetailClientProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const t = {
    back: locale === "ko" ? "목록으로" : "Back to List",
    exportPdf: locale === "ko" ? "PDF 내보내기" : "Export PDF",
    company: locale === "ko" ? "대상 회사" : "Company",
    position: locale === "ko" ? "지원 포지션" : "Position",
    created: locale === "ko" ? "작성일" : "Created",
    updated: locale === "ko" ? "수정일" : "Updated",
  };

  return (
    <>
      <div className="min-h-screen bg-[#f4f1ea] dark:bg-black pt-28 md:pt-32 print:bg-white print:pt-0">
        {/* Toolbar - 프린트 시 숨김 */}
        <div className="print:hidden sticky top-20 z-10 bg-[#f4f1ea]/80 dark:bg-black/80 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 max-w-5xl">
            <div className="flex items-center justify-between">
              <Button asChild variant="ghost" size="sm">
                <Link href={withLocalePath(locale, "/documents")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t.back}
                </Link>
              </Button>
              <div className="flex items-center gap-2">
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
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl print:mx-auto print:p-0 print:m-0 document-print-container"
        >
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-stone-200 dark:border-stone-700 print:border-b-2 print:border-stone-300">
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

            <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 print:text-black mb-4">
              {meta.title}
            </h1>

            {meta.description && (
              <p className="text-lg text-stone-600 dark:text-stone-400 print:text-stone-700 mb-4">
                {meta.description}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-stone-500 dark:text-stone-400 print:text-stone-600">
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
            prose-headings:font-bold prose-headings:text-stone-900 dark:prose-headings:text-stone-100
            prose-p:text-stone-700 dark:prose-p:text-stone-300
            prose-a:text-[#FF5F1F] dark:prose-a:text-[#FF5F1F]
            prose-strong:text-stone-900 dark:prose-strong:text-stone-100
            prose-li:text-stone-700 dark:prose-li:text-stone-300
            print:prose-sm print:text-black print:prose-headings:text-black"
          >
            <MDXRemote {...mdxSource} components={mdxComponents} />
          </article>
        </div>
      </div>
    </>
  );
}
