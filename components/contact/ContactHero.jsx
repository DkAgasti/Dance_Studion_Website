"use client";

import { motion } from "framer-motion";

// "Get in Touch" hero.
export default function ContactHero() {
  return (
    <section className="container-page pt-[calc(var(--header-h,88px)+72px)] pb-16 text-center md:pt-52">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="eyebrow">Ready to Dance?</p>
        <h1 className="h1-display mx-auto mt-4 max-w-3xl text-balance">
          Get In <span className="text-gradient-brand">Touch.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground">
          Whether you have a question about classes, pricing, or
          performances, we&apos;re here to help.
        </p>
      </motion.div>
    </section>
  );
}
