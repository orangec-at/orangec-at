"use client";

import { useTranslations } from "next-intl";

export default function AboutMe() {
  const t = useTranslations('home.about');
  return (
    <section className="max-w-2xl mx-auto text-center space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h2>
      <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
        {t.raw('paragraphs').map((text: string, index: number) => (
          <p key={index}>{text}</p>
        ))}
      </div>
    </section>
  );
}
