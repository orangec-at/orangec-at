"use client";

import { Spinner } from "@orangec-at/design/components/svgs";
import { Button } from "@orangec-at/design/components/ui/button";
import { inputVariants } from "@orangec-at/design/components/ui/input";
import {
  Body as KRDSBody,
  Label as KRDSLabel,
} from "@orangec-at/design/components/ui/typography";

import { useAlert } from "@orangec-at/design/contexts/AlertContext";
import { cn } from "@orangec-at/design/lib/utils";
import { CheckCircle, DeleteIcon, Download, Upload } from "lucide-react";
import { useRef, useState } from "react";

interface FileUploadProps {
  value?: string;
  onChange?: (files: File[]) => void;
  accept?: string;
  className?: string;
  placeholder?: string;
  // 외부에서 제어할 수 있는 props
  mode?: "upload" | "view"; // upload: 파일첨부 버튼 표시, view: 파일 정보만 표시
  fileState?: "loading" | "completed" | "error" | "removable" | "downloadable";
  fileInfo?: { name: string; size: string; type: string } | null;
  onDownload?: () => void;
  onPreview?: () => void;
  onDelete?: () => void;
}

export function FileUpload({
  value,
  onChange,
  accept = ".pdf,.jpg,.jpeg,.png",
  className,
  placeholder = "",
  mode = "upload",
  fileState,
  fileInfo: externalFileInfo,
  onDownload,
  onPreview,
  onDelete,
}: FileUploadProps) {
  const { showAlert } = useAlert();

  // 내부 state (외부 props가 없을 때만 사용)
  const [internalState, setInternalState] = useState<
    "loading" | "completed" | "error" | "removable" | "downloadable" | null
  >(null);

  // ex) 파일이름.pdf [PDF, 1MB]
  const [internalFileInfo, setInternalFileInfo] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 외부 props가 있으면 외부 값 사용, 없으면 내부 state 사용
  const state = fileState ?? internalState;
  const fileInfo = externalFileInfo ?? internalFileInfo;

  /** 파일 첨부 버튼 클릭 */
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i)) + sizes[i];
  };

  const getFileType = (fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "PDF";
      case "jpg":
      case "jpeg":
        return "JPG";
      case "png":
        return "PNG";
      default:
        return extension?.toUpperCase() || "FILE";
    }
  };

  /** 파일 선택 시 change 이벤트 */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      const file = files[0];

      // 10MB 용량 제한 체크 (5 * 1024 * 1024 = 5242880 bytes)
      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        showAlert("파일 용량은 10MB를 초과할 수 없습니다.");
        // input 값 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      const size = formatFileSize(file.size);
      const type = getFileType(file.name);

      setInternalFileInfo({ name: file.name, size, type });
      onChange?.(files);

      // 업로드 프로세스 시작
      setInternalState("loading");

      // 가짜 업로드 딜레이 (예: 1초 후 완료)
      setTimeout(() => {
        setInternalState("completed");
        setTimeout(() => {
          setInternalState("removable");
        }, 1000);
      }, 1000);
    }
  };

  //파일명 확장자 제거
  const getFileNameWithoutExt = (fileName: string): string => {
    const parts = fileName.split(".");
    if (parts.length > 1) {
      parts.pop();
    }
    return parts.join(".");
  };

  // 파일 초기화 핸들러
  const handleRemoveFile = () => {
    setInternalFileInfo(null); // 파일 정보 초기화
    setInternalState(null); // 상태 초기화
    onChange?.([]); // 상위에 빈 배열 전달
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // input value 초기화
    }
    onDelete?.();
  };

  return (
    <div className={cn("flex flex-row items-start gap-(--gap-3)", className)}>
      {mode === "upload" && (
        <>
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <Button
            type="button"
            variant="tertiary"
            size="small"
            onClick={handleFileClick}
            className="shrink-0"
          >
            파일첨부
            <Upload size={16} />
          </Button>
        </>
      )}

      <div
        className={cn(
          inputVariants({ state: "default", size: "small" }),
          "!min-h-(--number-15) !h-full !py-(--padding-4)",
          "flex flex-row items-center justify-between gap-(--gap-2)",
          mode === "view" && "w-full"
        )}
      >
        <KRDSBody
          variant={"m-400"}
          className="line-clamp-1 flex-1 min-w-0 break-all"
        >
          {fileInfo
            ? `${getFileNameWithoutExt(fileInfo.name)} [${fileInfo.type}, ${
                fileInfo.size
              }]`
            : "파일없음"}
        </KRDSBody>
        {state === "loading" && (
          <Spinner className="w-5 h-5 animate-spin text-(--krds-primary-50) shrink-0" />
        )}
        {state === "completed" && (
          <CheckCircle className="w-5 h-5 text-(--krds-primary-50) shrink-0" />
        )}
        {state === "removable" && (
          <button
            type="button"
            onClick={handleRemoveFile}
            className="flex items-center gap-(--gap-2) cursor-pointer hover:opacity-70 shrink-0 focus-ring"
            title="첨부 파일 삭제"
          >
            <KRDSLabel variant={"m-400"}>삭제</KRDSLabel>
            <DeleteIcon className="w-5 h-5 " />
          </button>
        )}
        {state === "downloadable" && (
          <div className="flex items-center gap-(--gap-5) shrink-0 self-auto">
            <button
              onClick={onDownload}
              className="flex items-center gap-(--gap-2) cursor-pointer hover:opacity-70 focus-ring"
              title={`${fileInfo?.name ?? "첨부 파일"} 다운로드`}
            >
              <KRDSLabel variant={"m-400"} className="whitespace-nowrap">
                다운로드
              </KRDSLabel>
              <Download className="w-5 h-5 " />
            </button>
          </div>
        )}
        {/* TODO: 에러 상태 추가 */}
      </div>
    </div>
  );
}
