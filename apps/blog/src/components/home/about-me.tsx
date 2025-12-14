"use client";

import { useTranslations } from "next-intl";
import { Heading, Body } from "../ui/typography";

export default function AboutMe() {
  const t = useTranslations('home.about');
  return (
    <section className="max-w-2xl mx-auto text-center space-y-6">
      <Heading variant="s-700" className="text-gray-900 dark:text-white">
        {t('title')}
      </Heading>
      <div className="space-y-4">
        {t.raw('paragraphs').map((text: string, index: number) => (
          <Body key={index} variant="l-400" className="text-gray-700 dark:text-gray-300">
            {text}
          </Body>
        ))}
      </div>
    </section>
  );
}
