"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border pt-8 pb-[calc(8rem+env(safe-area-inset-bottom))] md:py-8">
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
          <Link href="/privacy" className="ember-link">
            Privacy
          </Link>
          <Link href="/terms" className="ember-link">
            Terms
          </Link>
        </div>

        <p className="text-sm">{`© ${year} OrangeCat's Blog. All rights reserved.`}</p>
      </div>
    </footer>
  );
}
