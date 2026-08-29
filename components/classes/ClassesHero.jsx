"use client";

import { motion } from "framer-motion";

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
          <h1 className="h1-display text-balance text-6xl md:text-8xl">
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
          className="relative mx-auto w-full max-w-xl"
        >
          {/* 👈 yahan apna image URL daalo */}
          <motion.img
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            src="https://res.cloudinary.com/fexwwils/image/upload/v1787894856/dance_classes.png"
            alt="Dancers at ASM Dance Studio"
            className="mx-auto w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
