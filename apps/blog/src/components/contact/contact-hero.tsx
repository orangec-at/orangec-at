import { useTranslations } from "next-intl";
import { Heading, Body } from "../ui/typography";

export default function ContactHero() {
  const t = useTranslations("contact.hero");

  return (
    <section className="space-y-4 text-center">
      <Heading variant="s-700" as="h1" className="text-gray-900 dark:text-gray-100">
        {t("title")}
      </Heading>
      <Body variant="l-400" className="text-gray-700 dark:text-gray-300">
        {t("description")}
      </Body>
    </section>
  );
}
