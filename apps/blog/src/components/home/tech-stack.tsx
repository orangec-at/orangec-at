"use client";

import { useTranslations } from "next-intl";
import { Heading, Title, Detail } from "../ui/typography";

export default function TechStack() {
  const t = useTranslations('home.techStack');
  const techCategories = [
    {
      category: t('core'),
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
      category: t('backend'),
      color: "medium",
      techs: ["NestJS", "Prisma", "Node.js", "REST API"],
    },
    {
      category: "Infra",
      color: "dark",
      techs: ["Docker", "Supabase", "Firebase", "Ubuntu"],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      light: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
      medium: "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200",
      dark: "bg-gray-800 dark:bg-gray-300 text-gray-100 dark:text-gray-800",
    };
    return colors[color as keyof typeof colors] || colors.light;
  };

  return (
    <section className="max-w-3xl mx-auto space-y-6">
      <Heading variant="s-700" className="text-center text-gray-900 dark:text-white">
        {t('title')}
      </Heading>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {techCategories.map((category, index) => (
          <div key={index} className="text-center space-y-3">
            <Title variant="s-700" as="h3" className="text-gray-800 dark:text-gray-200">
              {category.category}
            </Title>
            <div className="flex flex-wrap justify-center gap-2">
              {category.techs.map((tech) => (
                <Detail
                  key={tech}
                  variant="s-400"
                  className={`px-3 py-1 rounded-full ${getColorClasses(category.color)}`}
                >
                  {tech}
                </Detail>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
