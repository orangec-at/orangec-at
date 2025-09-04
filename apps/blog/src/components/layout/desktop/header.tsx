"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DesktopHeader() {
  return (
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white shadow-md">
      <Link href="/" className="text-2xl font-bold">
        My Portfolio
      </Link>
      <nav className="flex gap-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/projects" className="hover:underline">
          Projects
        </Link>
        <Link href="/blog" className="hover:underline">
          Blog
        </Link>
        <Link href="/contact" className="hover:underline">
          Contact
        </Link>
      </nav>
    </header>
  );
}
