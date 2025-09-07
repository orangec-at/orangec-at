import { notFound } from 'next/navigation';
import { PROJECTS } from '@/data/projects';
import { Button } from '@/components/ui/button';
import { designTokens } from '@/lib/design-tokens';
import { getBlogPostsMeta } from '@/lib/blog-utils.server';
import { getRelatedBlogSlugs } from '@/data/connections';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  // connections.ts에서 관련 블로그 포스트 가져오기
  const relatedBlogSlugs = getRelatedBlogSlugs(id);
  const blogPostsMeta = relatedBlogSlugs.length > 0 
    ? await getBlogPostsMeta(relatedBlogSlugs)
    : [];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          프로젝트 목록으로 돌아가기
        </Link>

        {/* Project Header */}
        <div className="mb-8">
          <h1 className={`${designTokens.typography.hero} mb-4`}>
            {project.title}
          </h1>
          
          {/* Project Links */}
          <div className="flex gap-4 mb-6">
            {project.url && (
              <Button asChild>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={16} />
                  라이브 사이트
                </a>
              </Button>
            )}
            {project.github && (
              <Button asChild variant="secondary">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={16} />
                  GitHub
                </a>
              </Button>
            )}
          </div>

          {/* Tech Stack */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">기술 스택</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Project Image */}
        {project.image && (
          <div className="mb-8">
            <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Project Description */}
        <div className="prose max-w-none">
          <h2 className={`${designTokens.typography.section} mb-4`}>프로젝트 소개</h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">
            {project.description}
          </p>

          {/* Key Features & Challenges */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className={`${designTokens.typography.cardTitle} mb-3 text-gray-900 dark:text-white`}>주요 기능</h3>
              <div className="text-gray-700 dark:text-gray-300">
                {project.keyFeatures ? (
                  <ul className="space-y-2">
                    {project.keyFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>프로젝트의 핵심 기능들을 여기에 설명할 수 있습니다.</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className={`${designTokens.typography.cardTitle} mb-3 text-gray-900 dark:text-white`}>기술적 도전</h3>
              <div className="text-gray-700 dark:text-gray-300">
                {project.challenges ? (
                  <ul className="space-y-2">
                    {project.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-orange-500 mr-2">⚡</span>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>프로젝트 개발 과정에서의 주요 도전과 해결책을 설명할 수 있습니다.</p>
                )}
              </div>
            </div>
          </div>

          {/* Related Blog Posts */}
          {blogPostsMeta.length > 0 && (
            <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
              <h3 className={`${designTokens.typography.cardTitle} mb-4 text-gray-900 dark:text-white`}>
                📚 관련 블로그 글
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                이 프로젝트의 개발 과정과 기술적 인사이트를 더 자세히 알아보세요.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {blogPostsMeta.map((post) => (
                  <div
                    key={post.slug}
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {post.title}
                    </h4>
                    {post.date && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {new Date(post.date).toLocaleDateString('ko-KR')}
                      </p>
                    )}
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href={`/blog/${post.slug}`}>
                        📖 읽어보기
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-12 p-8 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl text-center border border-orange-200 dark:border-orange-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              이런 프로젝트가 필요하신가요?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              {project.title}과 같은 서비스 개발을 원하신다면 언제든 연락주세요. 
              <br />
              <strong>3개월 내 MVP 출시</strong>부터 <strong>장기 운영 및 확장</strong>까지 함께합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
                <Link href="/contact">
                  💬 프로젝트 상담받기
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="mailto:your-email@example.com">
                  📧 이메일로 문의
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}