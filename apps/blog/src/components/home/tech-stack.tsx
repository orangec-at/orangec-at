"use client";

export default function TechStack() {
  const techCategories = [
    {
      category: "Core Technologies",
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
      category: "Backend Experience",
      techs: ["NestJS", "Prisma", "Node.js", "REST API"],
    },
    {
      category: "Infra",
      techs: ["Docker", "Supabase", "Firebase", "Ubuntu"],
    },
  ];

  return (
    <section className="container-narrow py-section">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {techCategories.map((category) => (
          <div key={category.category} className="space-y-3 rounded-2xl border border-border bg-card p-5">
            <h3 className="text-h3 font-serif text-foreground">{category.category}</h3>
            <div className="flex flex-wrap gap-2">
              {category.techs.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center rounded-full border border-ember-accent/20 bg-ember-accent-bg px-3 py-1 text-small text-foreground/80 transition-colors hover:border-ember-accent hover:text-ember-accent"
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
