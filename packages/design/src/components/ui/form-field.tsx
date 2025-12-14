import React from "react";
import { Label } from "@orangec-at/design/components/ui/typography";
import { cn } from "@orangec-at/design/lib/utils";
import { ValidationError } from "@orangec-at/design/components/ui/validation-error";

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
  value?: string | number | boolean | null;
  hasError?: boolean;
  errorMessage?: string;
}

export function FormField({
  label,
  required = false,
  children,
  className,
  labelClassName,
  value,
  hasError = false,
  errorMessage = "필수 입력항목을 확인해주세요.",
}: FormFieldProps) {
  const isEmpty =
    value === "" ||
    value === null ||
    value === undefined ||
    value === 0 ||
    (typeof value === "string" && value.trim() === "");

  return (
    <div className={cn("flex flex-col gap-(--gap-3)", className)}>
      <Label variant="s-400" className={cn("font-bold", labelClassName)}>
        {label}
        {required && <span className="text-(--krds-danger-60)"> *</span>}
      </Label>
      {children}
      {required && hasError && isEmpty && (
        <ValidationError message={errorMessage} />
      )}
    </div>
  );
}
