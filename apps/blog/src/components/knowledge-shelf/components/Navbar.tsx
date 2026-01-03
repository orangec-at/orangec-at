"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Search,
  Menu,
  ShoppingBag,
  X,
  Hash,
  Database,
  Info,
  User,
  ShieldAlert,
  Layers,
  Moon,
  Sun,
} from "lucide-react";

import type { ThemeMode, ViewState } from "../types";

interface NavbarProps {
  scrolled: boolean;
  currentView: ViewState;
  theme: ThemeMode;
  onThemeToggle: () => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onHomeClick: () => void;
  onThreadsClick: () => void;
  onCatalogClick: () => void;
  onShopClick: () => void;
  onAboutClick: () => void;
  onProfileClick: () => void;
  onAdminClick: () => void;
  onSearchOpen: () => void;
  onDesignSystemClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  scrolled,
  currentView,
  theme,
  onThemeToggle,
  isLoggedIn,
  isAdmin,
  onHomeClick,
  onThreadsClick,
  onCatalogClick,
  onShopClick,
  onAboutClick,
  onProfileClick,
  onAdminClick,
  onSearchOpen,
  onDesignSystemClick,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDark = theme === "dark";

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleNavClick = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { id: "home", label: "Journal", action: onHomeClick, icon: BookOpen },
    { id: "threads", label: "Threads", action: onThreadsClick, icon: Hash },
    { id: "catalog", label: "Catalog", action: onCatalogClick, icon: Database },
    { id: "shop", label: "Gift Shop", action: onShopClick, icon: ShoppingBag },
    { id: "about", label: "About", action: onAboutClick, icon: Info },
  ] as const;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-20 flex items-center justify-between px-6 md:px-12 ${
          scrolled || isMobileMenuOpen
            ? isDark
              ? "bg-[#121212]/95 border-stone-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
              : "bg-[#f4f1ea]/95 border-stone-300 shadow-sm"
            : "bg-transparent"
        } ${scrolled || isMobileMenuOpen ? "backdrop-blur-md border-b" : ""}`}
      >
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => handleNavClick(onHomeClick)}
        >
          <div
            className={`w-8 h-8 rounded-sm flex items-center justify-center font-serif italic text-xl group-hover:rotate-3 transition-all ${
              isDark ? "bg-red-900 text-white" : "bg-stone-900 text-white"
            }`}
          >
            A
          </div>
          <span
            className={`font-serif italic text-xl font-bold tracking-tight transition-colors ${
              isDark ? "text-white" : "text-stone-900"
            }`}
          >
            Archives.
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-[10px] tracking-[0.3em] uppercase">
          {navLinks.map((link) => {
            const isActive =
              currentView === link.id || (link.id === "home" && currentView === "post");
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.action)}
                className={`relative group transition-colors py-1 ${
                  isActive
                    ? isDark
                      ? "text-white"
                      : "text-stone-900"
                    : isDark
                      ? "text-stone-600 hover:text-stone-300"
                      : "text-stone-400 hover:text-stone-900"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="navHighlight"
                    className={`absolute inset-0 -inset-x-2 -z-10 rounded-sm ${
                      isDark ? "bg-red-950/30" : "bg-yellow-200/40 mix-blend-multiply"
                    }`}
                  />
                )}
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 ${
                    isDark ? "bg-red-600" : "bg-stone-800"
                  } ${
                    isActive
                      ? "w-full opacity-0"
                      : "group-hover:w-full group-hover:border-b group-hover:border-dotted group-hover:bg-transparent group-hover:h-0"
                  }`}
                />
              </button>
            );
          })}

          <div className={`w-px h-4 mx-2 ${isDark ? "bg-stone-800" : "bg-stone-300"}`} />

          <div className="flex items-center gap-2">
            <button
              onClick={onThemeToggle}
              className={`p-2 rounded-full transition-all ${
                isDark
                  ? "text-red-500 hover:bg-red-950/30"
                  : "text-stone-400 hover:bg-stone-200 hover:text-stone-900"
              }`}
              title={isDark ? "Daylight Mode" : "Midnight Mode"}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sun className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Moon className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={onSearchOpen}
              className={`p-2 rounded-full transition-all ${
                isDark ? "text-stone-500 hover:text-white" : "text-stone-400 hover:text-stone-900"
              }`}
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={onDesignSystemClick}
              className={`p-2 rounded-full border transition-all ${
                currentView === "design-system"
                  ? isDark
                    ? "bg-white text-stone-900 border-white"
                    : "bg-stone-900 text-white border-stone-900"
                  : isDark
                    ? "text-stone-500 border-stone-800 hover:border-stone-500"
                    : "text-stone-400 border-stone-200 hover:border-stone-900 hover:text-stone-900"
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>

            {isAdmin && (
              <button
                onClick={onAdminClick}
                className={`p-2 rounded-full border transition-all ${
                  currentView === "admin"
                    ? "bg-red-900 text-white border-red-900"
                    : isDark
                      ? "text-red-900 border-red-950 hover:bg-red-950"
                      : "text-red-400 border-red-100 hover:border-red-400"
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onProfileClick}
              className={`flex items-center gap-2 py-1.5 px-3 rounded-full border transition-all ${
                currentView === "profile"
                  ? isDark
                    ? "bg-white text-stone-900 border-white"
                    : "bg-stone-900 text-white border-stone-900"
                  : isDark
                    ? "text-stone-400 border-stone-800 hover:border-stone-400"
                    : "text-stone-400 border-stone-200 hover:border-stone-900 hover:text-stone-900"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="text-[9px] font-bold tracking-widest uppercase">
                {isLoggedIn ? (isAdmin ? "Master" : "Sanctum") : "Login"}
              </span>
            </button>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button onClick={onThemeToggle} className={`p-2 ${isDark ? "text-red-500" : "text-stone-800"}`}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={onSearchOpen} className={`p-2 ${isDark ? "text-white" : "text-stone-800"}`}>
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={toggleMenu}
            className={`p-2 focus:outline-none ${isDark ? "text-white" : "text-stone-800"}`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed inset-0 z-40 paper-texture pt-32 px-8 md:hidden ${
              isDark ? "bg-[#121212]" : "bg-[#fdfcf5]"
            }`}
          >
            <div className="flex flex-col gap-10 h-full">
              <div
                className={`border-b pb-4 flex justify-between items-center ${
                  isDark ? "border-stone-800" : "border-stone-200"
                }`}
              >
                <span className="text-[10px] tracking-[0.4em] uppercase text-stone-400 font-bold block">
                  Shelf Index
                </span>
                <button
                  onClick={onDesignSystemClick}
                  className={`text-[10px] font-bold flex items-center gap-2 ${
                    isDark ? "text-stone-300" : "text-stone-800"
                  }`}
                >
                  <Layers className="w-3 h-3" /> UI SYSTEM
                </button>
              </div>

              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => {
                  const isActive =
                    currentView === link.id || (link.id === "home" && currentView === "post");
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link.action)}
                      className="flex items-center justify-between group py-2"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            isActive
                              ? isDark
                                ? "bg-red-900 text-white"
                                : "bg-stone-900 text-white"
                              : isDark
                                ? "bg-stone-900 text-stone-600"
                                : "bg-stone-100 text-stone-400"
                          }`}
                        >
                          <link.icon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col items-start">
                          <span
                            className={`text-2xl font-serif font-bold transition-all ${
                              isActive
                                ? isDark
                                  ? "text-white italic translate-x-1"
                                  : "text-stone-900 italic translate-x-1"
                                : isDark
                                  ? "text-stone-700"
                                  : "text-stone-400"
                            }`}
                          >
                            {link.label}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}

                <button
                  onClick={() => handleNavClick(onProfileClick)}
                  className={`flex items-center justify-between group py-2 border-t mt-4 pt-4 ${
                    isDark ? "border-stone-800" : "border-stone-100"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        currentView === "profile"
                          ? isDark
                            ? "bg-red-900 text-white"
                            : "bg-stone-900 text-white"
                          : isDark
                            ? "bg-stone-900 text-stone-600"
                            : "bg-stone-100 text-stone-400"
                      }`}
                    >
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span
                        className={`text-2xl font-serif font-bold transition-all ${
                          currentView === "profile"
                            ? isDark
                              ? "text-white italic translate-x-1"
                              : "text-stone-900 italic translate-x-1"
                            : isDark
                              ? "text-stone-700"
                              : "text-stone-400"
                        }`}
                      >
                        {isLoggedIn
                          ? isAdmin
                            ? "The Master Desk"
                            : "The Sanctum"
                          : "Authenticate"}
                      </span>
                    </div>
                  </div>
                </button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
