"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import SectionHeading from "@/components/shared/SectionHeading";

const GRADIENTS = [
  "from-brand-start/25 via-surface to-brand-mid/20",
  "from-[#1c1140] via-surface to-[#3a1f6b]",
  "from-[#0f2a3a] via-surface to-[#1d7a8c]",
  "from-brand-lime/25 via-surface to-brand-end/15",
];

function TrainerCard({ trainer, gradient, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="group relative aspect-[325/434] overflow-hidden rounded-2xl border border-border"
    >
      <ImageWithFallback src={trainer.photoUrl} gradient={gradient} className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6 motion-safe:transition-opacity motion-safe:duration-300 group-hover:opacity-0">
        <span className="glass inline-flex rounded-full px-3 py-1 text-[11px] font-bold tracking-wide text-foreground/80 uppercase">
          {trainer.specialty}
        </span>
        <h3 className="h3-display mt-4">{trainer.name}</h3>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center opacity-0 motion-safe:transition-opacity motion-safe:duration-300 group-hover:opacity-100">
        <h3 className="h4-display">{trainer.name}</h3>
        <p className="text-sm leading-relaxed text-foreground/90">{trainer.bio}</p>
      </div>
    </motion.div>
  );
}

// "Meet the Masters" — trainer cards with a hover-reveal bio. Trainers come
// from GET /api/trainers (managed in Admin > Content > Trainers).
export default function MeetTheMasters() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/trainers")
      .then((res) => (res.ok ? res.json() : { trainers: [] }))
      .then((body) => {
        if (!cancelled) setTrainers(body.trainers ?? []);
      })
      .catch(() => {
        // network/DB hiccup — leave trainers empty rather than crash
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && !trainers.length) return null;

  return (
    <section id="trainers" className="container-page section-y scroll-mt-28">
      <SectionHeading
        align="center"
        title="Meet the"
        gradientWord="Masters"
        subtitle="The passionate mentors behind every ASM performance."
        className="mx-auto"
      />
      {loading ? (
        <div className="mt-16 flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading trainers...
        </div>
      ) : (
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trainers.map((trainer, i) => (
            <TrainerCard
              key={trainer.id}
              trainer={trainer}
              gradient={GRADIENTS[i % GRADIENTS.length]}
              index={i}
            />
          ))}
        </div>
      )}
    </section>
  );
}
