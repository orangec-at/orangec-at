"use client";

import { Marquee } from "./marquee";

interface MarqueeSectionProps {
  line1?: string;
  line2?: string;
}

export function MarqueeSection({
  line1 = "REACT * TYPESCRIPT * NEXT.JS *",
  line2 = "FRONTEND * DESIGN * CODE *",
}: MarqueeSectionProps) {
  return (
    <section className="bg-black py-8 md:py-10 overflow-hidden -skew-y-1 origin-left">
      <div className="skew-y-1">
        <Marquee
          text={line1}
          direction={1}
          className="text-kinetic-orange opacity-80"
        />
        <Marquee
          text={line2}
          direction={-1}
          className="text-white opacity-90"
        />
      </div>
    </section>
  );
}
