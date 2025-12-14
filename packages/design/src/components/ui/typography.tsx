import { cn } from "@orangec-at/design/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

// Display variants
const displayVariants = cva("font-sans leading-[150%]", {
  variants: {
    variant: {
      "l-700": "text-[66px] font-bold", // Display L 700
      "m-700": "text-[50px] font-bold", // Display M 700
      "s-700": "text-[40px] font-bold", // Display S 700
      "l-700-mo": "text-[50px] font-bold", // Display L 700-mo
      "m-700-mo": "text-[40px] font-bold", // Display M 700-mo
      "s-700-mo": "text-[32px] font-bold", // Display S 700-mo
    },
  },
  defaultVariants: {
    variant: "l-700",
  },
});

// Heading variants
const headingVariants = cva("font-sans leading-[150%]", {
  variants: {
    variant: {
      "l-700": "text-[50px] font-bold", // Heading L 700
      "m-700": "text-[40px] font-bold", // Heading M 700
      "s-700": "text-[32px] font-bold", // Heading S 700
      "l-700-mo": "text-[40px] font-bold", // Heading L 700-mo
      "m-700-mo": "text-[32px] font-bold", // Heading M 700-mo
      "s-700-mo": "text-[25px] font-bold", // Heading S 700-mo
    },
  },
  defaultVariants: {
    variant: "l-700",
  },
});

// Hero variants
const heroVariants = cva("font-[Paperlogy] leading-[120%]", {
  variants: {
    variant: {
      default:
        "text-[33.083px] font-bold tracking-[-0.992px] text-[var(--color-high-contrast-primary-90,_#03163A)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// Title variants
const titleVariants = cva("font-sans leading-[150%]", {
  variants: {
    variant: {
      "xxl-700": "text-[32px] font-bold", // Title XXL 700
      "xl-700": "text-[25px] font-bold", // Title XL 700
      "l-700": "text-[21px] font-bold", // Title L 700
      "m-700": "text-[19px] font-bold", // Title M 700
      "s-700": "text-[17px] font-bold", // Title S 700
      "xs-700": "text-[15px] font-bold", // Title XS 700
      "xxl-700-mo": "text-[25px] font-bold", // Title XXL 700-mo
    },
  },
  defaultVariants: {
    variant: "l-700",
  },
});

// Body variants
const bodyVariants = cva("font-sans leading-[150%]", {
  variants: {
    variant: {
      "l-700": "text-[19px] font-bold", // Body L 700
      "l-500": "text-[19px] font-medium", // Body L 500
      "l-400": "text-[19px] font-normal", // Body L 400
      "m-700": "text-[17px] font-bold", // Body M 700
      "m-400": "text-[17px] font-normal", // Body M 400
      "s-700": "text-[15px] font-bold", // Body S 700
      "s-400": "text-[15px] font-normal", // Body S 400
    },
  },
  defaultVariants: {
    variant: "m-400",
  },
});

// Detail variants
const detailVariants = cva("font-sans leading-[150%] ", {
  variants: {
    variant: {
      "l-700": "text-[17px] font-bold", // Detail L 700
      "l-400": "text-[17px] font-normal", // Detail L 400
      "m-700": "text-[15px] font-bold", // Detail M 700
      "m-400": "text-[15px] font-normal", // Detail M 400
      "s-700": "text-[13px] font-bold", // Detail S 700
      "s-400": "text-[13px] font-normal", // Detail S 400
    },
  },
  defaultVariants: {
    variant: "m-400",
  },
});

// Label variants
const labelVariants = cva("font-sans leading-[150%]", {
  variants: {
    variant: {
      "l-400": "text-[19px] font-normal", // Label L 400
      "m-700": "text-[17px] font-bold", // Label M 700
      "m-400": "text-[17px] font-normal", // Label M 400
      "s-700": "text-[15px] font-bold", // Label S 700
      "s-400": "text-[15px] font-normal", // Label S 400
      "xs-700": "text-[13px] font-bold", // Label XS 700
      "xs-300": "text-[13px] font-light", // Label XS 300
    },
  },
  defaultVariants: {
    variant: "m-400",
  },
});

// Link variants
const linkVariants = cva(
  "font-sans leading-[150%] underline hover:no-underline transition-all",
  {
    variants: {
      variant: {
        "l-700": "text-[19px] font-bold", // Link L 700
        "l-400": "text-[19px] font-normal", // Link L 400
        "m-700": "text-[17px] font-bold", // Link M 700
        "m-400": "text-[17px] font-normal", // Link M 400
        "s-700": "text-[15px] font-bold", // Link S 700
        "s-400": "text-[15px] font-normal", // Link S 400
      },
    },
    defaultVariants: {
      variant: "m-400",
    },
  }
);

// Display components
interface DisplayProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof displayVariants> {
  asChild?: boolean;
}

const Display = React.forwardRef<HTMLHeadingElement, DisplayProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <h1
        className={cn(displayVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Display.displayName = "Display";

// Heading components
interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  asChild?: boolean;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <h2
        className={cn(headingVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Heading.displayName = "Heading";

// Title components
interface TitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof titleVariants> {
  asChild?: boolean;
}

const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <h3
        className={cn(titleVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Title.displayName = "Title";

// Hero components
interface HeroProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof heroVariants> {
  asChild?: boolean;
}

const Hero = React.forwardRef<HTMLHeadingElement, HeroProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <h1
        className={cn(heroVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Hero.displayName = "Hero";

// Body components
interface BodyProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof bodyVariants> {
  asChild?: boolean;
}

const Body = React.forwardRef<HTMLParagraphElement, BodyProps>(
  ({ className, variant, asChild, ...props }, ref) => {
    const Comp = asChild ? "span" : "p";
    return (
      <Comp
        className={cn(bodyVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Body.displayName = "Body";

// Detail components
interface DetailProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof detailVariants> {
  asChild?: boolean;
}

const Detail = React.forwardRef<HTMLSpanElement, DetailProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        className={cn(detailVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Detail.displayName = "Detail";

// Label components
interface LabelProps
  extends React.HTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  asChild?: boolean;
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

// Link components
interface LinkProps
  extends React.HTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  asChild?: boolean;
  href?: string;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <a
        className={cn(linkVariants({ variant, className }), "focus-ring")}
        ref={ref}
        {...props}
      />
    );
  }
);
Link.displayName = "Link";

// KRDS Display variants
const krdsDisplayVariants = cva("font-sans leading-[150%]", {
  variants: {
    variant: {
      large: "text-[60px] font-bold", // KRDS Display Large
      medium: "text-[44px] font-bold", // KRDS Display Medium
      small: "text-[36px] font-bold", // KRDS Display Small
    },
  },
  defaultVariants: {
    variant: "large",
  },
});

// KRDS Heading variants
const krdsHeadingVariants = cva("font-sans leading-[150%]", {
  variants: {
    variant: {
      xlarge: "text-[40px] font-bold", // KRDS Heading XLarge
      large: "text-[32px] font-bold", // KRDS Heading Large
      medium: "text-[24px] font-bold", // KRDS Heading Medium
      small: "text-[19px] font-bold", // KRDS Heading Small
      xsmall: "text-[17px] font-bold", // KRDS Heading XSmall
      xxsmall: "text-[15px] font-bold", // KRDS Heading XXSmall
    },
  },
  defaultVariants: {
    variant: "large",
  },
});

// KRDS Body variants
const krdsBodyVariants = cva("font-sans leading-[150%]", {
  variants: {
    variant: {
      large: "text-[19px] font-normal", // KRDS Body Large
      medium: "text-[17px] font-normal", // KRDS Body Medium
      small: "text-[15px] font-normal", // KRDS Body Small
      xsmall: "text-[13px] font-normal", // KRDS Body XSmall
    },
  },
  defaultVariants: {
    variant: "medium",
  },
});

// KRDS Label variants
const krdsLabelVariants = cva("font-sans leading-[150%]", {
  variants: {
    variant: {
      large: "text-[19px] font-normal", // KRDS Label Large
      medium: "text-[17px] font-normal", // KRDS Label Medium
      small: "text-[15px] font-normal", // KRDS Label Small
      xsmall: "text-[13px] font-normal", // KRDS Label XSmall
    },
  },
  defaultVariants: {
    variant: "medium",
  },
});

// KRDS Navigation variants
const krdsNavigationVariants = cva("font-sans leading-[150%]", {
  variants: {
    variant: {
      "title-medium": "text-[24px] font-normal", // KRDS Navigation Title Medium
      "title-small": "text-[19px] font-normal ", // KRDS Navigation Title Small
      "depth-medium-bold": "text-[17px] font-bold", // KRDS Navigation Depth Medium Bold
      "depth-medium": "text-[17px] font-normal", // KRDS Navigation Depth Medium
      "depth-small": "text-[15px] font-normal", // KRDS Navigation Depth Small
      "depth-small-bold": "text-[15px] font-bold", // KRDS Navigation Depth Small Bold
    },
  },
  defaultVariants: {
    variant: "depth-medium",
  },
});

// KRDS Display components
interface KRDSDisplayProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof krdsDisplayVariants> {
  asChild?: boolean;
}

const KRDSDisplay = React.forwardRef<HTMLHeadingElement, KRDSDisplayProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <h1
        className={cn(krdsDisplayVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
KRDSDisplay.displayName = "KRDSDisplay";

// KRDS Heading components
interface KRDSHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof krdsHeadingVariants> {
  asChild?: boolean;
}

const KRDSHeading = React.forwardRef<HTMLHeadingElement, KRDSHeadingProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "h2";
    return (
      <Comp
        className={cn(krdsHeadingVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

KRDSHeading.displayName = "KRDSHeading";

// KRDS Body components
interface KRDSBodyProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof krdsBodyVariants> {
  asChild?: boolean;
}

const KRDSBody = React.forwardRef<HTMLParagraphElement, KRDSBodyProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "p";
    return (
      <Comp
        className={cn(krdsBodyVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
KRDSBody.displayName = "KRDSBody";

// KRDS Label components
interface KRDSLabelProps
  extends React.HTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof krdsLabelVariants> {
  asChild?: boolean;
}

const KRDSLabel = React.forwardRef<HTMLLabelElement, KRDSLabelProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <label
        className={cn(krdsLabelVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
KRDSLabel.displayName = "KRDSLabel";

// KRDS Navigation components
interface KRDSNavigationProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof krdsNavigationVariants> {
  asChild?: boolean;
}

const KRDSNavigation = React.forwardRef<HTMLSpanElement, KRDSNavigationProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        className={cn(krdsNavigationVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
KRDSNavigation.displayName = "KRDSNavigation";

// Generic Typography component for simple use cases
const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "p",
  },
});

interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  asChild?: boolean;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, asChild, children, ...props }, ref) => {
    const variantToElement = {
      h1: "h1",
      h2: "h2",
      h3: "h3",
      h4: "h4",
      p: "p",
      blockquote: "blockquote",
      lead: "p",
      large: "div",
      small: "small",
      muted: "p",
    } as const;

    const Comp = (asChild
      ? "span"
      : variantToElement[variant || "p"]) as unknown as React.ElementType;

    return (
      <Comp
        className={cn(typographyVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Typography.displayName = "Typography";

export {
  Body,
  bodyVariants,
  Detail,
  detailVariants,
  Display,
  displayVariants,
  Heading,
  headingVariants,
  Hero,
  heroVariants,
  KRDSBody,
  krdsBodyVariants,
  // KRDS Components
  KRDSDisplay,
  krdsDisplayVariants,
  KRDSHeading,
  krdsHeadingVariants,
  KRDSLabel,
  krdsLabelVariants,
  KRDSNavigation,
  krdsNavigationVariants,
  Label,
  labelVariants,
  Link,
  linkVariants,
  Title,
  titleVariants,
  Typography,
  typographyVariants,
};
