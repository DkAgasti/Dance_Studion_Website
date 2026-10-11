"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ImageWithFallback from "@/components/media/ImageWithFallback";

// Paste an image URL here to show it in the card — leave null to keep the
// current gradient placeholder.
const IMAGE_URL = "https://res.cloudinary.com/fexwwils/image/upload/v1787894856/trishma.jpg";

export default function Founder() {
  return (
    <section className="container-page section-y">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass-strong grid grid-cols-1 gap-10 rounded-3xl p-6 sm:p-10 md:grid-cols-[minmax(0,340px)_1fr] md:items-center md:rounded-4xl md:p-16"
      >
        <ImageWithFallback
          src={IMAGE_URL}
          gradient="from-brand-mid/30 via-surface to-brand-start/20"
          className="aspect-[309/386] w-full max-w-sm rounded-2xl border border-border md:mx-0"
        />

        <div>
          <p className="eyebrow">Meet the Visionary</p>
          <h2 className="h2-display mt-4">Trishna</h2>
          <blockquote className="font-display mt-6 max-w-xl text-2xl leading-snug text-foreground/90 md:text-3xl">
            &ldquo;Dance isn&apos;t just about the steps; it&apos;s about the
            soul finding its voice through the rhythm of the universe.&rdquo;
          </blockquote>
          <Link
            href="/about#trainers"
            className="mt-8 inline-flex items-center gap-2 font-medium text-foreground transition-colors hover:text-brand-end"
          >
            Meet the entire team
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
