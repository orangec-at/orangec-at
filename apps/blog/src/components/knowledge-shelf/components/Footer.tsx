"use client";

import React, { useState } from "react";
import { Github, Twitter, Linkedin, Mail, Check, Layers } from "lucide-react";

import type { ThemeMode } from "../types";

interface FooterProps {
  onAdminSecret?: () => void;
  onSubscribe?: (email: string) => void;
  onDesignSystemClick?: () => void;
  theme: ThemeMode;
}

export const Footer: React.FC<FooterProps> = ({
  onAdminSecret,
  onSubscribe,
  onDesignSystemClick,
}) => {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !onSubscribe) return;
    onSubscribe(email);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
    setEmail("");
  };

  return (
    <footer className="bg-stone-900 text-white py-20 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-serif italic text-3xl mb-8 tracking-tight">
              Subscribe to the archives.
            </h3>
            <p className="text-stone-400 font-light mb-8 max-w-md">
              Get monthly updates on technical deep-dives, industry observations,
              and the occasional philosophical detour. No spam, only knowledge.
            </p>
            {isSuccess ? (
              <div className="flex items-center gap-3 text-green-400 font-serif italic py-3 animate-pulse">
                <Check className="w-5 h-5" />
                <span>You are now a researcher in our dispatch list.</span>
              </div>
            ) : (
              <form className="flex gap-4" onSubmit={handleSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="EMAIL ADDRESS"
                  className="bg-transparent border-b border-stone-700 py-3 flex-grow outline-none focus:border-white transition-colors text-xs tracking-widest font-light"
                />
                <button
                  type="submit"
                  className="text-xs tracking-widest uppercase font-bold border-b border-stone-200 pb-1 hover:text-stone-400 hover:border-stone-400 transition-colors"
                >
                  Join
                </button>
              </form>
            )}
          </div>

          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-stone-500 mb-8 font-bold">
              Catalog
            </h4>
            <ul className="space-y-4 text-sm font-light text-stone-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Frontend Architecture
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Visual Engineering
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  System Design
                </a>
              </li>
              <li>
                <button
                  onClick={onDesignSystemClick}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  Design System <Layers className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-stone-500 mb-8 font-bold">
              Connections
            </h4>
            <div className="flex gap-6">
              <a href="#" className="text-stone-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="mt-8 text-xs text-stone-500 font-light">
              Seoul, Republic of Korea <br />
              <span
                onClick={onAdminSecret}
                className="cursor-default select-none hover:text-stone-400 transition-colors"
              >
                © 2024 Archives.dev
              </span>
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-widest text-stone-600 uppercase">
          <div className="flex items-center gap-6">
            <span>Designed with intentionality</span>
            <button
              onClick={onDesignSystemClick}
              className="flex items-center gap-2 text-stone-400 hover:text-white transition-all"
            >
              UI SYSTEM <Layers className="w-3 h-3" />
            </button>
          </div>
          <span>Open Source Forever</span>
        </div>
      </div>
    </footer>
  );
};
