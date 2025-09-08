import AppNavigation from "@/components/layout/app-navigation";

export default function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppNavigation>{children}</AppNavigation>;
}