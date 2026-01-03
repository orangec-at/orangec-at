import ConditionalAppShell from "@/components/layout/conditional-app-shell";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  const messages = await getMessages();

  return (
    <NextIntlClientProvider key={locale} messages={messages} locale={locale}>
      <ConditionalAppShell>{children}</ConditionalAppShell>
    </NextIntlClientProvider>
  );
}
