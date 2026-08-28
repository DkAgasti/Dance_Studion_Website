"use client";

import { motion } from "framer-motion";
import { danceStyles } from "@/config/classes";

// Scrolling marquee of dance style names on the home page.
export default function Marquee() {
  const names = danceStyles.map((s) => s.name);

  return (
    <section className="overflow-hidden border-y border-border bg-white/[0.02] py-6">
      <motion.div
        className="flex w-max gap-16"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        {[...names, ...names].map((name, i) => (
          <span
            key={i}
            className="flex items-center gap-16 font-display text-2xl font-medium whitespace-nowrap text-muted-foreground sm:text-3xl"
          >
            {name}
            <span aria-hidden className="text-brand-mid">
              ✦
            </span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}
