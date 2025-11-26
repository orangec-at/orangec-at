import { Body as KRDSBody } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export interface ContentTableColumn<T> {
  key: keyof T;
  header: string;
  width?: string; // e.g., 'w-1/3', 'w-1/2'
  align?: "left" | "center" | "right";
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface ContentTableProps<T> {
  columns: ContentTableColumn<T>[];
  data: T[];
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
}

export function ContentTable<T>({
  columns,
  data,
  className,
  headerClassName,
  rowClassName,
}: ContentTableProps<T>) {
  return (
    <div className={cn("", className)}>
      <table className="w-full">
        <thead>
          <tr
            className={cn(
              "bg-[var(--bg-ds-light)] border-b border-[var(--purple-200)]",
              "dark:bg-gray-800 dark:border-gray-700",
              headerClassName
            )}
          >
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  "p-[var(--padding-5)]",
                  column.width,
                  column.align === "left"
                    ? "text-left"
                    : column.align === "right"
                    ? "text-right"
                    : "text-center"
                )}
              >
                <KRDSBody variant={"m-700"} className="font-bold">
                  {column.header}
                </KRDSBody>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900">
          {data.map((row, index) => (
            <tr
              key={index}
              className={cn(
                "border-b border-[var(--bg-neutral-light)]",
                "dark:border-gray-800",
                rowClassName
              )}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={cn(
                    "p-[var(--padding-5)]",
                    column.align === "left"
                      ? "text-left"
                      : column.align === "right"
                      ? "text-right"
                      : "text-center"
                  )}
                >
                  {column.render ? (
                    column.render(row[column.key], row)
                  ) : (
                    <KRDSBody variant={"m-400"} asChild>
                      <span>{String(row[column.key] ?? "-")}</span>
                    </KRDSBody>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
