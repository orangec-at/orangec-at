"use client";

import { APP_NAME } from "@/constant/layout";
import Image from "next/image";
import Link from "next/link";

export default function MobileHeader() {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white shadow-md md:hidden">
      <Image src="/svgs/logo.svg" alt="Logo" width={40} height={40} />
      <Link href="/" className="text-lg font-bold">
        {APP_NAME}
      </Link>
    </header>
  );
}
