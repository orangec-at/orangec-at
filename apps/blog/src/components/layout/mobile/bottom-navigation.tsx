"use client";

import Link from "next/link";
import { Home, BookOpen, Mail } from "lucide-react";

export default function MobileBottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner flex justify-around py-2 md:hidden">
      <Link href="/" className="flex flex-col items-center text-sm">
        <Home size={20} />
        Home
      </Link>
      <Link href="/projects" className="flex flex-col items-center text-sm">
        <BookOpen size={20} />
        Projects
      </Link>
      <Link href="/contact" className="flex flex-col items-center text-sm">
        <Mail size={20} />
        Contact
      </Link>
    </nav>
  );
}
