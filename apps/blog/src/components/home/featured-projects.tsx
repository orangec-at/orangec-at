"use client";

import ProjectCard from "@/components/project/project-card";
import { FEATURED_PROJECTS } from "@/data/projects";
import { useTranslations } from "next-intl";
import { Heading } from "../ui/typography";
import { colors, spacing } from "@/lib/design-tokens";

export default function FeaturedProjects() {
  const t = useTranslations("home.projects");
  return (
    <section id="projects" className={spacing.element}>
      <div className="muji-pegboard rounded-2xl p-6 md:p-8">
        <Heading
          variant="s-700"
          className={`text-center ${colors.text.primary}`}
        >
          {t("featured")}
        </Heading>
      </div>
      <div className="muji-pegboard rounded-2xl p-6 md:p-8">
        <div className="muji-pegboard-grid ">
          {FEATURED_PROJECTS.map((project) => (
            <div key={project.id} className="muji-tile muji-tile-rounded p-4">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
