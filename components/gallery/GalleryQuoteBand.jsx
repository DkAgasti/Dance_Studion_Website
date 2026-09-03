"use client";

import { motion } from "framer-motion";
import ImageWithFallback from "@/components/media/ImageWithFallback";

// Gallery page closing band — a full-bleed background photo with an
// inspirational quote on the left and a short "About ASM" blurb on the
// right, styled after the reference's "Sekilas Tentang Kami" band.
export default function GalleryQuoteBand() {
  return (
    <section className="relative overflow-hidden border-y border-border">
      {/* 👈 yahan apna background image URL daalo */}
      <ImageWithFallback
        src="https://res.cloudinary.com/fexwwils/image/upload/v1787989141/Free_Campus_Feelings_Classmate_Background_Images_Campus_Feelings_Psd_Hd_Background_Photo_Background_PNG_and_Vectors.jpg"
        alt="Behind the scenes at ASM"
        gradient="from-brand-mid/15 via-surface to-brand-end/10"
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-background/85" />

      <div className="container-page section-y relative grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-16">
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "120px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="font-[family-name:var(--font-playfair)] text-3xl leading-snug font-bold text-balance md:text-4xl"
        >
          &ldquo;Great art isn&apos;t just performed; it&apos;s the art you
          truly love to create.&rdquo;
          <footer className="mt-6 text-sm font-normal text-muted-foreground normal-case">
            — Team ASM
          </footer>
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "120px" }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
          <p className="eyebrow text-brand-end">About ASM</p>
          <div className="mt-4 flex flex-col gap-4 text-muted-foreground">
            <p>
              A studio built around movement and community, ASM has spent
              years training dancers of every level and staging performances
              that bring Bhubaneswar together.
            </p>
            <p>
              Every photo in this gallery comes straight from the floor —
              rehearsals, showcases, and the everyday moments that make ASM
              feel like home.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
