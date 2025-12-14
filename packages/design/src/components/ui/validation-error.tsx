import React from "react";
import { Label } from "@orangec-at/design/components/ui/typography";
import { cn } from "@orangec-at/design/lib/utils";
import { SystemDanger } from "@orangec-at/design/components/svgs";

interface ValidationErrorProps {
  message: string;
  className?: string;
}

export function ValidationError({ message, className }: ValidationErrorProps) {
  return (
    <div className="flex flex-row gap-(--gap-2) items-center">
      <SystemDanger className="size-4" />
      <Label
        variant="s-400"
        className={cn("text-(--krds-danger-60)", className)}
      >
        {message}
      </Label>
    </div>
  );
}
