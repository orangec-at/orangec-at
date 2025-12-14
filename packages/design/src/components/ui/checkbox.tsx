"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@orangec-at/design/lib/utils";

const checkboxVariants = cva(
  [
    "peer shrink-0 rounded-[4px] border border-transparent outline-none cursor-pointer",
    "dark:bg-input/30",
    "focus-ring",
  ].join(" "),
  {
    variants: {
      size: {
        small: "size-4",
        large: "size-5",
      },
      select: {
        off: "border-[var(--krds-gray-60)] bg-[var(--krds-gray-0)] text-[var(--krds-gray-60)]",
        on: "border-0 bg-[var(--krds-primary-main)] text-[var(--krds-gray-0)]",
        reversal:
          "border-0 bg-transparent text-[var(--krds-primary-main)] data-[state=unchecked]:text-[var(--krds-secondary-20)]",
      },
      state: {
        default: "",
        disabled: "cursor-not-allowed",
      },
    },
    compoundVariants: [
      {
        select: "off",
        state: "disabled",
        className:
          "border-[var(--krds-gray-30)] bg-[var(--krds-gray-20)] text-[var(--krds-gray-30)]",
      },
      {
        select: "on",
        state: "disabled",
        className:
          "border bg-[var(--krds-gray-20)] text-[var(--krds-gray-40)] border-[var(--krds-gray-30)]",
      },
      {
        select: "reversal",
        state: "disabled",
        className: "text-[var(--krds-secondary-20)]",
      },
    ],
    defaultVariants: {
      size: "small",
      select: "off",
      state: "default",
    },
  }
);

const indicatorVariants = cva(
  "flex items-center justify-center text-current transition-none",
  {
    variants: {
      size: {
        small: "p-(--padding-1)",
        large: "p-[3px]",
      },
      select: {
        off: "data-[state=unchecked]:hidden",
        on: "data-[state=unchecked]:hidden",
        reversal: "",
      },
    },
    defaultVariants: {
      size: "small",
      select: "off",
    },
  }
);

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants>;

function Checkbox({
  className,
  size,
  select,
  state,
  disabled,
  checked,
  ...props
}: CheckboxProps) {
  const resolvedState = state ?? (disabled ? "disabled" : "default");
  const resolvedSelect = select ?? (checked ? "on" : "off");
  const isDisabled = disabled ?? resolvedState === "disabled";

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        checkboxVariants({
          size,
          select: resolvedSelect,
          state: resolvedState,
        }),
        className
      )}
      disabled={isDisabled}
      checked={checked}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        forceMount
        data-slot="checkbox-indicator"
        className={indicatorVariants({ size, select: resolvedSelect })}
      >
        <CheckIcon className="size-full" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox, checkboxVariants };
