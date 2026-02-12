import ProjectCard from "@/components/project/project-card";
import { PROJECTS } from "@/data/projects";
import { useTranslations } from "next-intl";

export default function ProjectsClient() {
  const t = useTranslations("projects");
  const projects = PROJECTS;

  return (
    <section className="container-default py-section space-y-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-display font-serif tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="text-body text-muted-foreground">
            {t("subtitle")}
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
