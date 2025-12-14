import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

// Display variants - 가장 큰 타이틀 (Hero 섹션 등)
const displayVariants = cva("font-sans leading-[120%]", {
  variants: {
    variant: {
      "l-700": "text-[66px] font-bold",
      "m-700": "text-[50px] font-bold",
      "s-700": "text-[40px] font-bold",
      // Mobile variants
      "l-700-mo": "text-[50px] font-bold",
      "m-700-mo": "text-[40px] font-bold",
      "s-700-mo": "text-[32px] font-bold",
    },
  },
  defaultVariants: {
    variant: "l-700",
  },
});

// Heading variants - 섹션 제목
const headingVariants = cva("font-sans leading-[140%]", {
  variants: {
    variant: {
      "l-700": "text-[50px] font-bold",
      "m-700": "text-[40px] font-bold",
      "s-700": "text-[32px] font-bold",
      // Mobile variants
      "l-700-mo": "text-[40px] font-bold",
      "m-700-mo": "text-[32px] font-bold",
      "s-700-mo": "text-[25px] font-bold",
    },
  },
  defaultVariants: {
    variant: "l-700",
  },
});

// Title variants - 카드/컴포넌트 제목
const titleVariants = cva("font-sans leading-[150%]", {
  variants: {
    variant: {
      "xxl-700": "text-[32px] font-bold",
      "xl-700": "text-[25px] font-bold",
      "l-700": "text-[21px] font-bold",
      "m-700": "text-[19px] font-bold",
      "s-700": "text-[17px] font-bold",
      "xs-700": "text-[15px] font-bold",
      // Mobile variants
      "xxl-700-mo": "text-[25px] font-bold",
    },
  },
  defaultVariants: {
    variant: "l-700",
  },
});

// Body variants - 본문 텍스트
const bodyVariants = cva("font-sans leading-[160%]", {
  variants: {
    variant: {
      "l-700": "text-[19px] font-bold",
      "l-500": "text-[19px] font-medium",
      "l-400": "text-[19px] font-normal",
      "m-700": "text-[17px] font-bold",
      "m-500": "text-[17px] font-medium",
      "m-400": "text-[17px] font-normal",
      "s-700": "text-[15px] font-bold",
      "s-500": "text-[15px] font-medium",
      "s-400": "text-[15px] font-normal",
    },
  },
  defaultVariants: {
    variant: "m-400",
  },
});

// Detail variants - 부가 정보, 캡션
const detailVariants = cva("font-sans leading-[150%]", {
  variants: {
    variant: {
      "l-700": "text-[17px] font-bold",
      "l-400": "text-[17px] font-normal",
      "m-700": "text-[15px] font-bold",
      "m-400": "text-[15px] font-normal",
      "s-700": "text-[13px] font-bold",
      "s-400": "text-[13px] font-normal",
    },
  },
  defaultVariants: {
    variant: "m-400",
  },
});

// Label variants - 폼 라벨, 버튼 텍스트
const labelVariants = cva("font-sans leading-[150%]", {
  variants: {
    variant: {
      "l-400": "text-[19px] font-normal",
      "m-700": "text-[17px] font-bold",
      "m-400": "text-[17px] font-normal",
      "s-700": "text-[15px] font-bold",
      "s-400": "text-[15px] font-normal",
      "xs-700": "text-[13px] font-bold",
      "xs-400": "text-[13px] font-normal",
      "xs-300": "text-[13px] font-light",
    },
  },
  defaultVariants: {
    variant: "m-400",
  },
});

// Link variants - 링크 텍스트
const linkVariants = cva(
  "font-sans leading-[150%] underline underline-offset-4 hover:no-underline transition-all",
  {
    variants: {
      variant: {
        "l-700": "text-[19px] font-bold",
        "l-400": "text-[19px] font-normal",
        "m-700": "text-[17px] font-bold",
        "m-400": "text-[17px] font-normal",
        "s-700": "text-[15px] font-bold",
        "s-400": "text-[15px] font-normal",
      },
    },
    defaultVariants: {
      variant: "m-400",
    },
  }
);

// Code variants - 코드/모노스페이스 텍스트
const codeVariants = cva("font-mono leading-[150%]", {
  variants: {
    variant: {
      "l-400": "text-[17px] font-normal",
      "m-400": "text-[15px] font-normal",
      "s-400": "text-[13px] font-normal",
    },
  },
  defaultVariants: {
    variant: "m-400",
  },
});

// Display Component
interface DisplayProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof displayVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";
}

const Display = React.forwardRef<HTMLHeadingElement, DisplayProps>(
  ({ className, variant, as: Component = "h1", ...props }, ref) => {
    return (
      <Component
        className={cn(displayVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Display.displayName = "Display";

// Heading Component
interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant, as: Component = "h2", ...props }, ref) => {
    return (
      <Component
        className={cn(headingVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Heading.displayName = "Heading";

// Title Component
interface TitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof titleVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";
}

const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, variant, as: Component = "h3", ...props }, ref) => {
    return (
      <Component
        className={cn(titleVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Title.displayName = "Title";

// Body Component
interface BodyProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof bodyVariants> {
  as?: "p" | "span" | "div";
}

const Body = React.forwardRef<HTMLParagraphElement, BodyProps>(
  ({ className, variant, as: Component = "p", ...props }, ref) => {
    return (
      <Component
        className={cn(bodyVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Body.displayName = "Body";

// Detail Component
interface DetailProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "ref">,
    VariantProps<typeof detailVariants> {
  as?: "span" | "p" | "div";
}

function Detail({
  className,
  variant,
  as: Component = "span",
  ...props
}: DetailProps) {
  return (
    <Component
      className={cn(detailVariants({ variant, className }))}
      {...props}
    />
  );
}
Detail.displayName = "Detail";

// Label Component
interface LabelProps
  extends React.HTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  htmlFor?: string;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <label
        className={cn(labelVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

// Link Component
interface TypographyLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {}

const TypographyLink = React.forwardRef<HTMLAnchorElement, TypographyLinkProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <a
        className={cn(linkVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
TypographyLink.displayName = "TypographyLink";

// Code Component
interface CodeProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "ref">,
    VariantProps<typeof codeVariants> {
  as?: "code" | "pre" | "span";
}

function Code({
  className,
  variant,
  as: Component = "code",
  ...props
}: CodeProps) {
  return (
    <Component
      className={cn(codeVariants({ variant, className }))}
      {...props}
    />
  );
}
Code.displayName = "Code";

export {
  Body,
  bodyVariants,
  Code,
  codeVariants,
  Detail,
  detailVariants,
  Display,
  displayVariants,
  Heading,
  headingVariants,
  Label,
  labelVariants,
  Title,
  titleVariants,
  TypographyLink,
  linkVariants,
};
