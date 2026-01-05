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
      <div className="muji-dock rounded-2xl border border-wood-300/70 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-wood-300/60 dark:border-gray-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-wood-800 dark:text-gray-100">
            <span className="inline-flex h-2 w-2 rounded-full bg-wood-600 dark:bg-wood-300" />
            {t("title")}
          </div>
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-wood-700 dark:text-gray-300" />
            <button
              type="button"
              className="muji-icon-button h-7 w-7"
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
                className="muji-icon-button h-10 w-10"
                aria-label="GitHub"
              >
                <FaGithub className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/in/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="muji-icon-button h-10 w-10"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => setShowContact(true)}
                className="muji-icon-button h-10 w-10"
                aria-label="Email / Contact form"
              >
                <FaEnvelope className="h-4 w-4" />
              </button>
              <a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="muji-icon-button h-10 w-10"
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
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("title")} · Contact
                </h3>
                <button
                type="button"
                onClick={() => setShowContact(false)}
                className="muji-icon-button h-9 w-9"
                aria-label="Close contact form"
              >
                ×
              </button>
            </div>
            <ContactForm />
            <div className="mt-4 text-right">
              <a
                href={`mailto:${ownerEmail}`}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white underline"
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
