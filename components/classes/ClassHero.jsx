"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { Button } from "@/components/ui/button";

// Detail-page hero — sticky so the content below scrolls up and over it.
export default function ClassHero({ classItem }) {
  return (
    <section className="sticky top-0 z-0 h-[85vh] min-h-[560px] w-full overflow-hidden">
      <ImageWithFallback
        src={classItem.imageUrl}
        gradient="from-surface via-surface to-background"
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10" />

      <p
        aria-hidden
        className="font-display pointer-events-none absolute -right-4 -bottom-6 leading-none font-black tracking-tight text-white/[0.05] uppercase select-none"
        style={{ fontSize: "clamp(4rem, 16vw, 13rem)" }}
      >
        {classItem.name}
      </p>

      <div className="container-page relative flex h-full flex-col justify-end pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex flex-wrap gap-3 text-[11px] font-bold tracking-wide uppercase">
            <span className="glass rounded-full px-3 py-1.5 text-brand-lime">
              {classItem.level}
            </span>
            <span className="glass rounded-full px-3 py-1.5 text-white/80">
              {classItem.ageGroup}
            </span>
          </div>

          <h1 className="h1-display mt-6 text-balance">{classItem.name}</h1>
          {classItem.description ? (
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              {classItem.description}
            </p>
          ) : null}

          <Button
            asChild
            size="lg"
            className="bg-gradient-brand mt-8 h-[56px] rounded-full px-9 text-base font-bold text-white shadow-xl hover:brightness-110"
          >
            <Link href="/book-trial">Book Free Trial</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
