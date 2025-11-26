"use client";

import Image from "next/image";
import Link from "next/link";
import { SplitText } from "../ui/split-text";
import { Heading, Title } from "../ui/typography";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export default function HomeHero() {
  const t = useTranslations("home.hero");

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
          <Heading variant="s-700" className="text-gray-900 dark:text-white">
            {t("title")}
          </Heading>
          <Title variant="l-700" className="text-gray-900 dark:text-white">
            {t("subtitle")}
          </Title>
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
        <Button asChild size="lg">
          <a href="#projects">{t("cta")}</a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/contact">Contact Me</Link>
        </Button>
      </div>
    </section>
  );
}
