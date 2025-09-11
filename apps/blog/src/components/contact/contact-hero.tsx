import { useTranslations } from "next-intl";

export default function ContactHero() {
  const t = useTranslations("contact.hero");
  
  return (
    <section className="space-y-4 text-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t("title")}</h1>
      <p className="text-gray-700 dark:text-gray-300">
        {t("description")}
      </p>
    </section>
  );
}
