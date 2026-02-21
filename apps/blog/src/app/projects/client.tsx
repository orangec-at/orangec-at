import ProjectCard from "@/components/project/project-card";
import { PROJECTS } from "@/data/projects";

export default function ProjectsClient() {
  const projects = PROJECTS;

  return (
    <section className="container-default pb-section space-y-8">
      <div className="space-y-6">
        <div className="mb-8 border-b border-border pb-8">
          <p className="text-xs uppercase tracking-[0.26em] text-ember-accent">Projects</p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Projects
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            A systematic collection of my work
          </p>
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {projects.map((project) => (
            <div
              id={`project-${project.id}`}
              className="rounded-2xl border border-border bg-card p-5"
              key={project.id}
            >
              <div className="break-inside-avoid">
                <ProjectCard project={project} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
