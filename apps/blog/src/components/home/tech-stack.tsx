import { Badge } from "../ui/badge";

export default function TechStack() {
  const techs = ["React", "Next.js", "TypeScript", "TailwindCSS", "shadcn/ui"];
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
      <div className="flex flex-wrap gap-2">
        {techs.map((tech) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>
    </section>
  );
}
