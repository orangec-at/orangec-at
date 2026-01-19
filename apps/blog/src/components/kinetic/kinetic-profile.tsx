"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  ShieldAlert,
  LogOut,
  Droplets,
  Bell,
  BellOff,
  Zap,
  ArrowUpRight,
} from "lucide-react";

interface KineticProfileProps {
  onBack: () => void;
  onAdminClick: () => void;
  isAdmin: boolean;
  inkPoints: number;
  highlightedTexts: Set<string>;
  isSubscribed: boolean;
  subscriptionStatus?: "ACTIVE" | "PENDING" | "UNSUBSCRIBED";
  onSubscriptionToggle: () => void;
  onLogout: () => void;
}

function BackgroundDecoration() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-20 right-0 font-serif text-[30vw] font-black text-kinetic-orange/10 dark:text-kinetic-orange/5 leading-none select-none">
        ✦
      </div>
      <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-kinetic-orange/10 dark:bg-kinetic-orange/5 rounded-full blur-[150px]" />
    </div>
  );
}

function ProfileAvatar() {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 2 }}
      className="w-32 h-32 md:w-40 md:h-40 bg-[#1c1917] dark:bg-black border-4 border-kinetic-orange flex items-center justify-center relative group"
    >
      <User className="w-16 h-16 text-kinetic-orange" />
      <div className="absolute inset-0 bg-kinetic-orange/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

function ProfileTitle({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div className="text-center md:text-left flex-grow">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-serif text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#1c1917] dark:text-white"
      >
        Profile
      </motion.h1>
      <p className="font-mono text-sm uppercase tracking-widest mt-2 text-kinetic-orange">
        {isAdmin ? "// ADMIN ACCESS" : "// GUEST SESSION"}
      </p>
    </div>
  );
}

function ActionButtons({
  isAdmin,
  onAdminClick,
  onLogout,
}: {
  isAdmin: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 w-full md:w-auto">
      {isAdmin && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAdminClick}
          className="group flex items-center justify-center gap-2 px-8 py-4 bg-kinetic-orange text-black font-mono text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors"
        >
          <ShieldAlert className="w-4 h-4" />
          Admin Panel
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
        </motion.button>
      )}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onLogout}
        className="group flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white/20 text-white font-mono text-sm font-bold uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        End Session
      </motion.button>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  valueColor = "text-white",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  valueColor?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-[#f4f1ea] dark:bg-black border border-stone-300 dark:border-white/10 p-6 group hover:border-kinetic-orange/50 transition-colors"
    >
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <span className="font-mono text-xs uppercase tracking-widest text-[#78716c] dark:text-white/40">
          {label}
        </span>
      </div>
      <p className={`font-mono text-5xl font-bold ${valueColor}`}>{value}</p>
    </motion.div>
  );
}

function ResearchAssetsSection({
  inkPoints,
  fragmentsCount,
}: {
  inkPoints: number;
  fragmentsCount: number;
}) {
  return (
    <div className="p-8 md:p-12">
      <h2 className="font-serif text-xs uppercase tracking-[0.4em] font-black text-[#78716c] dark:text-white/40 mb-8 flex items-center gap-2">
        <Zap className="w-4 h-4 text-kinetic-orange" />
        Research Assets
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<Droplets className="w-5 h-5 text-kinetic-orange" />}
          label="Ink"
          value={inkPoints}
          valueColor="text-kinetic-orange"
        />
        <StatCard
          icon={<span className="font-mono text-lg text-kinetic-orange">#</span>}
          label="Fragments"
          value={fragmentsCount}
        />
      </div>
    </div>
  );
}

function PreferencesSection({
  isSubscribed,
  subscriptionStatus,
  onSubscriptionToggle,
}: {
  isSubscribed: boolean;
  subscriptionStatus?: "ACTIVE" | "PENDING" | "UNSUBSCRIBED";
  onSubscriptionToggle: () => void;
}) {
  const getStatusText = () => {
    if (subscriptionStatus === "PENDING") return "// Pending";
    return isSubscribed ? "// Subscribed" : "// Unsubscribed";
  };

  const getButtonText = () => {
    if (subscriptionStatus === "PENDING") return "Cancel";
    return isSubscribed ? "Mute" : "Subscribe";
  };

  const isPendingOrSubscribed =
    subscriptionStatus === "PENDING" || isSubscribed;

  return (
    <div className="p-8 md:p-12">
      <h2 className="font-serif text-xs uppercase tracking-[0.4em] font-black text-[#78716c] dark:text-white/40 mb-8 flex items-center gap-2">
        <Bell className="w-4 h-4 text-kinetic-orange" />
        Preferences
      </h2>

      <motion.div
        whileHover={{ x: 4 }}
        className="bg-[#f4f1ea] dark:bg-black border border-stone-300 dark:border-white/10 p-6 flex items-center justify-between hover:border-kinetic-orange/50 transition-colors"
      >
        <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 flex items-center justify-center border-2 ${
                isSubscribed
                  ? "border-kinetic-orange bg-kinetic-orange/10"
                  : "border-stone-300 dark:border-white/20 bg-transparent"
              }`}
            >
              {isSubscribed ? (
                <Bell className="w-5 h-5 text-kinetic-orange" />
              ) : (
                <BellOff className="w-5 h-5 text-[#78716c] dark:text-white/40" />
              )}
          </div>
            <div>
              <p className="font-mono text-sm font-bold text-[#1c1917] dark:text-white uppercase">
              Archives Gazette
            </p>
            <p className="font-mono text-xs uppercase tracking-widest text-kinetic-orange">
              {getStatusText()}
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSubscriptionToggle}
          className={`px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all ${
            isPendingOrSubscribed
              ? "bg-white/10 text-white/60 hover:bg-red-500/20 hover:text-red-400"
              : "bg-kinetic-orange text-black hover:bg-white"
          }`}
        >
          {getButtonText()}
        </motion.button>
      </motion.div>

      <div className="mt-6 flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isSubscribed ? "bg-green-500 animate-pulse" : "bg-stone-300 dark:bg-white/20"
          }`}
        />
        <span className="font-mono text-xs text-[#78716c] dark:text-white/30 uppercase">
          {isSubscribed ? "Notifications Active" : "Notifications Off"}
        </span>
      </div>
    </div>
  );
}

export function KineticProfile({
  onBack,
  onAdminClick,
  isAdmin,
  inkPoints,
  highlightedTexts,
  isSubscribed,
  subscriptionStatus,
  onSubscriptionToggle,
  onLogout,
}: KineticProfileProps) {
  return (
    <section className="min-h-screen bg-[#f4f1ea] dark:bg-black pt-32 pb-20 relative overflow-hidden">
      <BackgroundDecoration />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        onClick={onBack}
        className="group flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-[#78716c] dark:text-white/40 hover:text-kinetic-orange transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Exit to Library
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
            <div className="bg-white dark:bg-zinc-900 border-2 border-stone-300 dark:border-white/10 relative shadow-lg">
              <div className="absolute top-0 left-0 w-2 h-full bg-kinetic-orange" />

              <div className="p-8 md:p-12 border-b-2 border-stone-200 dark:border-white/10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <ProfileAvatar />
                <ProfileTitle isAdmin={isAdmin} />
                <ActionButtons
                  isAdmin={isAdmin}
                  onAdminClick={onAdminClick}
                  onLogout={onLogout}
                />
              </div>
            </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200 dark:divide-white/10">
              <ResearchAssetsSection
                inkPoints={inkPoints}
                fragmentsCount={highlightedTexts.size}
              />
              <PreferencesSection
                isSubscribed={isSubscribed}
                subscriptionStatus={subscriptionStatus}
                onSubscriptionToggle={onSubscriptionToggle}
              />
            </div>
          </div>

          <div className="h-1 bg-gradient-to-r from-kinetic-orange via-kinetic-orange/50 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-stone-200 dark:border-white/10 pt-8"
        >
          <p className="font-mono text-xs text-[#78716c] dark:text-white/30 uppercase tracking-widest">
            Session Active
          </p>
          <p className="font-mono text-xs text-[#78716c] dark:text-white/30 uppercase tracking-widest">
            {isAdmin ? "Admin Privileges Enabled" : "Standard Access Level"}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
