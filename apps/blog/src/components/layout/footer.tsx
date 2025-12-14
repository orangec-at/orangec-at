"use client";

import { useTranslations } from "next-intl";
import { Detail } from "../ui/typography";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="hidden md:flex items-center justify-center py-6 bg-gray-100 dark:bg-gray-800">
      <Detail variant="s-400" className="text-gray-700 dark:text-gray-300">
        {t("copyright", { year: new Date().getFullYear() })}
      </Detail>
    </footer>
  );
}
