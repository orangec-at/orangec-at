"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { withLocalePath } from "@/lib/locale-path";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="border-t border-stone-200 dark:border-white/10 py-12 px-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/orangec-at"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/jaeil-lee"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="https://x.com/orangecat_dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="X"
          >
            <Twitter className="w-5 h-5" />
          </a>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link
            href={withLocalePath(locale, "/privacy")}
            className="hover:text-foreground transition-colors"
          >
            {t("privacy")}
          </Link>
          <Link
            href={withLocalePath(locale, "/terms")}
            className="hover:text-foreground transition-colors"
          >
            {t("terms")}
          </Link>
        </div>

        <p className="text-sm text-muted-foreground">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
