import { ThemeProvider } from "@/contexts/theme-context";
import { auth } from "@/auth";
import ConditionalAppShell from "@/components/layout/conditional-app-shell";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrangeCat, The Product Engineer",
  description: "Orange Cat, Who Loves to Code with Typescript",
  icons: {
    icon: "/images/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background text-foreground transition-colors duration-200">
        <SessionProvider session={session}>
          <ThemeProvider defaultTheme="dark" storageKey="orangecat-theme">
            <ConditionalAppShell>{children}</ConditionalAppShell>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
