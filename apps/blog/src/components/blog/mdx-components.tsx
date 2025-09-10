import React from "react";
import { CodeBlock, InlineCode } from "@/components/ui/code-block";
import { mdxUi } from "@/components/ui/mdx";

// MDX 컴포넌트 타입 정의
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

export const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="text-2xl sm:text-3xl lg:text-4xl font-bold my-4 sm:my-6 text-gray-900 dark:text-white"
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="text-xl sm:text-2xl lg:text-3xl font-semibold my-3 sm:my-4 text-gray-900 dark:text-white"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="text-lg sm:text-xl lg:text-2xl font-semibold my-2 sm:my-3 text-gray-900 dark:text-white"
      {...props}
    />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className="text-base sm:text-lg font-medium my-2 text-gray-900 dark:text-white"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="text-sm sm:text-base lg:text-lg leading-relaxed my-4 text-gray-700 dark:text-gray-300"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="list-disc list-inside my-4 space-y-2 text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 ml-4"
      {...props}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="list-decimal list-inside my-4 space-y-2 text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 ml-4"
      {...props}
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="my-1 text-gray-700 dark:text-gray-300" {...props} />
  ),
  pre: ({ children, ...props }: PreProps) => {
    // pre 태그 내의 code 태그에서 언어와 코드 추출
    if (children?.props?.className) {
      const className = children.props.className || "";
      const code = children.props.children || "";
      return <CodeBlock className={className}>{code}</CodeBlock>;
    }
    return (
      <pre
        className="bg-gray-100 dark:bg-gray-800 p-3 sm:p-4 rounded-lg overflow-x-auto text-sm"
        {...props}
      >
        {children}
      </pre>
    );
  },
  code: ({ children, className, ...props }: CodeProps) => {
    // 인라인 코드인지 코드 블록인지 판단
    if (className?.includes("language-")) {
      return <CodeBlock className={className}>{children}</CodeBlock>;
    }
    return <InlineCode {...props}>{children}</InlineCode>;
  },
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-blue-500 pl-4 my-4 italic text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-r-lg"
      {...props}
    />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table
        className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm sm:text-base"
        {...props}
      />
    </div>
  ),
  th: (props: React.HTMLAttributes<HTMLTableHeaderCellElement>) => (
    <th
      className="px-3 sm:px-6 py-2 sm:py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
      {...props}
    />
  ),
  td: (props: React.HTMLAttributes<HTMLTableDataCellElement>) => (
    <td
      className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong
      className="font-semibold text-gray-900 dark:text-white"
      {...props}
    />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic text-gray-800 dark:text-gray-200" {...props} />
  ),
  ...mdxUi,
};
