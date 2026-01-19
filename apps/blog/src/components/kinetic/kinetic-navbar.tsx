"use client";

import { Menu, X, User, LogIn } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { withLocalePath } from "@/lib/locale-path";

interface NavItem {
  href: string;
  label: string;
}

interface KineticNavbarProps {
  brand?: string;
  items?: NavItem[];
}

const DEFAULT_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/threads", label: "Threads" },
  { href: "/resume", label: "Resume" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

export function KineticNavbar({
  brand = "OrangeCat®",
  items = DEFAULT_ITEMS,
}: KineticNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const router = useRouter();
  
  const handleLogin = () => {
    router.push(withLocalePath(locale, "/login"));
  };

  const localizedItems = items.map((item) => ({
    ...item,
    href: `/${locale}${item.href}`,
  }));

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 md:px-8 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-stone-200 dark:border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}`}
            className="font-serif text-2xl font-bold uppercase tracking-tighter mix-blend-difference text-[#1c1917] dark:text-white"
          >
            {brand}
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-white/90 dark:bg-black/90 p-1.5 rounded-full backdrop-blur-sm border border-stone-200 dark:border-white/10">
          {localizedItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-5 py-2 rounded-full font-mono text-sm uppercase transition-all duration-300 ${
                  isActive
                    ? "bg-kinetic-orange text-black"
                    : "bg-transparent text-[#1c1917] dark:text-white hover:bg-[#1c1917] dark:hover:bg-white hover:text-white dark:hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <Link
              href={withLocalePath(locale, "/profile")}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-kinetic-orange text-black hover:bg-[#1c1917] hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 overflow-hidden"
              aria-label="Profile"
            >
              {session?.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <User size={18} />
              )}
            </Link>
          ) : (
            <button
              onClick={handleLogin}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/80 dark:bg-black/80 border border-stone-200 dark:border-white/10 text-[#1c1917] dark:text-white hover:bg-kinetic-orange hover:text-black transition-all duration-300"
              aria-label="Login"
            >
              <LogIn size={18} />
            </button>
          )}

          <button
            className="md:hidden p-2 bg-white dark:bg-black text-[#1c1917] dark:text-white rounded-full border border-stone-200 dark:border-white/10"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white/98 dark:bg-black/98 backdrop-blur-md pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {localizedItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`block py-4 font-serif text-4xl font-bold uppercase border-b border-stone-200 dark:border-white/10 transition-all duration-300 ${
                        isActive
                          ? "text-kinetic-orange"
                          : "text-[#1c1917] dark:text-white hover:text-kinetic-orange hover:translate-x-4"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center gap-4">
              {isLoggedIn ? (
                <Link
                  href={withLocalePath(locale, "/profile")}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-stone-100 dark:bg-white/10 text-[#1c1917] dark:text-white font-mono text-sm uppercase"
                >
                  <User size={16} /> Profile
                </Link>
              ) : (
                <button
                  onClick={() => {
                    handleLogin();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-stone-100 dark:bg-white/10 text-[#1c1917] dark:text-white font-mono text-sm uppercase"
                >
                  <LogIn size={16} /> Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
