import ProjectCard from "@/components/project/project-card";
import { PROJECTS } from "@/data/projects";

export default function ProjectsClient() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-8 md:px-16 md:py-12">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <div className="grid gap-8 md:grid-cols-2">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}