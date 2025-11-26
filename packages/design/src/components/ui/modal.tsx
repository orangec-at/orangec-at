"use client";

import { Close } from "@/components/svgs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { headingVariants } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import * as React from "react";

// 모달 크기 타입
export type ModalSize = "small" | "xmedium" | "medium" | "large" | "max";

// 모달 크기 설정
const modalSizes: Record<ModalSize, string> = {
  small: "!max-w-[400px] !min-w-[296px]",
  xmedium: "!max-w-[454px] !min-w-[296px]",
  medium: "!max-w-[560px] !min-w-[296px]",
  large: "!max-w-[720px] !min-w-[296px]",
  max: "!max-w-[1200px] !min-w-[296px]",
};

// 액션 버튼 인터페이스
export interface ModalAction {
  label: string;
  variant?:
    | "default"
    | "secondary"
    | "tertiary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link";
  onClick: () => void;
  disabled?: boolean;
}

// 폼 필드 인터페이스
export interface ModalFormField {
  name: string;
  label: string;
  type?: "text" | "password" | "email";
  placeholder?: string;
  required?: boolean;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
}

// 범용 모달 Props
export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // 모달 기본 설정
  title?: string;
  size?: ModalSize;
  showCloseButton?: boolean;

  // 본문 콘텐츠
  children?: React.ReactNode;

  // 푸터 영역 (자유로운 구성 가능)
  footer?: React.ReactNode;

  // 스타일 오버라이드
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  size = "medium",
  showCloseButton = true,
  children,
  footer,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
}: ModalProps) {
  const handleClose = React.useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "p-0 flex flex-col max-h-[1200px] overflow-hidden",
          "border border-(--krds-gray-30) rounded-[16px]",
          modalSizes[size],
          className
        )}
      >
        {/* 헤더 영역 */}
        <div
          className={cn(
            "sticky top-0 z-10 bg-white flex-shrink-0 p-(--padding-8)",
            headerClassName
          )}
        >
          <div className="flex items-center justify-between">
            {title && (
              <div className="flex-1">
                <DialogTitle
                  className={cn(headingVariants({ variant: "m-700" }))}
                >
                  {title}
                </DialogTitle>
              </div>
            )}
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors focus-ring"
                aria-label="모달 닫기"
              >
                <Close className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* 본문 영역 - 스크롤 가능 */}
        <div
          className={cn(
            "flex-1 overflow-y-auto px-(--padding-8)",
            contentClassName
          )}
        >
          {children}
        </div>

        {/* 푸터 영역 - sticky bottom */}
        {footer && (
          <div
            className={cn(
              "sticky bottom-0 z-10 flex-shrink-0 bg-white px-(--padding-8) py-(--padding-6)",
              footerClassName
            )}
          >
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
