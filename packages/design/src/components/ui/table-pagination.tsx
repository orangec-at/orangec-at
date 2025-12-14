"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@orangec-at/design/components/ui/pagination";

import { buildPageItems } from "./pagination-utils";

interface TablePaginationProps {
  totalPages: number;
  currentPage: number; // 1-based index
  onPageChange: (page: number) => void; // 1-based index
  onPrevious: () => void;
  onNext: () => void;
  canPrevious: boolean;
  canNext: boolean;
}

export function TablePagination({
  totalPages,
  currentPage,
  onPageChange,
  onPrevious,
  onNext,
  canPrevious,
  canNext,
}: TablePaginationProps) {
  // 데스크톱 1줄 레이아웃
  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="flex items-center space-x-2 w-full">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPrevious();
                }}
                className={!canPrevious ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {/* 견고한 페이지네이션 생성 (boundaryCount + siblingCount) */}
            {(() => {
              const current = currentPage - 1; // Convert to 0-based index
              const total = totalPages;
              const pageItems = buildPageItems({
                total,
                current,
                minVisible: 9, // 데스크톱에서는 9개
                boundaryCount: 1,
              });

              return pageItems.map((item, idx) =>
                item === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(item + 1); // Convert back to 1-based index
                      }}
                      isActive={item === current}
                    >
                      {item + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              );
            })()}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNext();
                }}
                className={!canNext ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
