"use client";

import { MENU_ITEMS } from "@/constant/layout";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottom() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <header className="flex items-center justify-between md:hidden fixed bottom-0 left-0 right-0 z-50 mx-4 mb-4 px-6 py-4 bg-white/90 backdrop-blur-md shadow-lg border-t border-gray-100 rounded-full">
      <div className="flex items-center gap-3">
        {!isHomePage && (
          <button
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-2 rounded-full transition-all duration-200"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15,18 9,12 15,6" />
            </svg>
          </button>
        )}
        <Link
          href="/"
          className="transition-all duration-200 hover:scale-110 hover:opacity-80"
        >
          <Image
            src="/svgs/logo.svg"
            alt="Home"
            width={28}
            height={28}
            className="rounded-full"
          />
        </Link>
      </div>
      <nav className="flex items-center gap-2">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-all duration-200 font-medium px-3 py-2 rounded-full text-sm ${
                isActive
                  ? "text-gray-900 font-semibold bg-gray-100"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
