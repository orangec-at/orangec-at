"use client";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className="text-3xl font-bold my-4" {...props} />,
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="text-gray-700 mb-4" {...props} />,
};

export default function BlogPostClient({
  mdxSource,
}: {
  mdxSource: MDXRemoteSerializeResult;
}) {
  return <MDXRemote {...mdxSource} components={components} />;
}
