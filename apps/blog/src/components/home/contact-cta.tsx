"use client";

import { FileText, Github, Linkedin, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Detail } from "../ui/typography";
import { colors, spacing } from "@/lib/design-tokens";

export default function ContactCTA() {
  const t = useTranslations("home.contact");
  return (
    <section className={spacing.element}>
      <div className="muji-pegboard rounded-2xl p-6 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              href: "mailto:your-email@example.com",
              icon: <Mail className="h-5 w-5" aria-hidden />,
              label: "Email",
            },
            {
              href: "https://github.com/yourusername",
              icon: <Github className="h-5 w-5" aria-hidden />,
              label: "GitHub",
              target: "_blank",
            },
            {
              href: "https://linkedin.com/in/yourprofile",
              icon: <Linkedin className="h-5 w-5" aria-hidden />,
              label: "LinkedIn",
              target: "_blank",
            },
            {
              href: "/resume.pdf",
              icon: <FileText className="h-5 w-5" aria-hidden />,
              label: "Resume",
              target: "_blank",
            },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.target}
              rel={item.target ? "noopener noreferrer" : undefined}
              className="muji-tile muji-tile-rounded flex flex-col items-center gap-2 p-4 text-center hover:translate-y-[-2px] transition-transform"
            >
              <span className={`text-xl ${colors.text.primary}`}>
                {item.icon}
              </span>
              <Detail variant="s-700">{item.label}</Detail>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
