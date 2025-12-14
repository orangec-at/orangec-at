import * as React from "react";

import { labelVariants } from "@orangec-at/design/components/ui/typography";
import { cn } from "@orangec-at/design/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      wrap="soft"
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-(--bg-ds-default) focus:border-transparent aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "p-(--padding-6)",
        "min-h-[124px]",
        "max-h-[400px]",
        "max-w-full",
        "overflow-y-auto",
        "resize-y",
        "[&::placeholder]:" + labelVariants({ variant: "s-400" }),
        "placeholder:text-[--gray-40]",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
