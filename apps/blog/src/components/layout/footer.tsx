"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { withLocalePath } from "@/lib/locale-path";
import { Detail } from "../ui/typography";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="hidden md:flex items-center justify-center py-6 bg-gray-100 dark:bg-gray-800">
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
        <nav className="flex items-center gap-4">
          <Link
            href={withLocalePath(locale, "/terms")}
            className="text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {t("terms")}
          </Link>
          <Link
            href={withLocalePath(locale, "/privacy")}
            className="text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {t("privacy")}
          </Link>
          <Link
            href={withLocalePath(locale, "/profile")}
            className="text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {t("newsletter")}
          </Link>
        </nav>
        <Detail variant="s-400" className="text-gray-700 dark:text-gray-300">
          {t("copyright", { year: new Date().getFullYear() })}
        </Detail>
      </div>
    </footer>
  );
}
