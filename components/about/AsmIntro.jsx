"use client";

import { motion } from "framer-motion";
import ImageWithFallback from "@/components/media/ImageWithFallback";

// ASM intro block — "who we are" statement plus Mission / Cares cards.
export default function AsmIntro() {
  return (
    <section className="container-page section-y">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-6"
      >
        <span className="h-px flex-1 bg-border" />
        <p className="eyebrow shrink-0">Who We Are</p>
        <span className="h-px flex-1 bg-border" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="h2-display mx-auto mt-12 max-w-4xl text-center text-balance"
      >
        ASM (Achieve Show Makers) is more than a studio—it&apos;s a{" "}
        <span className="text-brand-lime">movement</span> dedicated to
        empowering dancers of all levels while{" "}
        <span className="text-brand-mid">giving back</span> to our
        community.
      </motion.p>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="glass rounded-3xl p-10"
          >
            <h3 className="h4-display text-brand-end">Our Mission</h3>
            <p className="mt-4 text-muted-foreground">
              To nurture raw talent, provide world-class training, and use
              the power of dance to create positive social impact. We
              believe every soul has a rhythm that deserves to be heard.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="glass rounded-3xl p-10"
          >
            <h3 className="h4-display text-brand-start">ASM Cares</h3>
            <p className="mt-4 text-muted-foreground">
              We are deeply committed to social responsibility. A portion
              of our proceeds supports free dance workshops and education
              for underprivileged kids in Bhubaneswar.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative min-h-[320px] md:min-h-full"
        >
          <ImageWithFallback
            src="https://res.cloudinary.com/fexwwils/image/upload/v1787894857/ASM-DANCE-STUDIO-REEL-11-1.jpg"
            alt="ASM giving back to community"
            gradient="from-brand-lime/20 via-surface to-brand-mid/20"
            className="absolute inset-0 rounded-3xl border border-border"
          />
          <div className="absolute -right-4 -bottom-4 flex size-28 flex-col items-center justify-center rounded-full bg-brand-lime text-center shadow-2xl sm:size-32">
            <p className="text-xs font-black tracking-wide text-background uppercase">
              Giving Back
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
