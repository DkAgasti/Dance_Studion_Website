"use client";

import { motion } from "framer-motion";
import { PartyPopper, Flower, Swords, Building2 } from "lucide-react";
import { fitnessClasses } from "@/config/classes";

const ICONS = {
  "party-popper": PartyPopper,
  flower: Flower,
  swords: Swords,
  "building-2": Building2,
};

// Hex values mirror the CSS custom properties in globals.css — kept literal
// here (rather than built from Tailwind class strings) so per-tile accent
// colors survive Tailwind's static class scan.
const ACCENT_HEX = {
  "brand-start": "#ff2d55",
  "brand-mid": "#7c5cff",
  "brand-end": "#22d3ee",
  "brand-lime": "#c6ff3a",
};

function FitnessTile({ item, index }) {
  const Icon = ICONS[item.iconName];
  const hex = ACCENT_HEX[item.accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      style={{ borderTopColor: hex }}
      className="glass-tile flex flex-col gap-4 rounded-xl border-t-2 p-6 transition-transform hover:-translate-y-1"
    >
      <div
        style={{ backgroundColor: `${hex}33`, color: hex }}
        className="flex size-12 items-center justify-center rounded-full"
      >
        {Icon ? <Icon className="size-5" /> : null}
      </div>
      <h4 className="h4-display">{item.name}</h4>
      <p className="text-sm text-muted-foreground">{item.description}</p>
    </motion.div>
  );
}

// "Elite Fitness" block — fitness programs offered alongside dance classes.
export default function EliteFitness() {
  return (
    <section id="fitness" className="container-page pb-20 md:pb-28">
      <div className="glass rounded-3xl px-6 py-14 sm:px-10 md:rounded-4xl md:px-16 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="glass mx-auto mb-6 inline-flex w-fit rounded-full px-4 py-1.5 text-xs font-bold tracking-wide text-brand-end uppercase">
            Beyond Dance
          </span>
          <h2 className="h2-display text-balance">
            Elite <span className="text-brand-end">Fitness</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Sculpt, stretch, and strengthen. Our fitness programs are
            designed for peak performance.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {fitnessClasses.map((item, i) => (
            <FitnessTile key={item.slug} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
