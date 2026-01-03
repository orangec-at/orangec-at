
"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

interface AtomicSliderProps {
  label: string;
  left: string;
  right: string;
  initialValue?: number;
}

export const AtomicSlider = ({ label, left, right, initialValue = 50 }: AtomicSliderProps) => {
  const [val, setVal] = useState(initialValue);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const handleDrag = (_: any, info: any) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((info.point.x - rect.left) / rect.width) * 100));
    setVal(Math.round(percentage));
  };

  return (
    <div className="group py-4">
      <div className="flex justify-between items-center mb-4">
        {/* label: light=stone-400, dark=stone-500 */}
        <span className="text-[9px] font-bold uppercase tracking-widest transition-colors text-stone-400 dark:text-stone-500 group-hover:text-stone-900 dark:group-hover:text-white">
            {label}
        </span>
        <div className="flex gap-4 text-[7px] font-bold uppercase tracking-widest text-stone-300">
          <span>{left}</span>
          <span>{right}</span>
        </div>
      </div>
      <div ref={trackRef} className="relative h-px w-full flex items-center bg-stone-200 dark:bg-stone-800">
        <motion.div 
          drag="x"
          dragConstraints={trackRef}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          animate={{ left: `${val}%` }}
          className="absolute w-3 h-3 rounded-full shadow-lg cursor-grab active:cursor-grabbing z-10 bg-stone-900 dark:bg-red-600"
        />
        <div className="absolute left-0 h-px bg-stone-800 dark:bg-red-900" style={{ width: `${val}%` }} />
      </div>
    </div>
  );
};
