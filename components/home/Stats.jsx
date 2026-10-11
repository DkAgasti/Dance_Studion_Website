"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion, animate } from "framer-motion";
import { cn } from "@/lib/utils";

const COLORS = ["text-brand-end", "text-brand-lime-ink", "text-brand-mid", "text-brand-start"];

const DEFAULT_STATS = [
  { label: "Students", value: "500+" },
  { label: "Five-Star Reviews", value: "117" },
  { label: "Dance Styles", value: "8" },
  { label: "Years of Experience", value: "10+" },
];

// Splits "500+" into { number: 500, suffix: "+" } so the count-up animation
// still works for CMS-entered values.
function parseStat(value) {
  const match = String(value ?? "").match(/^(\d+)(.*)$/);
  if (!match) return { number: 0, suffix: String(value ?? "") };
  return { number: Number(match[1]), suffix: match[2] };
}

// framer-motion's useInView (IntersectionObserver-based) can miss its first
// callback on iOS Safari right after a refresh — the address bar is still
// collapsing/expanding and reflowing the page when the observer attaches, so
// the initial intersection check can come back wrong and, since it only
// fires once, the counter never starts. Back it with an immediate
// getBoundingClientRect() check on mount as a fallback.
function useInViewOnce(ref) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;

    function isNearViewport() {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return rect.top < vh + 120 && rect.bottom > -120;
    }

    if (isNearViewport()) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, inView]);

  return inView;
}

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
  const inView = useInViewOnce(ref);
  const reduced = useReducedMotion();
  const count = useCountUp(value, inView && !reduced);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className="text-center"
    >
      <p className={cn("stat-display", color)}>
        {count}
        {suffix}
      </p>
      <p className="eyebrow mt-3">{label}</p>
    </motion.div>
  );
}

// Home page stats section — students trained, reviews, styles, years running.
// Hardcoded (no longer admin-editable — the Homepage content tab was removed).
export default function Stats() {
  const stats = DEFAULT_STATS;

  return (
    <section className="container-page pt-16 pb-4 md:pt-20 md:pb-6">
      <div className="grid grid-cols-2 gap-y-10 gap-x-6 md:grid-cols-4">
        {stats.map((stat, i) => {
          const { number, suffix } = parseStat(stat.value);
          return (
            <StatItem
              key={stat.label}
              value={number}
              suffix={suffix}
              label={stat.label}
              color={COLORS[i % COLORS.length]}
              delay={i * 0.1}
            />
          );
        })}
      </div>
    </section>
  );
}
