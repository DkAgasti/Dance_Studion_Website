"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import Link from "next/link";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { siteConfig } from "@/config/site";

// Gallery page hero — full-bleed atmospheric banner, styled after the
// "Capture The Moments" reference: serif heading top-left, contact line and
// two CTAs anchored to the bottom.
export default function GalleryHero() {
  return (
    <section className="relative flex h-[70vh] min-h-[560px] w-full flex-col justify-between overflow-hidden">
      {/* 👈 yahan apna background image/video URL daalo */}
      <ImageWithFallback
        src="https://res.cloudinary.com/fexwwils/image/upload/v1787990484/ChatGPT_Image_Aug_29_2026_01_30_38_PM.png"
        alt="ASM dance studio in motion"
        gradient="from-brand-mid/20 via-surface to-brand-end/25"
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/40" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container-page relative pt-20 md:pt-28"
      >
        <h1 className="font-[family-name:var(--font-playfair)] text-5xl leading-[1.05] font-bold text-balance md:text-7xl">
          Capture
          <br />
          <span className="text-gradient-brand">The Moments</span>
        </h1>
        <p className="eyebrow mt-4">With Our Team | ASM Dance Studio</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        className="container-page relative flex flex-col gap-6 pb-10 sm:flex-row sm:items-center sm:justify-between"
      >
        <a
          href={`tel:${siteConfig.phone}`}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Phone className="size-4" />
          Call Center: {siteConfig.phone}
        </a>

        <div className="flex items-center gap-3">
          <Link
            href="/book-trial"
            className="rounded-full bg-brand-lime px-6 py-2.5 text-sm font-bold text-background transition-transform hover:scale-105"
          >
            Book a Class
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-border px-6 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-white/5"
          >
            Contact Us
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
