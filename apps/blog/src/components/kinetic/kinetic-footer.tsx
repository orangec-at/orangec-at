"use client";

import { ArrowUpRight } from "lucide-react";

interface KineticFooterProps {
  title?: string;
  email?: string;
  copyright?: string;
  socialLinks?: string[];
}

const SOCIAL_URLS: Record<string, string> = {
  GitHub: "https://github.com/orangec-at",
  LinkedIn: "https://linkedin.com/in/orangec-at",
  Instagram: "https://instagram.com",
  "App Store": "https://apps.apple.com/kr/app/yoga-journaling-drawhatha/id6689512757",
};

export function KineticFooter({
  title = "Let's Talk",
  email = "radio941016@gmail.com",
  copyright = "2024 OrangeCat Inc.",
  socialLinks = ["GitHub", "LinkedIn", "Instagram"],
}: KineticFooterProps) {
  return (
    <footer className="bg-[#f4f1ea] dark:bg-zinc-900 pt-12 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute -bottom-20 -right-20 font-serif text-[20vw] font-black text-[#1c1917] dark:text-kinetic-orange leading-none">
          ✦
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          <span className="font-mono text-sm uppercase tracking-widest mb-4 text-[#78716c] dark:text-kinetic-orange">
            (Contact)
          </span>
          <h2 className="font-serif text-[clamp(32px,8vw,80px)] md:text-[6vw] leading-none font-bold uppercase mb-6 text-[#1c1917] dark:text-white">
            {title}
          </h2>
          <a
            href={`mailto:${email}`}
            className="group inline-flex items-center gap-2 px-8 py-3 bg-[#1c1917] dark:bg-kinetic-orange text-white dark:text-black rounded-full font-mono text-sm md:text-base uppercase hover:scale-105 transition-transform"
          >
            {email}
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:rotate-45" />
          </a>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mt-12 border-t border-[#1c1917]/20 dark:border-white/20 pt-6 gap-4">
          <div className="font-mono font-bold uppercase text-sm text-[#1c1917] dark:text-white/60">
            © {copyright}
          </div>

          <div className="flex gap-6 md:gap-8">
            {socialLinks.map((link) => (
              <a
                key={link}
                href={SOCIAL_URLS[link] || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group font-mono font-bold uppercase text-sm text-[#1c1917] dark:text-white hover:text-kinetic-orange dark:hover:text-kinetic-orange transition-colors flex items-center gap-1"
              >
                {link}
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all group-hover:rotate-45" />
              </a>
            ))}
          </div>

          <div className="font-mono text-xs uppercase tracking-widest text-[#1c1917]/40 dark:text-white/30">
            Seoul, Korea
          </div>
        </div>
      </div>
    </footer>
  );
}
