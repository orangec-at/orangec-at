"use client";

import { useTranslations } from "next-intl";

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
  const t = useTranslations("home.career");

  const experiences = t.raw("experiences") as Experience[];

  return (
    <section className="container-narrow py-section space-y-10">
      <h2 className="text-h2 font-serif text-center text-foreground">{t("title")}</h2>

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
                  {t("techLabel")}:{" "}
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
