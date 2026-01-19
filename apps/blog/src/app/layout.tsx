import { ThemeProvider } from "@/contexts/theme-context";
import { auth } from "@/auth";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
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
  const locale = await getLocale();
  const session = await auth();

  return (
    <html lang={locale}>
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
          rel="stylesheet"
          type="text/css"
        />
      </head>
      <body className="font-sans antialiased paper-texture transition-colors duration-500">
        <SessionProvider session={session}>
          <ThemeProvider defaultTheme="system" storageKey="orangecat-theme">
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
