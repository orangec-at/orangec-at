"use client";

import { Badge, Button, Card } from "@/components/ui";
import {
  DocumentMeta,
  DocumentStatus,
  DocumentType,
  DOCUMENT_STATUS,
  DOCUMENT_STATUS_COLORS,
  DOCUMENT_TYPES,
  translateDocumentStatus,
  translateDocumentType,
} from "@/types/document-frontmatter";
import { FileText, FolderOpen, Filter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface DocumentsClientProps {
  documents: DocumentMeta[];
  stats: {
    total: number;
    byType: Record<DocumentType, number>;
    byStatus: Record<DocumentStatus, number>;
  };
  locale: string;
}

export default function DocumentsClient({
  documents,
  stats,
  locale,
}: DocumentsClientProps) {
  const [filterType, setFilterType] = useState<DocumentType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<DocumentStatus | "all">(
    "all"
  );

  const filteredDocuments = documents.filter((doc) => {
    if (filterType !== "all" && doc.type !== filterType) return false;
    if (filterStatus !== "all" && doc.status !== filterStatus) return false;
    return true;
  });

  const t = {
    title: locale === "ko" ? "문서 관리" : "Document Management",
    subtitle:
      locale === "ko"
        ? "이력서, 자기소개서, 포트폴리오를 한 곳에서 관리하세요"
        : "Manage resumes, cover letters, and portfolios in one place",
    allTypes: locale === "ko" ? "전체 타입" : "All Types",
    allStatus: locale === "ko" ? "전체 상태" : "All Status",
    noDocuments:
      locale === "ko"
        ? "문서가 없습니다. 새 문서를 만들어보세요!"
        : "No documents yet. Create your first document!",
    total: locale === "ko" ? "전체" : "Total",
    viewDocument: locale === "ko" ? "보기" : "View",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t.total}
                </p>
              </div>
            </div>
          </Card>
          {DOCUMENT_TYPES.map((type) => (
            <Card key={type} className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.byType[type]}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {translateDocumentType(type, locale)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as DocumentType | "all")
              }
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            >
              <option value="all">{t.allTypes}</option>
              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {translateDocumentType(type, locale)}
                </option>
              ))}
            </select>
          </div>
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as DocumentStatus | "all")
            }
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
          >
            <option value="all">{t.allStatus}</option>
            {DOCUMENT_STATUS.map((status) => (
              <option key={status} value={status}>
                {translateDocumentStatus(status, locale)}
              </option>
            ))}
          </select>
        </div>

        {/* Document List */}
        {filteredDocuments.length === 0 ? (
          <Card className="p-12 text-center">
            <FolderOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{t.noDocuments}</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredDocuments.map((doc) => (
              <DocumentCard key={doc.slug} document={doc} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DocumentCard({
  document: doc,
  locale,
}: {
  document: DocumentMeta;
  locale: string;
}) {
  const typeFolder = {
    resume: "resumes",
    "cover-letter": "cover-letters",
    portfolio: "portfolio",
  }[doc.type];

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg shrink-0">
            <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {doc.title}
              </h3>
              <Badge
                variant="outline"
                className={DOCUMENT_STATUS_COLORS[doc.status]}
              >
                {translateDocumentStatus(doc.status, locale)}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <span>{translateDocumentType(doc.type, locale)}</span>
              {doc.company && (
                <>
                  <span>•</span>
                  <span>{doc.company}</span>
                </>
              )}
              {doc.targetPosition && (
                <>
                  <span>•</span>
                  <span>{doc.targetPosition}</span>
                </>
              )}
              <span>•</span>
              <span>
                {new Date(doc.updatedAt || doc.createdAt).toLocaleDateString(
                  locale === "ko" ? "ko-KR" : "en-US"
                )}
              </span>
            </div>
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/${locale}/documents/${typeFolder}/${doc.slug}`}>
            {locale === "ko" ? "보기" : "View"}
          </Link>
        </Button>
      </div>
    </Card>
  );
}
