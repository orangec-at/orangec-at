import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function ContactForm() {
  const t = useTranslations("contact.form");
  
  return (
    <section className="max-w-md mx-auto">
      <form>
        <input
          type="text"
          placeholder={t("name")}
          className="w-full mb-2 p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        <input
          type="email"
          placeholder={t("email")}
          className="w-full mb-2 p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        <textarea
          placeholder={t("message")}
          className="w-full mb-2 p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          rows={5}
        />
        <Button type="submit">{t("send")}</Button>
      </form>
    </section>
  );
}
