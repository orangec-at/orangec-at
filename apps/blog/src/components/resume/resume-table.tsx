import { cn } from "@/lib/utils";
import { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";

// Table wrapper
interface ResumeTableProps {
  children: ReactNode;
  className?: string;
}

export function ResumeTable({ children, className }: ResumeTableProps) {
  return (
    <div className={cn("border border-gray-300 dark:border-gray-700", className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

// Table row
interface TrProps {
  children: ReactNode;
  isLast?: boolean;
  className?: string;
}

export function Tr({ children, isLast = false, className }: TrProps) {
  return (
    <tr
      className={cn(
        !isLast && "border-b border-gray-300 dark:border-gray-700",
        className
      )}
    >
      {children}
    </tr>
  );
}

// Table header cell
interface ThProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  isLast?: boolean;
  className?: string;
}

export function Th({ children, isLast = false, className, ...props }: ThProps) {
  return (
    <th
      className={cn(
        "p-3 text-center font-medium text-gray-600 dark:text-gray-400",
        !isLast && "border-r border-gray-300 dark:border-gray-700",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

// Table data cell - label variant (gray text)
interface TdLabelProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
  isLast?: boolean;
  className?: string;
}

export function TdLabel({ children, isLast = false, className, ...props }: TdLabelProps) {
  return (
    <td
      className={cn(
        "p-3 text-center text-gray-600 dark:text-gray-400",
        !isLast && "border-r border-gray-300 dark:border-gray-700",
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}

// Table data cell - value variant (dark text)
interface TdValueProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  isLast?: boolean;
  className?: string;
}

export function TdValue({ children, isLast = false, className, ...props }: TdValueProps) {
  return (
    <td
      className={cn(
        "p-3 text-center text-gray-900 dark:text-gray-100",
        !isLast && "border-r border-gray-300 dark:border-gray-700",
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}

// Table header row (with background)
interface TheadRowProps {
  children: ReactNode;
  className?: string;
}

export function TheadRow({ children, className }: TheadRowProps) {
  return (
    <tr
      className={cn(
        "border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
        className
      )}
    >
      {children}
    </tr>
  );
}
