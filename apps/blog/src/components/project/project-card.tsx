import { Project } from "@/data/projects";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      {project.image && (
        <Image src={project.image} alt={project.title} width={400} height={200} className="rounded-t-md" />
      )}
      <CardHeader>
        <h3 className="text-xl font-bold">{project.title}</h3>
      </CardHeader>
      <CardContent>
        <p>{project.description}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.techStack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-4">
        {project.url && (
          <Link href={project.url} target="_blank" className="underline">
            Live
          </Link>
        )}
        {project.github && (
          <Link href={project.github} target="_blank" className="underline">
            GitHub
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
