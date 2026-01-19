import ProjectCard from "@/components/project/project-card";
import { PROJECTS } from "@/data/projects";
import { useTranslations } from "next-intl";

export default function ProjectsClient() {
  const t = useTranslations("projects");
  const projects = PROJECTS;

  return (
    <section className="w-full px-4 md:px-10 pt-28 md:pt-32 pb-16">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t("subtitle")}
          </p>
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {projects.map((project) => (
            <div className="muji-pegboard rounded-2xl p-5" key={project.id}>
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
