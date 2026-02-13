import { useTranslations } from "next-intl";
import { Button } from "@orangec-at/design";

export default function ContactForm() {
  const t = useTranslations("contact.form");

  return (
    <section className="w-full">
      <form className="space-y-3 rounded-2xl border border-border bg-card p-5">
        <input
          type="text"
          placeholder={t("name")}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-small text-foreground placeholder:text-muted-foreground focus:border-ember-accent focus:outline-none"
        />
        <input
          type="email"
          placeholder={t("email")}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-small text-foreground placeholder:text-muted-foreground focus:border-ember-accent focus:outline-none"
        />
        <textarea
          placeholder={t("message")}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-small text-foreground placeholder:text-muted-foreground focus:border-ember-accent focus:outline-none"
          rows={5}
        />
        <Button type="submit" className="rounded-full">
          {t("send")}
        </Button>
      </form>
    </section>
  );
}
