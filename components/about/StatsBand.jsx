"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, animate } from "framer-motion";
import { cn } from "@/lib/utils";

const STATS = [
  { value: 500, suffix: "+", label: "Students", color: "text-foreground" },
  { value: 8, suffix: "+", label: "Dance Styles", color: "text-brand-lime-ink" },
  { value: 250, suffix: "+", label: "Performances", color: "text-brand-mid" },
  { value: 10, suffix: "+", label: "Years of Magic", color: "text-brand-start" },
];

function useCountUp(target, shouldAnimate) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [target, shouldAnimate]);

  return shouldAnimate ? value : target;
}

function StatItem({ value, suffix, label, color, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "120px" });
  const reduced = useReducedMotion();
  const count = useCountUp(value, inView && !reduced);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className="flex-1 text-center"
    >
      <p className={cn("font-display text-5xl font-bold sm:text-6xl", color)}>
        {count}
        {suffix}
      </p>
      <p className="eyebrow mt-2">{label}</p>
    </motion.div>
  );
}

// Stats band — 500+ / 8+ / 250+ / 10+.
export default function StatsBand() {
  return (
    <section className="border-y border-border bg-foreground/[0.02]">
      <div className="container-page flex flex-col gap-10 py-16 sm:flex-row sm:gap-6 md:py-20">
        {STATS.map((stat, i) => (
          <StatItem key={stat.label} {...stat} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}
