"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
import { colors, spacing } from "@/lib/design-tokens";

interface ExperienceItem {
  period: string;
  company: string;
  title: string;
}

export default function HomeHero() {
  const t = useTranslations("home.hero");
  const experiences = (t.raw("experiences") as ExperienceItem[]) || [];

  return (
    <section className="muji-pegboard rounded-2xl p-0 overflow-hidden">
      {/* Cover */}
      <div className="h-32 w-full bg-gradient-to-br from-orange-300 to-orange-500" />

      {/* Content */}
      <div className="px-6 pb-6 -mt-12">
        <div className="bg-white/92 dark:bg-black/70 backdrop-blur-sm rounded-xl shadow-md p-5 border border-gray-200/80 dark:border-gray-700/80">
          <div className="flex items-start gap-3">
            <Image
              src="/images/avatar.png"
              alt="Jaeil Lee"
              width={96}
              height={96}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className={`text-xl font-semibold ${colors.text.primary}`}>
                  Jaeil Lee
                </p>
                <ShieldCheck className="h-4 w-4 text-gray-700 dark:text-gray-200" />
              </div>
              <p className={`text-sm mt-1 leading-snug ${colors.text.secondary}`}>
                {t("title")}
              </p>
              <p className={`text-sm ${colors.text.muted}`}>
                {t("location")}
              </p>
            </div>
          </div>

          <div className={`mt-4 ${spacing.compact}`}>
            {experiences.map((exp) => (
              <div
                key={exp.title}
                className="grid grid-cols-[110px_1fr] gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-white/80 dark:bg-gray-900/70"
              >
                <div className={`text-xs font-semibold ${colors.text.muted}`}>
                  {exp.period}
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className={`text-sm font-semibold leading-tight ${colors.text.primary}`}>
                    {exp.company}
                  </p>
                  <p className={`text-sm leading-tight ${colors.text.secondary}`}>
                    {exp.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
