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
            className="rounded-lg border border-border p-4"
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded bg-surface px-2 py-1 text-xs text-muted-foreground">
                {project.company}
              </span>
              <span className="text-xs text-muted-foreground">
                {project.period}
              </span>
            </div>
            
            <h3 className="mb-2 font-semibold text-foreground">
              {project.name}
            </h3>
            
            <p className="mb-3 text-sm text-foreground/85">
              {project.description}
            </p>

            {project.achievements && project.achievements.length > 0 && (
              <div className="mb-3">
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  {t("achievements")}
                </p>
                <ul className="list-inside list-disc space-y-1 text-sm text-foreground/85">
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
                      className="rounded border border-border bg-surface px-2 py-0.5 text-xs text-ember-accent"
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
