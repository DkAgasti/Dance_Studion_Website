"use client";

import { motion } from "framer-motion";
import ImageWithFallback from "@/components/media/ImageWithFallback";

// "Our Story" hero — full-bleed atmospheric banner opening the About page.
export default function StoryHero() {
  return (
    <section className="relative flex h-[70vh] min-h-[520px] w-full items-center overflow-hidden">
      <ImageWithFallback
        gradient="from-brand-start/20 via-surface to-brand-mid/25"
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container-page relative text-center"
      >
        <p className="eyebrow">Our Story</p>
        <h1 className="h1-display mx-auto mt-4 max-w-3xl text-balance">
          More Than <span className="text-gradient-brand">A Studio.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
          From a single studio in Patia to Bhubaneswar&apos;s home of dance
          and fitness.
        </p>
      </motion.div>
    </section>
  );
}
