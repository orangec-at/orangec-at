"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MobileHeader() {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white shadow-md md:hidden">
      <Link href="/" className="text-lg font-bold">
        My Portfolio
      </Link>
      <Button className="px-3 py-1">Menu</Button>
    </header>
  );
}
