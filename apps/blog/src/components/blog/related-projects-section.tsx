"use client";

import React from "react";
import { Button } from "@/components/ui";
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
    <div className="mt-12 sm:mt-16 p-4 sm:p-6 lg:p-8 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
        🚀 {t("relatedProjects")}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
        {t("relatedProjectsDescription")}
      </p>
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
              {project.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm line-clamp-2 leading-relaxed">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
              {project.techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full text-xs sm:text-sm"
            >
              <Link href={`/${locale}/projects/${project.id}`}>
                📂 {tp("viewDetails")}
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}