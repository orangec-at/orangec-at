"use client";

import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@orangec-at/design/components/ui/table";
import { TablePagination } from "@orangec-at/design/components/ui/table-pagination";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  titleVariants,
  KRDSBody,
} from "@orangec-at/design/components/ui/typography";

// 검색 필드 설정
export interface SearchField<TData> {
  key: keyof TData;
  placeholder: string;
}

// 데이터 테이블 설정
export interface DataTableConfig<TData> {
  // 검색 기능
  enableSearch?: boolean;
  searchFields?: SearchField<TData>[];

  // 컬럼 관리
  enableColumnVisibility?: boolean;
  columnLabels?: Record<string, string>;

  // 행 선택
  enableRowSelection?: boolean;

  // 페이지네이션
  enablePagination?: boolean;
  pageSize?: number;

  // 서버 사이드 페이지네이션
  enableServerPagination?: boolean;
  totalCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;

  // 메시지 커스터마이징
  emptyMessage?: string;
  loadingMessage?: string;

  // 정렬 가능한 컬럼
  sortableColumns?: string[];
}

// 데이터 테이블 Props
export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  config?: DataTableConfig<TData>;
  onRowClick?: (data: TData) => void;
  isLoading?: boolean;
}

// 기본 설정값
export const defaultDataTableConfig = {
  enableSearch: false,
  enableColumnVisibility: false,
  enableRowSelection: false,
  enablePagination: true,
  pageSize: 10,
  emptyMessage: "결과가 없습니다.",
  loadingMessage: "로딩 중...",
  sortableColumns: [] as string[],
};

export function DataTable<TData, TValue>({
  columns,
  data,
  config = {},
  onRowClick,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  // 기본 설정과 사용자 설정 병합
  const mergedConfig = { ...defaultDataTableConfig, ...config };

  // React Table 상태
  const [rowSelection, setRowSelection] = React.useState({});

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // 서버 사이드 페이지네이션 계산값 메모이제이션
  const serverPaginationInfo = React.useMemo(() => {
    if (!mergedConfig.enableServerPagination) return null;

    const totalCount = mergedConfig.totalCount || 0;
    const pageSize = mergedConfig.pageSize || 10;
    const currentPage = mergedConfig.currentPage || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      totalCount,
      pageSize,
      currentPage,
      totalPages,
      canPrevious: currentPage > 0,
      canNext: currentPage < totalPages - 1,
    };
  }, [
    mergedConfig.enableServerPagination,
    mergedConfig.totalCount,
    mergedConfig.pageSize,
    mergedConfig.currentPage,
  ]);

  // 정렬 가능한 컬럼 설정
  const modifiedColumns = React.useMemo(() => {
    return columns.map((column) => ({
      ...column,
      enableSorting: column.id
        ? mergedConfig.sortableColumns?.includes(column.id as string) ?? false
        : false,
    }));
  }, [columns, mergedConfig.sortableColumns]);

  // React Table 인스턴스
  const table = useReactTable({
    data,
    columns: modifiedColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: mergedConfig.enableServerPagination
      ? undefined
      : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: mergedConfig.pageSize,
      },
    },
  });

  // 데스크톱 테이블 레이아웃 렌더링
  return (
    <div className="w-full">
      {/* 테이블 */}
      <div className="mb-[var(--padding-8)]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={titleVariants({ variant: "xs-700" })}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {mergedConfig.loadingMessage}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick?.(row.original)}
                  onKeyDown={(e) => {
                    if (onRowClick && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      onRowClick(row.original);
                    }
                  }}
                  tabIndex={onRowClick ? 0 : undefined}
                  className={
                    onRowClick
                      ? "cursor-pointer hover:bg-muted/50 focus-ring"
                      : ""
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {mergedConfig.emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      {mergedConfig.enablePagination &&
        !mergedConfig.enableServerPagination && (
          <TablePagination
            totalPages={table.getPageCount()}
            currentPage={table.getState().pagination.pageIndex + 1}
            onPageChange={(page) => table.setPageIndex(page - 1)}
            onPrevious={() => table.previousPage()}
            onNext={() => table.nextPage()}
            canPrevious={table.getCanPreviousPage()}
            canNext={table.getCanNextPage()}
          />
        )}

      {/* 서버 사이드 페이지네이션 */}
      {serverPaginationInfo && mergedConfig.onPageChange && (
        <TablePagination
          totalPages={serverPaginationInfo.totalPages}
          currentPage={serverPaginationInfo.currentPage + 1}
          onPageChange={(page) => mergedConfig.onPageChange?.(page - 1)}
          onPrevious={() =>
            mergedConfig.onPageChange?.(
              Math.max(0, serverPaginationInfo.currentPage - 1)
            )
          }
          onNext={() =>
            mergedConfig.onPageChange?.(
              Math.min(
                serverPaginationInfo.totalPages - 1,
                serverPaginationInfo.currentPage + 1
              )
            )
          }
          canPrevious={serverPaginationInfo.canPrevious}
          canNext={serverPaginationInfo.canNext}
        />
      )}
    </div>
  );
}
