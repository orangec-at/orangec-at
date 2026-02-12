"use client";

import { ControlCenter } from "./control-center";
import { ChevronDown, ChevronUp, Sliders } from "lucide-react";
import { FaGithub, FaLinkedin, FaEnvelope, FaXTwitter } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ContactForm from "@/components/contact/contact-form";

export default function ControlCenterDock() {
  const t = useTranslations("controlCenter");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const ownerEmail = "radio941016@gmail.com";

  return (
    <aside className="hidden md:block fixed right-6 bottom-6 z-40 w-[320px] max-w-[calc(100vw-3rem)]">
      <div className="overflow-hidden rounded-2xl border border-border bg-card/90 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span className="inline-flex h-2 w-2 rounded-full bg-ember-accent" />
            {t("title")}
          </div>
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-muted-foreground" />
            <button
              type="button"
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? "Expand panel" : "Collapse panel"}
              onClick={() => setIsCollapsed((prev) => !prev)}
            >
              {isCollapsed ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        {!isCollapsed && (
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <ControlCenter variant="inline" className="space-y-3" />
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="GitHub"
              >
                <FaGithub className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/in/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => setShowContact(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="Email / Contact form"
              >
                <FaEnvelope className="h-4 w-4" />
              </button>
              <a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="X (Twitter)"
              >
                <FaXTwitter className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </div>

      {showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowContact(false)}
          />
            <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {t("title")} · Contact
                </h3>
                <button
                type="button"
                onClick={() => setShowContact(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="Close contact form"
              >
                ×
              </button>
            </div>
            <ContactForm />
            <div className="mt-4 text-right">
                <a
                  href={`mailto:${ownerEmail}`}
                  className="text-sm text-muted-foreground underline hover:text-foreground"
                >
                  Email: {ownerEmail}
                </a>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
