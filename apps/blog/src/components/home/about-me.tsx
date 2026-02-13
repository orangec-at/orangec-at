"use client";

import { useTranslations } from "next-intl";
import HomeHero from "@/components/home/home-hero";
import TechStack from "@/components/home/tech-stack";

export default function AboutMe() {
  const t = useTranslations("home.about");
  return (
    <section className="py-section space-y-8">
      <div className="container-narrow">
        <h2 className="text-h2 font-serif text-center text-foreground">
          {t("title")}
        </h2>
      </div>

      <HomeHero />

      <div className="container-narrow rounded-2xl border border-border bg-card p-6 md:p-8">
        <div className="space-y-4">
          {t.raw("paragraphs").map((text: string) => (
            <p key={text} className="text-body leading-relaxed text-muted-foreground">
              {text}
            </p>
          ))}
        </div>
      </div>

      <TechStack />
    </section>
  );
}
