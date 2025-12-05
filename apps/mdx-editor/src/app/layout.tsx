import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MDX Editor - OrangeC",
  description: "Standalone MDX Editor with real-time preview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
