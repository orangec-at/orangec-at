"use client";

import { useTranslations } from "next-intl";
import { Heading, Title, Body, Detail } from "../ui/typography";

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
    <section className="max-w-3xl mx-auto space-y-8">
      <Heading variant="s-700" className="text-center text-gray-900 dark:text-white">
        {t("title")}
      </Heading>

      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div key={index} className="border-l-4 border-gray-200 dark:border-gray-700 pl-6 relative">
            {/* Timeline dot */}
            <div className="absolute -left-2 top-0 w-4 h-4 bg-gray-400 dark:bg-gray-500 rounded-full"></div>

            <div className="space-y-3">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <Title variant="l-700" className="text-gray-900 dark:text-white">
                    {exp.company}
                  </Title>
                  <Body variant="s-400" className="text-gray-600 dark:text-gray-400">
                    {exp.team} | {exp.role}
                  </Body>
                </div>
                <Detail variant="s-700" className="text-gray-500 dark:text-gray-400 mt-1 md:mt-0">
                  {exp.period}
                </Detail>
              </div>

              {/* Description */}
              <Body variant="m-400" className="text-gray-700 dark:text-gray-300">
                {exp.description}
              </Body>

              {/* Highlights */}
              <ul className="space-y-1">
                {exp.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1 flex-shrink-0">•</span>
                    <Detail variant="s-400" className="text-gray-600 dark:text-gray-400">
                      {highlight}
                    </Detail>
                  </li>
                ))}
              </ul>

              {/* Tech Stack */}
              <div className="pt-2">
                <Detail variant="s-700" className="text-gray-500 dark:text-gray-400">
                  {t("techLabel")}:{" "}
                </Detail>
                <Detail variant="s-400" className="text-gray-600 dark:text-gray-400">
                  {exp.techStack}
                </Detail>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
