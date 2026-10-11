"use client";

import { motion } from "framer-motion";
import ImageWithFallback from "@/components/media/ImageWithFallback";

// "Trishna — The Visionary" founder spotlight — portrait, story, and quote.
export default function FounderSpotlight() {
  return (
    <section className="container-page section-y overflow-x-hidden">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "120px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <p className="eyebrow">The Founder</p>
          <h2 className="h1-display mt-4 text-balance">
            TRISHNA
            <br />
            <span className="text-outline">THE</span>
            <br />
            <span className="text-outline">VISIONARY</span>
          </h2>
          <div className="mt-8 flex flex-col gap-4 text-lg text-muted-foreground">
            <p>
              With over 15 years of experience in various dance forms and
              choreography, Trishna founded ASM with a singular vision: to
              create a space where artistic expression knows no bounds.
            </p>
            <p>
              She has choreographed for national television, worked with
              celebrity artists, and mentored hundreds of students who are
              now successful performers themselves.
            </p>
          </div>
          <blockquote className="glass font-display mt-10 rounded-3xl border-l-4 border-l-gold p-10 text-xl leading-snug text-foreground/90 md:text-2xl">
            &ldquo;Dance isn&apos;t just about the steps; it&apos;s about
            the soul finding its voice through the rhythm of the
            universe.&rdquo;
          </blockquote>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "120px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-md"
        >
          <div
            aria-hidden
            className="bg-gradient-brand absolute -inset-10 rounded-full opacity-20 blur-[100px]"
          />
          <ImageWithFallback
            src="https://res.cloudinary.com/fexwwils/image/upload/v1787894856/trishma.jpg" // 👈 yahan apna image URL daalo
            alt="Trishna, founder of ASM"
            gradient="from-brand-mid/25 via-surface to-brand-start/20"
            className="relative aspect-[504/630] w-full rounded-3xl border border-border shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
