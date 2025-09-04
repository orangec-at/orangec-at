import AppNavigation from "@/components/layout/app-navigation";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppNavigation>{children}</AppNavigation>;
}
