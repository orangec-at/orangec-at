import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrangeCat Design System",
  description: "Design system components showcase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
