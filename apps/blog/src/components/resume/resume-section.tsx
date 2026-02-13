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
        className="mb-4 flex items-center gap-2 text-foreground"
      >
        <span className="w-3 h-3 bg-ember-accent" />
        {title}
      </Title>
      {children}
    </section>
  );
}
