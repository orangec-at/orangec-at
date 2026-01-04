"use client";

import React from "react";
import { Button } from "@orangec-at/design";
import { Title, Body, Detail } from "@orangec-at/design/blog";
import { Project } from "@/data/projects";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { withLocalePath } from "@/lib/locale-path";

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
    <div className="mt-12 sm:mt-16 p-4 sm:p-6 lg:p-8 muji-panel">
      <Title
        variant="xl-700"
        as="h3"
        className="text-gray-900 dark:text-white mb-3 sm:mb-4"
      >
        {t("relatedProjects")}
      </Title>
      <Body
        variant="m-400"
        className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6"
      >
        {t("relatedProjectsDescription")}
      </Body>
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 sm:p-6 muji-shelf-cell"
          >
            <Title
              variant="s-700"
              as="h4"
              className="text-gray-900 dark:text-white mb-2"
            >
              {project.title}
            </Title>
            <Body
              variant="s-400"
              className="text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2"
            >
              {project.description}
            </Body>
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
              {project.techStack.slice(0, 3).map((tech) => (
                <Detail
                  key={tech}
                  variant="s-400"
                  className="muji-label px-2 py-1 text-[11px] tracking-wide"
                >
                  {tech}
                </Detail>
              ))}
            </div>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href={withLocalePath(locale, `/projects/${project.id}`)}>
                {tp("viewDetails")}
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
