"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ImageWithFallback from "@/components/media/ImageWithFallback";

// "The Mentor" — trainer card for this specific class (derived from its batches).
export default function ClassMentor({ trainer }) {
  if (!trainer) return null;

  return (
    <section className="container-page pb-20 md:pb-28">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h2-display"
      >
        The <span className="text-brand-mid">Mentor</span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="glass mt-10 flex flex-col gap-8 rounded-3xl p-6 sm:flex-row sm:items-center sm:gap-10 sm:p-10"
      >
        <ImageWithFallback
          src={trainer.photoUrl}
          gradient="from-brand-mid/25 via-surface to-brand-start/15"
          className="aspect-[4/5] w-full shrink-0 rounded-2xl border border-border sm:w-64 md:w-72"
        />
        <div>
          <h3 className="font-display mt-3 text-4xl leading-[1.05] font-bold tracking-tight md:text-5xl">
            {trainer.name.split(" ").map((word, i) => (
              <span key={i} className="block">
                {word}
              </span>
            ))}
          </h3>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {trainer.bio}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
