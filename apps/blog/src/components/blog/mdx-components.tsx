import React from "react";
import { CodeBlock, InlineCode } from "@/components/ui/code-block";
import { mdxCustomComponents } from "@/lib/mdx-registry";

type PreProps = Omit<React.ComponentPropsWithoutRef<"pre">, "children"> & {
  children: React.ReactElement<{
    className?: string;
    children: string;
  }>;
};

export const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mt-8 mb-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="mt-8 mb-4 border-l-2 border-ember-accent pl-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-7 mb-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl" {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className="mt-6 mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-ember-accent sm:text-base"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-5 text-base leading-relaxed text-foreground/85" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-5 list-disc space-y-2 pl-5 text-base text-foreground/85 marker:text-ember-accent" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-5 list-decimal space-y-2 pl-5 text-base text-foreground/85 marker:text-ember-accent" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="leading-relaxed" {...props} />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="ember-link" {...props} />
  ),
  pre: ({ children, ...props }: PreProps) => {
    if (children?.props?.className) {
      return <CodeBlock className={children.props.className}>{children.props.children}</CodeBlock>;
    }

    return (
      <pre className="my-6 overflow-x-auto rounded-xl border border-border bg-surface p-4 text-sm text-foreground" {...props}>
        {children}
      </pre>
    );
  },
  code: ({ children, className, ...props }: React.ComponentPropsWithoutRef<"code">) => {
    if (className?.includes("language-")) {
      return <CodeBlock className={className}>{String(children ?? "")}</CodeBlock>;
    }

    return <InlineCode {...props}>{children}</InlineCode>;
  },
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-6 rounded-r-xl border-l-4 border-ember-accent bg-ember-accent-bg px-4 py-3 text-base italic text-foreground/75"
      {...props}
    />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-8 overflow-x-auto rounded-xl border border-border bg-card">
      <table className="min-w-full divide-y divide-border text-sm" {...props} />
    </div>
  ),
  th: (props: React.HTMLAttributes<HTMLTableHeaderCellElement>) => (
    <th
      className="bg-surface px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
      {...props}
    />
  ),
  td: (props: React.HTMLAttributes<HTMLTableDataCellElement>) => (
    <td className="px-4 py-3 text-foreground/85" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => <strong className="font-semibold text-foreground" {...props} />,
  em: (props: React.HTMLAttributes<HTMLElement>) => <em className="italic text-ember-accent" {...props} />,
  hr: () => <hr className="my-10 border-none h-px bg-border" />,
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <figure className="my-8 overflow-hidden rounded-2xl border border-border bg-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="w-full" alt={props.alt || ""} {...props} />
      {props.alt && (
        <figcaption className="border-t border-border px-4 py-3 text-center text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {props.alt}
        </figcaption>
      )}
    </figure>
  ),
  ...mdxCustomComponents,
};
