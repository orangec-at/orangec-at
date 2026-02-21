"use client";

interface Experience {
  company: string;
  role: string;
  period: string;
  team: string;
  description: string;
  highlights: string[];
  techStack: string;
}

export default function CareerTimeline() {
  const experiences: Experience[] = [
    {
      company: "MIDAS IT",
      role: "Frontend Developer",
      period: "Oct 2022 ~ Mar 2024",
      team: "Cell One | DX Dev",
      description:
        "Web service development for subscription model transition of structural engineering software for construction",
      highlights: [
        "Worked as main frontend developer in a 20-person web development team",
        "Built architecture collaboration platform benchmarking Adobe Creative Cloud",
        "Developed core authentication features including member info page and SSO login",
        "Implemented monorepo architecture for unified codebase management",
      ],
      techStack: "React, TypeScript, Next.js, Recoil, React-Query, Yarn Workspace",
    },
    {
      company: "Pikurate Inc.",
      role: "Frontend Developer",
      period: "Mar 2022 ~ Sep 2022",
      team: "Researcher | Product Team",
      description:
        "Development of SNS app service with bookmark feature and internal web services",
      highlights: [
        "Worked as core frontend developer in a 15-person startup",
        "Contributed to initial product development joining at MVP stage",
        "Developed new internal web service for marketing funnel tracking",
        "Built design system for legacy product component integration",
      ],
      techStack: "React, TypeScript, React Native, Next.js, Zustand, React Query",
    },
    {
      company: "SecureNet Inc.",
      role: "Full-stack Developer",
      period: "Jun 2020 ~ Dec 2021",
      team: "Manager | Service Dev",
      description:
        "Maintenance of product certification management service and new back-office development for sales management",
      highlights: [
        "Worked as core web developer in a 5-person startup",
        "Transformed Excel and messenger-based manual work into efficient back-office system",
        "A to Z experience from sales manager interviews and wireframe design to development",
        "Gained infrastructure experience including server and database management",
      ],
      techStack: "React, Redux, Spring Boot, Oracle Database, Ubuntu Server",
    },
  ];

  return (
    <section className="container-narrow py-section space-y-10">
      <h2 className="text-h2 font-serif text-center text-foreground">Work Experience</h2>

      <div className="border-l border-border pl-6 md:pl-8">
        {experiences.map((exp, index) => (
          <div key={`${exp.company}-${exp.period}`} className="relative pb-10 last:pb-0">
            <span className="absolute -left-[1.72rem] top-1 h-2.5 w-2.5 rounded-full bg-ember-accent" aria-hidden />
            {index === 0 ? (
              <span
                className="absolute -left-[1.98rem] top-[-0.1rem] h-4 w-4 rounded-full border border-ember-accent/40 animate-ping"
                aria-hidden
              />
            ) : null}

            <div className="space-y-3">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-h3 text-foreground">{exp.company}</h3>
                  <p className="text-small text-muted-foreground">
                    {exp.team} | {exp.role}
                  </p>
                </div>
                <p className="text-micro font-mono uppercase tracking-wide text-muted-foreground md:mt-1">
                  {exp.period}
                </p>
              </div>

              <p className="text-body text-muted-foreground">{exp.description}</p>

              <ul className="space-y-1">
                {exp.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start">
                    <span className="mr-2 mt-1 flex-shrink-0 text-muted-foreground">•</span>
                    <p className="text-small text-muted-foreground">{highlight}</p>
                  </li>
                ))}
              </ul>

              <div className="pt-1">
                <p className="text-micro uppercase tracking-wide text-muted-foreground">
                  Tech Stack:{" "}
                </p>
                <p className="text-small text-muted-foreground">
                  {exp.techStack}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
