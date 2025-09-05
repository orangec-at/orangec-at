'use client';

import { notFound } from 'next/navigation';
import { PROJECTS } from '@/data/projects';
import { Button } from '@/components/ui/button';
import { designTokens } from '@/lib/design-tokens';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';

interface ProjectDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = PROJECTS.find((p) => p.id === params.id);

  if (!project) {
    notFound();
  }

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
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            {project.description}
          </p>

          {/* Additional sections can be added here */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className={`${designTokens.typography.cardTitle} mb-3`}>주요 기능</h3>
              <div className="text-gray-700">
                {/* This could be expanded based on project data */}
                <p>프로젝트의 핵심 기능들을 여기에 설명할 수 있습니다.</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className={`${designTokens.typography.cardTitle} mb-3`}>개발 과정</h3>
              <div className="text-gray-700">
                <p>프로젝트 개발 과정에서의 주요 도전과 해결책을 설명할 수 있습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}