"use client";

import React from "react";
import {
  ArrowLeft,
  User,
  ShieldAlert,
  LogOut,
  Droplets,
  Bell,
  BellOff,
  Settings,
} from "lucide-react";
import type { ThemeMode } from "../types";

interface ProfileProps {
  onBack: () => void;
  onAdminClick: () => void;
  isAdmin: boolean;
  inkPoints: number;
  highlightedTexts: Set<string>;
  isSubscribed: boolean;
  onSubscriptionToggle: () => void;
  onLogout: () => void;
  theme: ThemeMode;
}

export const Profile: React.FC<ProfileProps> = ({
  onBack,
  onAdminClick,
  isAdmin,
  inkPoints,
  highlightedTexts,
  isSubscribed,
  onSubscriptionToggle,
  onLogout,
  theme,
}) => {
  const isDark = theme === "dark";

  return (
    <div
      className={`pt-32 pb-40 transition-colors duration-700 ${
        isDark ? "bg-[#121212]" : "bg-[#f4f1ea]"
      }`}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-bold transition-colors mb-16 ${
            isDark
              ? "text-stone-600 hover:text-white"
              : "text-stone-400 hover:text-stone-900"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Exit to Library
        </button>

        <div className="muji-panel p-8 md:p-12 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12 border-b border-stone-100 dark:border-stone-800 pb-12">
            <div className="w-32 h-32 rounded-sm border-4 flex items-center justify-center bg-stone-50 dark:bg-stone-800 border-stone-100 dark:border-stone-700 shadow-inner overflow-hidden">
              <User className="w-12 h-12 text-stone-400" />
            </div>
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-4xl font-serif font-bold mb-2">
                Researcher Session
              </h1>
              <p className="text-stone-500 font-light tracking-widest uppercase text-[10px]">
                {isAdmin ? "Senior Archivist Access" : "Academic Guest Access"}
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              {isAdmin && (
                <button
                  onClick={onAdminClick}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-red-900 text-white rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-red-800 transition-colors"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Admin Dashboard
                </button>
              )}
              <button
                onClick={onLogout}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-stone-200 dark:border-stone-700 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                End Session
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h2 className="text-xs tracking-[0.4em] uppercase font-bold text-stone-400 border-b pb-4">
                Research Assets
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="muji-shelf-cell p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Droplets className="w-4 h-4 text-red-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                      Ink
                    </span>
                  </div>
                  <p className="text-4xl font-handwriting">{inkPoints}</p>
                </div>
                <div className="muji-shelf-cell p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="w-4 h-4 text-stone-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                      Fragments
                    </span>
                  </div>
                  <p className="text-4xl font-handwriting">
                    {highlightedTexts.size}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-xs tracking-[0.4em] uppercase font-bold text-stone-400 border-b pb-4">
                Preferences
              </h2>
              <div className="flex items-center justify-between p-6 muji-shelf-cell">
                <div className="flex items-center gap-4">
                  {isSubscribed ? (
                    <Bell className="w-5 h-5 text-red-900" />
                  ) : (
                    <BellOff className="w-5 h-5 text-stone-400" />
                  )}
                  <div>
                    <p className="text-sm font-bold">Archives Gazette</p>
                    <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">
                      {isSubscribed ? "Subscribed" : "Unsubscribed"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onSubscriptionToggle}
                  className={`px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all ${
                    isSubscribed
                      ? "bg-stone-100 dark:bg-stone-800 text-stone-500"
                      : "bg-stone-900 text-white"
                  }`}
                >
                  {isSubscribed ? "Mute" : "Subscribe"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
