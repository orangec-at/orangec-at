import { Check } from "lucide-react";
import { labelVariants } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const chipVariants = cva(
  `
  inline-flex items-center justify-center rounded-md border transition-all
  font-medium whitespace-nowrap cursor-pointer
  disabled:pointer-events-none disabled:opacity-50
  gap-(--gap-2)
  focus-ring
  `,
  {
    variants: {
      size: {
        xsmall: "h-(--size-height-5) px-(--padding-4) text-xs",
        small: "h-(--size-height-6) px-(--padding-5) text-sm",
        medium: "h-(--size-height-7) px-(--padding-6) text-sm",
        large: "h-(--size-height-8) px-(--padding-7) text-base",
        xlarge: "h-(--size-height-9) px-(--padding-8) text-base",
      },
      state: {
        default:
          "bg-white border-(--border-secondary-light) text-(--border-secondary-light) hover:bg-gray-50",
        selected:
          "bg-(--bg-neutral-bright) border-(--bg-primary-normal) text-(--bg-primary-normal) hover:bg-blue-100",
        disabled:
          "bg-(--krds-gray-20) border-none text-(--krds-gray-50) cursor-not-allowed",
      },
    },
    defaultVariants: {
      size: "medium",
      state: "default",
    },
  }
);
type State = "default" | "selected" | "disabled";

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">,
    VariantProps<typeof chipVariants> {
  state?: State;
  showIcon?: boolean;
  asChild?: boolean;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      className,
      size,
      state,
      disabled,
      children,
      onClick,
      showIcon = true,
      ...props
    },
    ref
  ) => {
    const [internalState, setInternalState] = React.useState<State>(
      state || "default"
    );

    React.useEffect(() => {
      if (disabled) {
        setInternalState("disabled");
      } else if (state) {
        setInternalState(state);
      }
    }, [disabled, state]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || internalState === "disabled") return;

      if (!state) {
        setInternalState((prev) =>
          prev === "selected" ? "default" : "selected"
        );
      }

      onClick?.(e);
    };

    return (
      <button
        type="button"
        className={cn(chipVariants({ size, state: internalState, className }))}
        disabled={disabled || internalState === "disabled"}
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        {showIcon && <Check className="w-[24px] h-[24px]" />}
        <span
          className={cn(
            labelVariants({ variant: "m-400" }),
            internalState === "default" && "text-(--text-primary)"
          )}
        >
          {children}
        </span>
      </button>
    );
  }
);
Chip.displayName = "Chip";

export { Chip, chipVariants };
