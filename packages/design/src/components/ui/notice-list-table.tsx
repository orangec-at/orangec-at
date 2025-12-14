"use client";

import * as React from "react";
import { cn } from "@orangec-at/design/lib/utils";
import { titleVariants } from "@orangec-at/design/components/ui/typography";

// 새로운 공지사항 전용 테이블 컴포넌트
function NoticeListTable({
  className,
  ...props
}: React.ComponentProps<"table">) {
  return (
    <div data-slot="notice-table-container" className="relative w-full">
      <table
        data-slot="notice-table"
        className={cn(
          "w-full caption-bottom text-sm border-collapse",
          className
        )}
        {...props}
      />
    </div>
  );
}

function NoticeListTableHeader({
  className,
  ...props
}: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="notice-table-header"
      className={cn(
        "bg-white border-t-2 border-b border-b-(--krds-gray-30) border-t-(--border-secondary)",
        className
      )}
      {...props}
    />
  );
}

function NoticeListTableBody({
  className,
  ...props
}: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="notice-table-body"
      className={cn("[&>tr]:border-b", className)}
      {...props}
    />
  );
}

interface NoticeListTableRowProps extends React.ComponentProps<"tr"> {
  clickable?: boolean;
}

function NoticeListTableRow({
  className,
  clickable,
  ...props
}: NoticeListTableRowProps) {
  return (
    <tr
      data-slot="notice-table-row"
      className={cn(
        "border-b border-(--krds-gray-30)",
        "h-[50px]",
        clickable &&
          "cursor-pointer hover:bg-gray-50 transition-colors focus-ring",
        className
      )}
      {...props}
    />
  );
}

function NoticeListTableHead({
  className,
  ...props
}: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="notice-table-head"
      className={cn(
        "text-foreground px-4 py-4 text-center align-middle font-semibold whitespace-nowrap",
        titleVariants({ variant: "s-700" }),
        className
      )}
      {...props}
    />
  );
}

function NoticeListTableCell({
  className,
  align = "center",
  ...props
}: React.ComponentProps<"td"> & { align?: "left" | "center" | "right" }) {
  return (
    <td
      data-slot="notice-table-cell"
      className={cn(
        "align-middle px-[16px]",
        align === "left" && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className
      )}
      {...props}
    />
  );
}

export {
  NoticeListTable,
  NoticeListTableHeader,
  NoticeListTableBody,
  NoticeListTableHead,
  NoticeListTableRow,
  NoticeListTableCell,
};
