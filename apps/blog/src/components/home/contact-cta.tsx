"use client";

import { useTranslations } from "next-intl";
import { Title, Detail } from "../ui/typography";

export default function ContactCTA() {
  const t = useTranslations('home.contact');
  return (
    <section className="max-w-2xl mx-auto text-center space-y-8">
      <div className="border-t pt-12">
        <Title variant="xl-700" as="h3" className="text-gray-900 dark:text-white mb-6">
          {t('title')}
        </Title>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="mailto:your-email@example.com"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-xl mb-2">📧</span>
            <Detail variant="s-700">Email</Detail>
          </a>

          <a
            href="https://github.com/yourusername"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-xl mb-2">🐙</span>
            <Detail variant="s-700">GitHub</Detail>
          </a>

          <a
            href="https://linkedin.com/in/yourprofile"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-xl mb-2">💼</span>
            <Detail variant="s-700">LinkedIn</Detail>
          </a>

          <a
            href="/resume.pdf"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            target="_blank"
          >
            <span className="text-xl mb-2">📄</span>
            <Detail variant="s-700">Resume</Detail>
          </a>
        </div>
      </div>
    </section>
  );
}
