import { useTranslations } from "next-intl";
import { Heading, Body } from "../ui/typography";

export default function ContactHero() {
  const t = useTranslations("contact.hero");

  return (
    <section className="space-y-4 text-center">
      <Heading variant="s-700" as="h1" className="text-foreground">
        {t("title")}
      </Heading>
      <Body variant="l-400" className="text-muted-foreground">
        {t("description")}
      </Body>
    </section>
  );
}
