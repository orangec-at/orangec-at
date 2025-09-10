"use client";

import ProjectCard from "@/components/project/project-card";
import { FEATURED_PROJECTS } from "@/data/projects";
import { useTranslations } from "next-intl";

export default function FeaturedProjects() {
  const t = useTranslations('home.projects');
  return (
    <section id="projects" className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
        {t('featured')}
      </h2>
      <div className="grid gap-8 md:grid-cols-2">
        {FEATURED_PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
