import ProjectCard from "@/components/project/project-card";
import { PROJECTS } from "@/data/projects";

export default function FeaturedProjects() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Featured Projects</h2>
      <div className="grid gap-8 md:grid-cols-2">
        {PROJECTS.slice(0, 2).map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
