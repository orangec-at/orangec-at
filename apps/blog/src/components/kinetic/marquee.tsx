"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  text: string;
  direction?: 1 | -1;
  className?: string;
  duration?: number;
}

export function Marquee({ 
  text, 
  direction = 1, 
  className,
  duration = 40 
}: MarqueeProps) {
  return (
    <div className={cn("flex overflow-hidden whitespace-nowrap py-4", className)}>
      <motion.div
        className="flex gap-8"
        animate={{ x: direction === 1 ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration }}
      >
        {[...Array(8)].map((_, i) => (
          <span 
            key={i} 
            className="text-[4vw] font-bold uppercase leading-none tracking-tight font-serif"
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
