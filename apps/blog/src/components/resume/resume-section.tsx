import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Title } from "../ui/typography";

interface ResumeSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ResumeSection({
  title,
  children,
  className,
}: ResumeSectionProps) {
  return (
    <section className={cn("mb-10", className)}>
      <Title
        variant="m-700"
        as="h2"
        className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100"
      >
        <span className="w-3 h-3 bg-gray-900 dark:bg-gray-100" />
        {title}
      </Title>
      {children}
    </section>
  );
}
