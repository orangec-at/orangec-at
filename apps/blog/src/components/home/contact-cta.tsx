"use client";

import { FileText, Github, Linkedin, Mail } from "lucide-react";

export default function ContactCTA() {
  return (
    <section className="container-narrow py-section">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
              className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-small text-muted-foreground transition-colors hover:border-ember-accent/40 hover:text-ember-accent"
            >
              <span className="text-foreground transition-colors group-hover:text-ember-accent">
                {item.icon}
              </span>
              <span className="text-body">{item.label}</span>
            </a>
          ))}
        </div>
    </section>
  );
}
