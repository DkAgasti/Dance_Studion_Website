"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Music, Zap } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { cn } from "@/lib/utils";
import { danceStyles } from "@/config/classes";

const ICONS = { sparkles: Sparkles, music: Music, zap: Zap };

const GRID_POSITION = [
  "md:[grid-column:1/3] md:[grid-row:1/3]", // Classical — feature
  "md:[grid-column:3/4] md:[grid-row:1/2]", // Hip-Hop
  "md:[grid-column:4/5] md:[grid-row:1/2]", // Contemporary
  "md:[grid-column:3/5] md:[grid-row:2/3]", // Jazz — wide
  "md:[grid-column:1/2] md:[grid-row:3/4]", // Kids
  "md:[grid-column:2/3] md:[grid-row:3/4]", // Lyrical
  "md:[grid-column:3/4] md:[grid-row:3/4]", // Bollywood
  "md:[grid-column:4/5] md:[grid-row:3/4]", // Freestyle
];

const MOBILE_VISIBLE_COUNT = 3;

function StyleTile({ style, position, index }) {
  const Icon = style.iconName ? ICONS[style.iconName] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06, ease: "easeOut" }}
      className={cn(
        "h-64 md:h-auto",
        index >= MOBILE_VISIBLE_COUNT && "hidden md:block",
        position
      )}
    >
      {style.layout === "icon" && !style.imageUrl ? (
        <div className="glass-tile flex h-full flex-col items-center justify-center gap-3 rounded-xl p-6 text-center transition-colors hover:border-white/20">
          {Icon ? <Icon className="size-7 text-brand-mid" strokeWidth={1.5} /> : null}
          <h3 className="h4-display">{style.name}</h3>
        </div>
      ) : (
        <div className="group relative h-full overflow-hidden rounded-xl border border-border">
          <ImageWithFallback
            src={style.imageUrl}
            gradient={style.gradient}
            className="absolute inset-0"
            imgClassName="transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            {style.badge ? (
              <span className="glass mb-4 inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">
                {style.badge}
              </span>
            ) : null}
            <h3 className={style.layout === "feature" ? "h3-display text-white" : "h4-display text-white"}>
              {style.name}
            </h3>
            {style.description ? (
              <p className="mt-2 max-w-md text-sm text-white/70">
                {style.description}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function StyleGrid() {
  return (
    <section id="classes" className="container-page section-y">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          title="Find Your"
          gradientWord="Rhythm"
          stackGradientWord
          subtitle="From classical roots to modern beats, we have a stage for every dancer."
        />
        <Button
          asChild
          variant="outline"
          className="hidden h-[52px] w-fit gap-2 self-start rounded-full border-border px-6 font-bold md:inline-flex md:self-auto"
        >
          <Link href="/classes">
            View All Styles
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-14 flex flex-col gap-6 md:grid md:grid-cols-4 md:auto-rows-[250px] md:gap-6">
        {danceStyles.map((style, i) => (
          <StyleTile
            key={style.slug}
            style={style}
            position={GRID_POSITION[i]}
            index={i}
          />
        ))}
      </div>

      <Button
        asChild
        variant="outline"
        className="mt-6 h-[52px] w-full gap-2 rounded-full border-border px-6 font-bold md:hidden"
      >
        <Link href="/classes">
          View All Styles
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </section>
  );
}
