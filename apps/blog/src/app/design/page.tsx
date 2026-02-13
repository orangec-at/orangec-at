import type { Metadata } from "next";
import ConditionalAppShell from "@/components/layout/conditional-app-shell";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";

import { DesignShowcase } from "@/components/design/design-showcase";

export const metadata: Metadata = {
  title: "Design Showcase | OrangeC-AT",
  description: "Living Ember design docs for colors, typography, components, and layout patterns.",
};

export default async function DesignPage() {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider key={locale} messages={messages} locale={locale}>
      <ConditionalAppShell>
        <DesignShowcase />
      </ConditionalAppShell>
    </NextIntlClientProvider>
  );
}
