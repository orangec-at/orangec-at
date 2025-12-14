"use client";

import DocumentEditor from "@/components/document-editor";
import { useState } from "react";

// Default frontmatter for new documents
const DEFAULT_META = {
  title: "New Document",
  type: "resume" as const,
  status: "draft" as const,
  createdAt: new Date().toISOString().split("T")[0],
  updatedAt: new Date().toISOString().split("T")[0],
  tags: [],
  locale: "ko" as const,
  slug: "new-document",
  filePath: "new-document.mdx",
};

// Default content template
const DEFAULT_CONTENT = `## 제목을 입력하세요

내용을 작성하세요.

### 소제목

- 항목 1
- 항목 2
- 항목 3
`;

export default function Home() {
  const [isEditorOpen, setIsEditorOpen] = useState(true);

  return (
    <main className="min-h-screen">
      {isEditorOpen ? (
        <DocumentEditor
          meta={DEFAULT_META}
          initialContent={DEFAULT_CONTENT}
          locale="ko"
          onClose={() => setIsEditorOpen(false)}
        />
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">MDX Editor</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              A standalone MDX editor with real-time preview
            </p>
            <button
              onClick={() => setIsEditorOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open Editor
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
