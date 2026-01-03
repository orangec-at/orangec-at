"use client";

import { useTranslations } from "next-intl";
import { Heading, Body } from "../ui/typography";
import HomeHero from "@/components/home/home-hero";
import TechStack from "@/components/home/tech-stack";
import { colors, spacing } from "@/lib/design-tokens";

export default function AboutMe() {
  const t = useTranslations("home.about");
  return (
    <section className={spacing.tight}>
      <div className="muji-pegboard rounded-2xl p-6 md:p-8">
        <Heading
          variant="s-700"
          className={`text-center ${colors.text.primary}`}
        >
          {t("title")}
        </Heading>
      </div>
      <div className="muji-pegboard rounded-2xl p-6 md:p-8">
        <HomeHero />
      </div>
      <div className="muji-pegboard rounded-2xl p-6 md:p-8">
        <div className={spacing.tight}>
          {t.raw("paragraphs").map((text: string, index: number) => (
            <Body
              key={index}
              variant="l-400"
              className={colors.text.secondary}
            >
              {text}
            </Body>
          ))}
        </div>
      </div>
      <div className="muji-pegboard rounded-2xl p-6 md:p-8">
        <TechStack />
      </div>
    </section>
  );
}
