"use client";

import ContactForm from "@/components/contact/contact-form";
import ContactHero from "@/components/contact/contact-hero";
import SocialLinks from "@/components/contact/social-links";
import DotGrid from "@/components/ui/DotGrid";
import ProfileCard from "@/components/ui/ProfileCard";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { useTranslations } from "next-intl";

export default function ContactClient() {
  const t = useTranslations("contact");

  return (
    <main className="relative px-4 py-8 md:px-16 md:py-12 space-y-12">
      {/* DotGrid 배경 */}

      <ContactHero />

      {/* ProfileCard 섹션 */}
      <div className="flex justify-center">
        <ProfileCard
          showBehindGradient
          enableMobileTilt
          avatarUrl="/images/avatar.png"
          iconUrl="/images/favicon.png"
          name={t("profile.name")}
          title={t("profile.title")}
          handle={t("profile.handle")}
          status={t("profile.status")}
          contactText={t("profile.contactText")}
          iconSize="40px"
          iconRepeat="repeat"
          iconPosition="center"
          iconFit="contain"
          onContactClick={() => {
            document
              .getElementById("contact-form")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </div>

      {/* 추가 정보 섹션 */}
      <section className="max-w-2xl mx-auto text-center space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <SpotlightCard
            className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg"
            spotlightColor="rgba(99, 102, 241, 0.3)"
          >
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {t("features.projects.title")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("features.projects.description")}
            </p>
          </SpotlightCard>
          <SpotlightCard
            className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg"
            spotlightColor="rgba(34, 197, 94, 0.3)"
          >
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {t("features.talk.title")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("features.talk.description")}
            </p>
          </SpotlightCard>
          <SpotlightCard
            className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg"
            spotlightColor="rgba(251, 191, 36, 0.3)"
          >
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {t("features.response.title")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("features.response.description")}
            </p>
          </SpotlightCard>
        </div>
      </section>

      {/* 소셜 링크 */}
      <SocialLinks />

      {/* 연락 폼 */}
      <div id="contact-form">
        <ContactForm />
      </div>
    </main>
  );
}
