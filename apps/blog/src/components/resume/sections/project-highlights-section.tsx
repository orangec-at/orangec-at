"use client";

import { useTranslations } from "next-intl";
import { ResumeSection } from "../resume-section";
import { ProjectHighlight } from "../types";

interface ProjectHighlightsSectionProps {
  data: ProjectHighlight[];
}

export function ProjectHighlightsSection({ data }: ProjectHighlightsSectionProps) {
  const t = useTranslations("resume.projectHighlights");

  if (!data || data.length === 0) return null;

  return (
    <ResumeSection title={t("title")}>
      <div className="space-y-4">
        {data.map((project, index) => (
          <div
            key={index}
            className="border border-gray-300 dark:border-gray-700 rounded-lg p-4"
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
                {project.company}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {project.period}
              </span>
            </div>
            
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {project.name}
            </h3>
            
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              {project.description}
            </p>

            {project.achievements && project.achievements.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {t("achievements")}
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                  {project.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}

            {project.techStack && project.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {project.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ResumeSection>
  );
}
