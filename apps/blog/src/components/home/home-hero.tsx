"use client";

import Image from "next/image";
import Link from "next/link";
import { SplitText } from "../ui/split-text";
import { useTranslations, useLocale } from "next-intl";

export default function HomeHero() {
  const t = useTranslations("home.hero");
  const locale = useLocale();

  console.log({ locale });

  return (
    <section className="max-w-3xl mx-auto text-center space-y-8">
      {/* Avatar Image */}
      <div className="flex justify-center">
        <Image
          src="/images/avatar.png"
          alt="Jaeil Lee"
          width={128}
          height={128}
          className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
        />
      </div>

      {/* Main Introduction */}
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h2>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t("subtitle")}
          </h2>
        </div>
        <SplitText
          text={t("description")}
          className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
          splitType="words"
          ease="elastic.out(1, 0.7)"
        />
      </div>

      {/* CTA Buttons */}
      <div className="flex justify-center space-x-4">
        <a
          href="#projects"
          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          {t("cta")}
        </a>
        <Link
          href="/contact"
          className="border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white dark:text-white px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Contact Me
        </Link>
      </div>
    </section>
  );
}
