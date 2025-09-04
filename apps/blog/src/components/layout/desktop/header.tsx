"use client";

import { APP_NAME, MENU_ITEMS } from "@/constant/layout";
import Image from "next/image";
import Link from "next/link";

export default function DesktopHeader() {
  return (
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white shadow-md">
      <Image src="/svgs/logo.svg" alt="Logo" width={40} height={40} />
      <Link href="/" className="text-2xl font-bold">
        {APP_NAME}
      </Link>
      <nav className="flex gap-6">
        {MENU_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="hover:underline">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
