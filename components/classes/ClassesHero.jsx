"use client";

import { motion } from "framer-motion";
import ImageWithFallback from "@/components/media/ImageWithFallback";

// "Dance Classes" hero — heading + intro left, dancer photo + decorative
// shapes right.
export default function ClassesHero() {
  return (
    <section className="container-page relative overflow-hidden pt-40 pb-20 md:pt-52 md:pb-24">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="h1-display text-balance">
            DANCE
            <br />
            <span className="text-gradient-brand">CLASSES</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Master the rhythm, express your soul. Explore our diverse range
            of classes for all ages and skill levels.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative mx-auto aspect-square w-full max-w-sm"
        >
          <div
            aria-hidden
            className="bg-gradient-brand absolute inset-8 rounded-full opacity-20 blur-[80px]"
          />
          <div
            aria-hidden
            className="bg-gradient-brand absolute inset-10 rotate-12 rounded-[3rem] border-2 border-transparent [background:linear-gradient(var(--background),var(--background))_padding-box,linear-gradient(135deg,var(--brand-start),var(--brand-mid),var(--brand-end))_border-box] opacity-70"
          />
          <div
            aria-hidden
            className="absolute top-6 left-2 grid grid-cols-3 gap-1.5 opacity-40"
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="size-1.5 rounded-full bg-brand-mid" />
            ))}
          </div>
          <ImageWithFallback
            gradient="from-brand-start/25 via-surface to-brand-mid/25"
            className="absolute inset-6 rounded-3xl border border-border shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
