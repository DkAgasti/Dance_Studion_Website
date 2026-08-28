"use client";

import { motion } from "framer-motion";
import ImageWithFallback from "@/components/media/ImageWithFallback";

// "Keep Dancing, Stay Fit" hero for the services/fitness page.
export default function FitnessHero() {
  return (
    <section className="relative flex h-[60vh] min-h-[440px] items-center overflow-hidden">
      <ImageWithFallback
        gradient="from-brand-mid/25 via-surface to-brand-start/20"
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container-page relative text-center"
      >
        <p className="eyebrow">Health &amp; Performance</p>
        <h1 className="h1-display mx-auto mt-4 max-w-3xl text-balance">
          Keep Dancing, <span className="text-gradient-brand">Stay Fit.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
          Elevate your health with our curated fitness programs, designed
          for rhythm, strength, and inner balance.
        </p>
      </motion.div>
    </section>
  );
}
