import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@orangec-at/design/lib/utils";
import {
  Body,
  Label as KRDSLabel,
  Label,
} from "@orangec-at/design/components/ui/typography";

const buttonVariants = cva(
  `hover:cursor-pointer
  inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-(--bg-ds-default) focus-visible:border-transparent aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive`,
  {
    variants: {
      variant: {
        default:
          "bg-(--bg-ds-default) text-(--text-white) hover:bg-(--bg-ds-deep)",
        secondary:
          "bg-(--border-light) text-(--text-dark) hover:bg-(--bg-secondary-light)",
        tertiary:
          "bg-(--krds-white-100) border border-(--text-dark) text-(--text-dark) hover:bg-secondary/80",
        primary:
          "bg-(--bg-ds-default) text-(--text-white) hover:bg-(--bg-ds-deep)",
        destructive:
          "bg-(--krds-danger-50) text-white hover:bg-(--krds-danger-60) dark:bg-(--krds-danger-60)/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-(--style-gray-90) underline underline-offset-4",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        xsmall: "px-(--padding-4) h-(--size-height-5)",
        small: "px-(--padding-5) h-(--size-height-6)",
        medium: "px-(--padding-6) h-(--size-height-7) min-w-[78px]",
        large: "px-(--padding-7) h-(--size-height-8)",
        xlarge: "px-(--padding-8) h-(--size-height-9)",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?:
    | "default"
    | "secondary"
    | "tertiary"
    | "primary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link"
    | null;
  size?:
    | "default"
    | "sm"
    | "lg"
    | "icon"
    | "xsmall"
    | "small"
    | "medium"
    | "large"
    | "xlarge"
    | null;
  asChild?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  icon,
  iconPosition = "left",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  // 텍스트 자식을 자동으로 Label로 감싸기
  const processedChildren = React.Children.map(children, (child) => {
    if (typeof child === "string") {
      if (variant === "link") return <Body variant="m-400">{child}</Body>;
      if (size === "xsmall" || size === "small")
        return <Label variant="s-400">{child}</Label>;
      if (size === "medium") return <Label variant="m-400">{child}</Label>;
      if (size === "large" || size === "xlarge")
        return <Label variant="l-400">{child}</Label>;
    }
    return child;
  });

  return (
    <Comp
      data-slot="button"
      className={cn(
        "px-(--padding-7)",
        buttonVariants({ variant, size, className })
      )}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <span className="inline-flex shrink-0 mr-2">{icon}</span>
      )}
      {processedChildren}
      {icon && iconPosition === "right" && (
        <span className="inline-flex shrink-0 ml-2">{icon}</span>
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
