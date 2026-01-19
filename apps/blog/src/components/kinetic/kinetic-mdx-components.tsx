import React from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { mdxCustomComponents } from "@/lib/mdx-registry";

interface MDXComponentProps {
  children?: React.ReactNode;
  className?: string;
}

interface CodeProps extends MDXComponentProps {
  children: string;
}

type PreProps = Omit<React.ComponentPropsWithoutRef<"pre">, "children"> & {
  children: React.ReactElement<{
    className?: string;
    children: string;
  }>;
};

export const kineticMdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="font-serif text-4xl md:text-5xl lg:text-6xl font-black uppercase text-[#1c1917] dark:text-white my-8 tracking-tight"
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="font-serif text-3xl md:text-4xl font-bold uppercase text-[#1c1917] dark:text-white my-6 tracking-tight border-l-4 border-kinetic-orange pl-4"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="font-serif text-2xl md:text-3xl font-bold text-[#1c1917] dark:text-white my-5 tracking-tight"
      {...props}
    />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className="font-mono text-lg md:text-xl font-bold uppercase text-kinetic-orange my-4 tracking-widest"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="text-base md:text-lg leading-relaxed my-6 text-[#1c1917]/80 dark:text-white/70"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="my-6 space-y-3 text-base md:text-lg text-[#1c1917]/80 dark:text-white/70 ml-4"
      {...props}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="list-decimal list-inside my-6 space-y-3 text-base md:text-lg text-[#1c1917]/80 dark:text-white/70 ml-4"
      {...props}
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="my-2 text-[#1c1917]/80 dark:text-white/70 relative pl-6 before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-kinetic-orange" {...props} />
  ),
  pre: ({ children, ...props }: PreProps) => {
    if (children?.props?.className) {
      const className = children.props.className || "";
      const code = children.props.children || "";
      return <CodeBlock className={className}>{code}</CodeBlock>;
    }
    return (
      <pre
        className="p-4 md:p-6 overflow-x-auto text-sm my-8 font-mono text-[#1c1917]/90 dark:text-white/90"
        {...props}
      >
        {children}
      </pre>
    );
  },
  code: ({ children, className, ...props }: CodeProps) => {
    if (className?.includes("language-")) {
      return <CodeBlock className={className}>{children}</CodeBlock>;
    }
    return (
      <code className="px-2 py-1 bg-kinetic-orange/20 text-kinetic-orange font-mono text-sm border border-kinetic-orange/30" {...props}>
        {children}
      </code>
    );
  },
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-kinetic-orange pl-6 my-8 italic text-lg md:text-xl text-[#1c1917]/70 dark:text-white/60 bg-stone-200/50 dark:bg-zinc-900/50 py-4 pr-4"
      {...props}
    />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-8 border border-[#1c1917]/10 dark:border-white/10">
      <table
        className="min-w-full divide-y divide-[#1c1917]/10 dark:divide-white/10 text-sm md:text-base"
        {...props}
      />
    </div>
  ),
  th: (props: React.HTMLAttributes<HTMLTableHeaderCellElement>) => (
    <th
      className="px-4 md:px-6 py-3 bg-stone-200 dark:bg-zinc-900 text-left font-mono text-xs uppercase tracking-widest text-kinetic-orange border-b border-[#1c1917]/10 dark:border-white/10"
      {...props}
    />
  ),
  td: (props: React.HTMLAttributes<HTMLTableDataCellElement>) => (
    <td
      className="px-4 md:px-6 py-4 whitespace-nowrap text-[#1c1917]/80 dark:text-white/70 border-b border-[#1c1917]/5 dark:border-white/5"
      {...props}
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-[#1c1917] dark:text-white" {...props} />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic text-kinetic-orange" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-kinetic-orange underline underline-offset-4 decoration-kinetic-orange/50 hover:decoration-kinetic-orange transition-colors"
      {...props}
    />
  ),
  hr: () => (
    <hr className="my-12 border-none h-px bg-gradient-to-r from-kinetic-orange via-[#1c1917]/20 dark:via-white/20 to-transparent" />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <figure className="my-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="w-full border-4 border-[#1c1917]/10 dark:border-white/10 hover:border-kinetic-orange transition-colors duration-300"
        alt={props.alt || ""}
        {...props}
      />
      {props.alt && (
        <figcaption className="mt-3 font-mono text-xs uppercase tracking-widest text-[#1c1917]/50 dark:text-white/40 text-center">
          {props.alt}
        </figcaption>
      )}
    </figure>
  ),
  ...mdxCustomComponents,
};
