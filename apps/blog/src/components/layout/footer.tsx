"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { withLocalePath } from "@/lib/locale-path";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="container-narrow mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-muted-foreground">
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/orangec-at"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ember-accent transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/jaeil-lee"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ember-accent transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="https://x.com/orangecat_dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ember-accent transition-colors"
            aria-label="X"
          >
            <Twitter className="w-5 h-5" />
          </a>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Link
            href={withLocalePath(locale, "/privacy")}
            className="ember-link"
          >
            {t("privacy")}
          </Link>
          <Link
            href={withLocalePath(locale, "/terms")}
            className="ember-link"
          >
            {t("terms")}
          </Link>
        </div>

        <p className="text-sm">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
