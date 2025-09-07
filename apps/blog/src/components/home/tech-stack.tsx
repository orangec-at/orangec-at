import { designTokens } from "@/lib/design-tokens";

export default function TechStack() {
  const techCategories = [
    {
      category: "Frontend",
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
      category: "Backend",
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
    return (
      colors[color as keyof typeof colors] ||
      designTokens.components.badge.default
    );
  };

  return (
    <section className="max-w-3xl mx-auto space-y-6">
      <h2 className={`${designTokens.typography.section} text-center`}>
        Tech Stack
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {techCategories.map((category, index) => (
          <div key={index} className="text-center space-y-3">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">{category.category}</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {category.techs.map((tech) => (
                <span
                  key={tech}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getColorClasses(
                    category.color
                  )}`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
