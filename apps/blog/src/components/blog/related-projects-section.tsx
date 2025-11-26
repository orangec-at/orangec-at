"use client";

import React from "react";
import { Button } from "@/components/ui";
import { Title, Body, Detail } from "@/components/ui/typography";
import { Project } from "@/data/projects";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

interface RelatedProjectsSectionProps {
  projects: Project[];
}

export function RelatedProjectsSection({
  projects,
}: RelatedProjectsSectionProps) {
  const t = useTranslations("blog");
  const tp = useTranslations("projects");
  const locale = useLocale();

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 sm:mt-16 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
      <Title variant="xl-700" as="h3" className="text-gray-900 dark:text-white mb-3 sm:mb-4">
        {t("relatedProjects")}
      </Title>
      <Body variant="m-400" className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
        {t("relatedProjectsDescription")}
      </Body>
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <Title variant="s-700" as="h4" className="text-gray-900 dark:text-white mb-2">
              {project.title}
            </Title>
            <Body variant="s-400" className="text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2">
              {project.description}
            </Body>
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
              {project.techStack.slice(0, 3).map((tech) => (
                <Detail
                  key={tech}
                  variant="s-400"
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                >
                  {tech}
                </Detail>
              ))}
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Link href={`/${locale}/projects/${project.id}`}>
                {tp("viewDetails")}
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}