"use client";

import { Project } from "@/data/projects";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Title, Body, TypographyLink } from "@/components/ui/typography";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations("projects");
  return (
    <Card className="w-full max-w-md mx-auto">
      {project.image && (
        <Image
          src={project.image}
          alt={project.title}
          width={400}
          height={200}
          className="rounded-t-md"
        />
      )}
      <CardHeader>
        <Link
          href={`/projects/${project.id}`}
          className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <Title variant="l-700" className="text-gray-900 dark:text-white">
            {project.title}
          </Title>
        </Link>
      </CardHeader>
      <CardContent>
        <Body variant="m-400" className="text-gray-600 dark:text-gray-300">
          {project.description}
        </Body>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.techStack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <TypographyLink
          href={`/projects/${project.id}`}
          variant="m-400"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          {t("viewMore")}
        </TypographyLink>
      </CardFooter>
    </Card>
  );
}
