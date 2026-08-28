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
        className="glass mt-10 flex flex-col gap-6 rounded-3xl p-8 sm:flex-row sm:items-center sm:p-10"
      >
        <ImageWithFallback
          src={trainer.photoUrl}
          gradient="from-brand-mid/25 via-surface to-brand-start/15"
          className="aspect-square w-24 shrink-0 rounded-2xl border border-border sm:w-32"
        />
        <div>
          <h3 className="h3-display">{trainer.name}</h3>
          <p className="mt-3 max-w-xl text-muted-foreground">{trainer.bio}</p>
          <Link
            href="/about#trainers"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-foreground transition-colors hover:text-brand-mid"
          >
            Meet the entire team
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
