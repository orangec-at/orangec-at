"use client";

import { useTranslations } from "next-intl";
import { Title } from "../ui/typography";
import { colors, spacing } from "@/lib/design-tokens";

export default function TechStack() {
  const t = useTranslations("home.techStack");
  const techCategories = [
    {
      category: t("core"),
      color: "light",
      techs: [
        "React",
        "TypeScript",
        "Next.js",
        "React Native",
        "TailwindCSS",
        "Styled-components",
        "Zustand",
        "React Query",
      ],
    },
    {
      category: t("backend"),
      color: "medium",
      techs: ["NestJS", "Prisma", "Node.js", "REST API"],
    },
    {
      category: "Infra",
      color: "dark",
      techs: ["Docker", "Supabase", "Firebase", "Ubuntu"],
    },
  ];

  return (
    <section className={spacing.element}>
      <div className="muji-pegboard-grid rounded-2xl">
        {techCategories.map((category, index) => (
          <div key={index} className="space-y-3">
            <Title
              variant="s-700"
              as="h3"
              className={colors.text.secondary}
            >
              {category.category}
            </Title>
            <div className="flex flex-wrap gap-2">
              {category.techs.map((tech) => (
                <div key={tech} className="muji-tag">
                  <div className="muji-tag__body">{tech}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
