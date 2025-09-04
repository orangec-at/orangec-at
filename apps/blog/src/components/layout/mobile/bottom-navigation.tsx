"use client";

import Link from "next/link";
import { Home, BookOpen, Mail } from "lucide-react";
import { MENU_ITEMS } from "@/constant/layout";

export default function MobileBottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner flex justify-around py-2 md:hidden">
      {MENU_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex flex-col items-center text-sm"
        >
          <item.icon size={20} />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
