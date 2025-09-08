import AppNavigation from "@/components/layout/app-navigation";
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

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider key={locale} messages={messages} locale={locale}>
      <AppNavigation>{children}</AppNavigation>
    </NextIntlClientProvider>
  );
}
