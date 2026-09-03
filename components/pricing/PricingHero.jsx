"use client";

import { motion } from "framer-motion";

// "Simple, Honest Pricing" hero.
export default function PricingHero() {
  return (
    <section className="container-page pt-[calc(var(--header-h,88px)+72px)] pb-16 text-center md:pt-52">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <p className="eyebrow">Transparent Plans</p>
        <h1 className="h1-display mx-auto mt-4 max-w-3xl text-balance">
          Simple, <span className="text-gradient-brand">Honest</span> Pricing.
        </h1>
      </motion.div>
    </section>
  );
}
