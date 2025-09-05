import { Project } from "@/data/projects";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { designTokens } from "@/lib/design-tokens";

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
        <Link href={`/projects/${project.id}`} className="hover:text-gray-700 transition-colors">
          <h3 className={designTokens.typography.cardTitle}>{project.title}</h3>
        </Link>
      </CardHeader>
      <CardContent>
        <p className={designTokens.typography.body}>{project.description}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.techStack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Link 
          href={`/projects/${project.id}`}
          className="text-gray-600 hover:text-gray-900 underline transition-colors font-medium"
        >
          자세히 보기
        </Link>
      </CardFooter>
    </Card>
  );
}
