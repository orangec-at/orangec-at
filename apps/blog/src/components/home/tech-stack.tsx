export default function TechStack() {
  const techCategories = [
    {
      category: "Frontend",
      color: "blue",
      techs: [
        "React",
        "Next.js",
        "TypeScript",
        "TailwindCSS",
        "Styled-components",
      ],
    },
    {
      category: "Backend",
      color: "green",
      techs: ["NestJS", "Prisma", "Node.js", "REST API"],
    },
    {
      category: "Infra",
      color: "purple",
      techs: ["Docker", "Supabase", "Firebase", "Ubuntu"],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      purple: "bg-purple-100 text-purple-800",
    };
    return colors[color as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <section className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-900">
        Tech Stack
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {techCategories.map((category, index) => (
          <div key={index} className="text-center space-y-3">
            <h3 className="font-semibold text-gray-700">{category.category}</h3>
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
