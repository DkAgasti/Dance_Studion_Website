"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

// Full-width embedded map for the studio location (no API key needed).
export default function ContactMap() {
  const query = encodeURIComponent(siteConfig.address.full);

  return (
    <section className="container-page pb-20 md:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="overflow-hidden rounded-3xl border border-border"
      >
        <iframe
          title="ASM Dance Studio location"
          src={`https://www.google.com/maps?q=${query}&output=embed`}
          className="h-[380px] w-full grayscale-[15%] sm:h-[420px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </motion.div>
    </section>
  );
}
