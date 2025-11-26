"use client";

import { mdxComponents } from "@/components/blog/mdx-components";
import { Button } from "@/components/ui";
import {
  BLOCK_CATEGORIES,
  type BlockCategory,
  type DocumentBlock,
  getBlocksByCategory,
} from "@/lib/document-blocks";
import { DocumentMeta } from "@/types/document-frontmatter";
import {
  Bold,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Code,
  Eye,
  EyeOff,
  FileText,
  FolderKanban,
  GraduationCap,
  Heading1,
  Heading2,
  Heading3,
  Heart,
  LayoutList,
  List,
  ListOrdered,
  Loader2,
  Lock,
  Minus,
  Quote,
  Save,
  Scissors,
  Sparkles,
  Star,
  Table,
  Type,
  User,
  X,
} from "lucide-react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { useCallback, useEffect, useRef, useState } from "react";

// 아이콘 매핑
const ICON_MAP: Record<string, React.ReactNode> = {
  Heading1: <Heading1 className="w-4 h-4" />,
  Heading2: <Heading2 className="w-4 h-4" />,
  Heading3: <Heading3 className="w-4 h-4" />,
  Type: <Type className="w-4 h-4" />,
  Bold: <Bold className="w-4 h-4" />,
  Quote: <Quote className="w-4 h-4" />,
  List: <List className="w-4 h-4" />,
  ListOrdered: <ListOrdered className="w-4 h-4" />,
  Minus: <Minus className="w-4 h-4" />,
  User: <User className="w-4 h-4" />,
  Briefcase: <Briefcase className="w-4 h-4" />,
  FolderKanban: <FolderKanban className="w-4 h-4" />,
  GraduationCap: <GraduationCap className="w-4 h-4" />,
  Code: <Code className="w-4 h-4" />,
  Table: <Table className="w-4 h-4" />,
  Star: <Star className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  LayoutList: <LayoutList className="w-4 h-4" />,
  Scissors: <Scissors className="w-4 h-4" />,
  Lock: <Lock className="w-4 h-4" />,
};

interface DocumentEditorProps {
  meta: DocumentMeta;
  initialContent: string;
  locale: string;
  onClose: () => void;
}

// 코드 정리 순수 함수 (컴포넌트 외부)
function beautifyContent(input: string): string {
  let formatted = input;

  // 1. 연속된 빈 줄을 2줄로 제한
  formatted = formatted.replace(/\n{3,}/g, "\n\n");

  // 2. 줄 끝 공백 제거
  formatted = formatted.replace(/[ \t]+$/gm, "");

  // 3. 헤딩 앞뒤 빈 줄 추가
  formatted = formatted.replace(/([^\n])\n(#{1,6} )/g, "$1\n\n$2");
  formatted = formatted.replace(/(#{1,6} .+)\n([^\n#])/g, "$1\n\n$2");

  // 4. JSX 블록 내부만 들여쓰기 정리 (줄 단위 파싱)
  const lines = formatted.split("\n");
  const formattedLines: string[] = [];
  const tagStack: string[] = []; // 열린 태그 스택

  for (const line of lines) {
    const trimmed = line.trim();

    // 빈 줄은 그대로
    if (!trimmed) {
      formattedLines.push("");
      continue;
    }

    // JSX 컨텍스트 외부 (마크다운)는 원본 유지
    if (tagStack.length === 0 && !trimmed.match(/^<[A-Z]/)) {
      formattedLines.push(line);
      continue;
    }

    // 닫는 태그 감지 (들여쓰기 전에 스택 업데이트)
    const closingTags = trimmed.match(/<\/([A-Za-z]+)>/g) || [];
    const openingTagsInLine = trimmed.match(/<([A-Z][a-zA-Z]*)[^/>]*(?:>|$)/g) || [];
    const selfClosingInLine = trimmed.match(/<[A-Z][a-zA-Z]*[^>]*\/>/g) || [];

    // 닫는 태그로 시작하면 먼저 스택에서 제거
    let tempIndent = tagStack.length;
    for (const closeTag of closingTags) {
      const tagName = closeTag.match(/<\/([A-Za-z]+)>/)?.[1];
      if (tagName && tagStack.includes(tagName)) {
        const idx = tagStack.lastIndexOf(tagName);
        tagStack.splice(idx, 1);
      }
    }

    // 닫는 태그로 시작하면 들여쓰기 감소
    if (trimmed.startsWith("</")) {
      tempIndent = tagStack.length;
    }

    // 들여쓰기 적용
    formattedLines.push("  ".repeat(tempIndent) + trimmed);

    // 여는 태그 스택에 추가 (자기 닫는 태그 제외)
    for (const openTag of openingTagsInLine) {
      const tagName = openTag.match(/<([A-Z][a-zA-Z]*)/)?.[1];
      // 같은 줄에 닫히지 않고, 자기 닫는 태그가 아닌 경우
      const isSelfClosing = selfClosingInLine.some(sc => sc.includes(`<${tagName}`));
      const isClosedInLine = trimmed.includes(`</${tagName}>`);
      if (tagName && !isSelfClosing && !isClosedInLine && openTag.endsWith(">")) {
        tagStack.push(tagName);
      }
    }

    // 소문자 HTML 태그도 처리 (thead, tbody 등)
    const htmlOpenTags = trimmed.match(/<(thead|tbody)[^/>]*>/g) || [];
    for (const tag of htmlOpenTags) {
      const tagName = tag.match(/<(thead|tbody)/)?.[1];
      if (tagName && !trimmed.includes(`</${tagName}>`)) {
        tagStack.push(tagName);
      }
    }
    const htmlCloseTags = trimmed.match(/<\/(thead|tbody)>/g) || [];
    for (const tag of htmlCloseTags) {
      const tagName = tag.match(/<\/(thead|tbody)>/)?.[1];
      if (tagName) {
        const idx = tagStack.lastIndexOf(tagName);
        if (idx >= 0) tagStack.splice(idx, 1);
      }
    }
  }

  formatted = formattedLines.join("\n");

  // 5. 파일 끝 빈 줄 하나 보장
  formatted = formatted.trimEnd() + "\n";

  return formatted;
}

export default function DocumentEditor({
  meta,
  initialContent,
  locale,
  onClose,
}: DocumentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [previewSource, setPreviewSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [editorWidth, setEditorWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const blocksByCategory = getBlocksByCategory();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Undo/Redo history
  const historyRef = useRef<string[]>([initialContent]);
  const historyIndexRef = useRef(0);
  const isUndoRedoRef = useRef(false);

  // Update history on content change
  const updateHistory = useCallback((newContent: string) => {
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false;
      return;
    }

    // 현재 위치 이후의 히스토리 삭제
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(newContent);
    historyIndexRef.current = historyRef.current.length - 1;

    // 최대 100개까지만 유지
    if (historyRef.current.length > 100) {
      historyRef.current = historyRef.current.slice(-100);
      historyIndexRef.current = historyRef.current.length - 1;
    }
  }, []);

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      isUndoRedoRef.current = true;
      setContent(historyRef.current[historyIndexRef.current]);
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      isUndoRedoRef.current = true;
      setContent(historyRef.current[historyIndexRef.current]);
    }
  }, []);

  // 리사이즈 핸들러
  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100;

      // 20% ~ 80% 범위로 제한
      setEditorWidth(Math.min(80, Math.max(20, newWidth)));
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const t = {
    blocks: locale === "ko" ? "블록" : "Blocks",
    save: locale === "ko" ? "저장" : "Save",
    saving: locale === "ko" ? "저장 중..." : "Saving...",
    saved: locale === "ko" ? "저장됨" : "Saved",
    error: locale === "ko" ? "저장 실패" : "Save failed",
    close: locale === "ko" ? "닫기" : "Close",
    clickToInsert: locale === "ko" ? "클릭하여 삽입" : "Click to insert",
    preview: locale === "ko" ? "미리보기" : "Preview",
    editor: locale === "ko" ? "에디터" : "Editor",
    compiling: locale === "ko" ? "컴파일 중..." : "Compiling...",
  };

  // MDX 미리보기 컴파일
  const compilePreview = useCallback(async (mdxContent: string) => {
    setIsCompiling(true);
    try {
      const response = await fetch("/api/documents/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: mdxContent }),
      });

      if (response.ok) {
        const data = await response.json();
        setPreviewSource(data.mdxSource);
      }
    } catch (error) {
      console.error("Preview compile error:", error);
    } finally {
      setIsCompiling(false);
    }
  }, []);

  // 디바운스된 미리보기 업데이트
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (previewOpen) {
        compilePreview(content);
      }
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [content, previewOpen, compilePreview]);

  // 블록 삽입
  const insertBlock = useCallback(
    (block: DocumentBlock) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = content.substring(0, start);
      const after = content.substring(end);

      const newContent = before + block.template + after;
      setContent(newContent);

      setTimeout(() => {
        textarea.focus();
        const newPosition = start + block.template.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);

      setSaveStatus("idle");
    },
    [content]
  );

  // 저장 (저장 전 자동 코드 정리)
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    // 저장 전 코드 정리 적용
    const formattedContent = beautifyContent(content);
    if (formattedContent !== content) {
      setContent(formattedContent);
      updateHistory(formattedContent);
    }

    try {
      const response = await fetch("/api/documents/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: meta.type,
          slug: meta.slug,
          content: `---
title: "${meta.title}"
type: "${meta.type}"
status: "${meta.status}"
${meta.company ? `company: "${meta.company}"` : ""}
${meta.targetPosition ? `targetPosition: "${meta.targetPosition}"` : ""}
${meta.description ? `description: "${meta.description}"` : ""}
createdAt: "${meta.createdAt}"
updatedAt: "${new Date().toISOString().split("T")[0]}"
tags: [${meta.tags.map((tag) => `"${tag}"`).join(", ")}]
locale: "${meta.locale}"
---

${formattedContent}`,
        }),
      });

      if (response.ok) {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  }, [content, meta, updateHistory]);

  // 코드 정리 (Beautify) - Cmd+Shift+F
  const handleBeautify = useCallback(() => {
    const formatted = beautifyContent(content);
    if (formatted !== content) {
      setContent(formatted);
      updateHistory(formatted);
      setSaveStatus("idle");
    }
  }, [content, updateHistory]);

  // Cmd+S 저장, Cmd+B 사이드바 토글, Cmd+Z Undo, Cmd+Shift+Z Redo, Cmd+Shift+F Format
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setSidebarOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      // Ctrl+Y for Redo (Windows style)
      if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
      // Cmd+Shift+F for Format/Beautify
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "f") {
        e.preventDefault();
        handleBeautify();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, undo, redo, handleBeautify]);

  // PDF 내보내기 (인쇄 다이얼로그)
  const handleExportPDF = useCallback(() => {
    // 미리보기가 닫혀있으면 먼저 열기
    if (!previewOpen) {
      setPreviewOpen(true);
      // 미리보기가 렌더링될 때까지 대기
      setTimeout(() => {
        window.print();
      }, 500);
    } else {
      window.print();
    }
  }, [previewOpen]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex print:relative print:h-auto">
      {/* Left Sidebar - Block List */}
      <div
        data-editor-sidebar
        className={`${
          sidebarOpen ? "w-56" : "w-12"
        } transition-all duration-200 border-r border-gray-200 dark:border-gray-800 flex-shrink-0 flex flex-col print:hidden`}
      >
        {/* Sidebar Header */}
        <div className="p-2 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          {sidebarOpen ? (
            <>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {t.blocks}
                </h3>
                <p className="text-xs text-gray-500">{t.clickToInsert}</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                title="Cmd+B"
              >
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded flex justify-center"
              title="Cmd+B"
            >
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* Block List */}
        <div className="flex-1 overflow-y-auto p-1">
          {(Object.entries(BLOCK_CATEGORIES) as [BlockCategory, { name: string; nameKo: string }][]).map(([categoryKey, category]) => (
            <div key={categoryKey} className="mb-2">
              {sidebarOpen && (
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 mb-1">
                  {locale === "ko" ? category.nameKo : category.name}
                </h4>
              )}
              <div className={sidebarOpen ? "space-y-0.5" : "space-y-1"}>
                {blocksByCategory[categoryKey]?.map((block: DocumentBlock) => (
                  <button
                    key={block.id}
                    onClick={() => insertBlock(block)}
                    title={sidebarOpen ? undefined : (locale === "ko" ? block.nameKo : block.name)}
                    className={`w-full flex items-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                      sidebarOpen
                        ? "gap-2 px-2 py-1.5 text-xs text-left"
                        : "justify-center p-2"
                    }`}
                  >
                    <span className="flex-shrink-0">
                      {ICON_MAP[block.icon] || <Type className="w-4 h-4" />}
                    </span>
                    {sidebarOpen && (
                      <span className="truncate text-xs">
                        {locale === "ko" ? block.nameKo : block.name}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div
          data-editor-toolbar
          className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 print:hidden"
        >
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm truncate max-w-[200px]">
              {meta.title}
            </h2>
            {saveStatus === "saved" && (
              <span className="text-xs text-green-600 dark:text-green-400">
                ✓ {t.saved}
              </span>
            )}
            {saveStatus === "error" && (
              <span className="text-xs text-red-600 dark:text-red-400">
                ✗ {t.error}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* 코드 정리 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBeautify}
              className="text-xs print:hidden"
              title="코드 정리"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              {locale === "ko" ? "정리" : "Format"}
            </Button>
            {/* 미리보기 토글 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPreviewOpen(!previewOpen)}
              className="text-xs print:hidden"
            >
              {previewOpen ? (
                <EyeOff className="w-4 h-4 mr-1" />
              ) : (
                <Eye className="w-4 h-4 mr-1" />
              )}
              {t.preview}
            </Button>
            {/* PDF 내보내기 */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              className="text-xs print:hidden"
              title="PDF로 저장 (Ctrl+P)"
            >
              <FileText className="w-4 h-4 mr-1" />
              PDF
            </Button>
            {/* 저장 */}
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="print:hidden"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-1" />
              )}
              {isSaving ? t.saving : t.save}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="print:hidden">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Editor + Preview Split */}
        <div ref={containerRef} className={`flex-1 flex overflow-hidden ${isDragging ? "select-none" : ""} print:block`}>
          {/* Code Editor */}
          <div
            data-editor-code
            className="flex flex-col print:hidden"
            style={{ width: previewOpen ? `${editorWidth}%` : "100%" }}
          >
            <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">
              {t.editor}
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => {
                const newValue = e.target.value;
                setContent(newValue);
                setSaveStatus("idle");
                // Debounced history update (500ms 이후 변경이 없으면 히스토리에 추가)
                setTimeout(() => {
                  if (textareaRef.current?.value === newValue) {
                    updateHistory(newValue);
                  }
                }, 500);
              }}
              className="flex-1 p-4 font-mono text-sm bg-white dark:bg-gray-950 resize-none focus:outline-none"
              placeholder="MDX 내용을 입력하세요..."
              spellCheck={false}
            />
          </div>

          {/* Resize Handle */}
          {previewOpen && (
            <div
              onMouseDown={handleMouseDown}
              className={`w-1 cursor-col-resize hover:bg-blue-500 transition-colors flex-shrink-0 ${
                isDragging ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          )}

          {/* Preview */}
          {previewOpen && (
            <div
              data-editor-preview
              className="flex flex-col print:w-full print:h-auto print:overflow-visible"
              style={{ width: `${100 - editorWidth}%` }}
            >
              <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 print:hidden">
                {t.preview}
                {isCompiling && (
                  <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-950 print:p-0 print:overflow-visible">
                {previewSource ? (
                  <article className="prose prose-sm max-w-none dark:prose-invert print:prose-print print:text-black">
                    <MDXRemote {...previewSource} components={mdxComponents} />
                  </article>
                ) : (
                  <div className="text-gray-400 text-sm print:hidden">
                    {isCompiling ? t.compiling : "미리보기가 여기에 표시됩니다."}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
