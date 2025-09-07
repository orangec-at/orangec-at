"use client";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { Button } from "@/components/ui/button";
import SplitText from "@/components/ui/split-text";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogPostMeta, getRelatedProjects } from "@/lib/blog-utils";
import Link from "next/link";

const components = {
  // HTML 요소 스타일링
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="text-3xl font-bold my-4 text-gray-900 dark:text-white"
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="text-2xl font-semibold my-3 text-gray-900 dark:text-white"
      {...props}
    />
  ),
  // p 태그 제거 - 중첩 문제 방지
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm"
      {...props}
    />
  ),

  // UI 컴포넌트들
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  SplitText,
};

export default function BlogPostClient({
  mdxSource,
  blogMeta,
  blogSlug,
}: {
  mdxSource: MDXRemoteSerializeResult;
  blogMeta: BlogPostMeta | null;
  blogSlug: string;
}) {
  // 관련 프로젝트 정보 가져오기 (connections.ts 기반)
  const relatedProjects = getRelatedProjects(blogSlug);
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Blog Header */}
        {blogMeta && (
          <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {blogMeta.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span>
                📅 {new Date(blogMeta.date).toLocaleDateString("ko-KR")}
              </span>
              {blogMeta.readTime && <span>⏱️ {blogMeta.readTime}</span>}
              {blogMeta.category && <span>📂 {blogMeta.category}</span>}
            </div>
            {blogMeta.description && (
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {blogMeta.description}
              </p>
            )}
            {blogMeta.tags && (
              <div className="flex flex-wrap gap-2 mt-4">
                {blogMeta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <article className="prose prose-lg max-w-none">
          <MDXRemote {...mdxSource} components={components} />
        </article>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-16 p-8 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🚀 관련 프로젝트
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              이 글에서 다룬 기술들이 실제로 적용된 프로젝트들을 확인해보세요.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedProjects.map((project: any) => (
                <div
                  key={project.id}
                  className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                    {project.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.techStack.slice(0, 3).map((tech: string) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Link href={`/projects/${project.id}`}>
                      📂 프로젝트 자세히 보기
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blog Post CTA */}
        <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl text-center border border-blue-200 dark:border-blue-800">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            이런 기술이 필요한 프로젝트가 있으신가요?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            위에서 다룬 기술들을 활용해 여러분의 아이디어를 실제 서비스로
            만들어드립니다.
            <br />
            <strong>빠른 MVP 개발</strong>부터 <strong>안정적인 운영</strong>
            까지 함께하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600">
              <Link href="/contact">🚀 프로젝트 시작하기</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/projects">📂 포트폴리오 보기</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
