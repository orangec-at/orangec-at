"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";

interface ExperienceItem {
  period: string;
  company: string;
  title: string;
}

export default function HomeHero() {
  const t = useTranslations("home.hero");
  const prefersReducedMotion = useReducedMotion();
  const experiences = (t.raw("experiences") as ExperienceItem[]) || [];

  return (
    <section className="container-narrow py-section">
      <div className="space-y-6 rounded-2xl border border-border bg-card p-6 md:p-8">
        <div className="flex items-start gap-4">
          <Image
            src="/images/avatar.png"
            alt="Jaeil Lee"
            width={96}
            height={96}
            className={`h-20 w-20 rounded-full border-2 border-ember-accent/30 object-cover ${
              prefersReducedMotion ? "" : "transition-transform duration-500 hover:scale-[1.02]"
            }`}
          />
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <p className="text-h1 font-serif text-foreground">Jaeil Lee</p>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <span className="h-2 w-2 rounded-full bg-ember-accent" aria-hidden />
            </div>
            <p className="text-body leading-snug text-muted-foreground">{t("title")}</p>
            <p className="text-small text-muted-foreground">{t("location")}</p>
          </div>
        </div>

        <div className="space-y-2">
          {experiences.map((exp) => (
            <div key={exp.title} className="grid grid-cols-[110px_1fr] gap-3 border-t border-border pt-3">
              <div className="text-micro font-mono uppercase tracking-wide text-muted-foreground">
                {exp.period}
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-small font-medium text-foreground">{exp.company}</p>
                <p className="text-small text-muted-foreground">{exp.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
