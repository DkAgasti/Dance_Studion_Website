"use client";

import { motion } from "framer-motion";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { cn } from "@/lib/utils";

const EVENTS = [
  {
    year: "2016",
    title: "The Foundation",
    body: "ASM was born in a small studio in Patia with just 5 passionate students and a big dream.",
    color: "text-brand-start",
    dot: "bg-brand-start",
    gradient: "from-[#3a2a1f] via-surface to-[#7a5320]",
  },
  {
    year: "2019",
    title: "The First Big Stage",
    body: "Our first major annual performance featuring 100+ students on a professional stage.",
    color: "text-brand-mid",
    dot: "bg-brand-mid",
    gradient: "from-[#1c1140] via-surface to-[#3a1f6b]",
  },
  {
    year: "2023",
    title: "National Recognition",
    body: 'Awarded "Best Dance Academy in Odisha" at the National Art & Performance Awards.',
    color: "text-brand-lime",
    dot: "bg-brand-lime",
    gradient: "from-[#2a2a0f] via-surface to-[#5a5a1a]",
  },
];

function Milestone({ event, index }) {
  const reversed = index % 2 === 1;

  return (
    <div className="relative">
      <span
        aria-hidden
        className={cn(
          "absolute top-1/2 left-1/2 hidden size-4 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_20px_currentColor] md:block",
          event.dot,
          event.color
        )}
      />
      <div
        className={cn(
          "flex flex-col gap-6 md:flex-row md:items-center md:gap-20",
          reversed && "md:flex-row-reverse"
        )}
      >
        <motion.div
          initial={{ opacity: 0, x: reversed ? 24 : -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(
            "flex-1 text-center",
            !reversed ? "md:text-right" : "md:text-left"
          )}
        >
          <p className={cn("font-display text-4xl font-black", event.color)}>
            {event.year}
          </p>
          <h3 className="h4-display mt-2 uppercase">{event.title}</h3>
          <p
            className={cn(
              "mt-3 text-muted-foreground",
              !reversed && "md:ml-auto md:max-w-md"
            )}
          >
            {event.body}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: reversed ? -24 : 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1"
        >
          <ImageWithFallback
            gradient={event.gradient}
            className="aspect-video w-full rounded-xl border border-border"
          />
        </motion.div>
      </div>
    </div>
  );
}

// "Milestones" — alternating timeline of ASM's history.
export default function Milestones() {
  return (
    <section className="border-y border-border bg-white/[0.02]">
      <div className="container-page section-y">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h2-display text-center uppercase"
        >
          Milestones
        </motion.h2>

        <div className="relative mt-20 flex flex-col gap-20">
          <span
            aria-hidden
            className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-border md:block"
          />
          {EVENTS.map((event, i) => (
            <Milestone key={event.year} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
