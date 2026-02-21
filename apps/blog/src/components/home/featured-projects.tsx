"use client";

import ProjectCard from "@/components/project/project-card";
import { FEATURED_PROJECTS } from "@/data/projects";

export default function FeaturedProjects() {
  return (
    <section id="projects" className="py-section space-y-8">
      <div className="container-narrow">
        <h2 className="text-h2 font-serif text-center text-foreground">
          Featured Projects
        </h2>
      </div>

      <div className="container-narrow">
        <div className="grid gap-4 md:grid-cols-2">
          {FEATURED_PROJECTS.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl border border-border bg-card p-4 transition-colors hover:border-ember-accent/40 hover:bg-accent/30"
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
