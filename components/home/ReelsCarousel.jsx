"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Loader2 } from "lucide-react";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import SectionHeading from "@/components/shared/SectionHeading";

const GRADIENTS = [
  "from-[#1c1140] via-[#3a1f6b] to-[#6d3bd1]",
  "from-[#5b2a1f] via-[#7a3520] to-[#c9862c]",
  "from-[#0f2a3a] via-[#144a5c] to-[#1d7a8c]",
  "from-[#3a0f1f] via-[#6b1530] to-[#b0203f]",
];

function ReelTile({ reel, gradient, className }) {
  return (
    <div
      className={
        "group relative aspect-[9/16] w-[240px] shrink-0 overflow-hidden rounded-2xl border border-border " +
        (className ?? "")
      }
    >
      <ImageWithFallback src={reel.imageUrl} className="absolute inset-0" gradient={gradient} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <a
        href={reel.url ?? "#"}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Play ${reel.caption ?? "reel"}`}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="glass-strong flex size-14 items-center justify-center rounded-full transition-transform group-hover:scale-110">
          <Play className="ml-0.5 size-6 fill-white text-white" />
        </span>
      </a>
      <p className="pointer-events-none absolute inset-x-4 bottom-4 text-sm font-medium text-white/90">
        {reel.caption}
      </p>
    </div>
  );
}

// Home page carousel of Instagram/YouTube reels — student performance
// highlights. Reels come from GET /api/media?type=REEL (managed in
// Admin > Content > Reels).
export default function ReelsCarousel() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/media?type=REEL")
      .then((res) => (res.ok ? res.json() : { media: [] }))
      .then((body) => {
        if (!cancelled) setReels((body.media ?? []).filter((r) => r.featured));
      })
      .catch(() => {
        // network/DB hiccup — leave reels empty rather than crash
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && !reels.length) return null;

  return (
    <section className="container-page section-y">
      <SectionHeading
        align="center"
        title="Student"
        gradientWord="Performance"
        className="mx-auto"
      />

      {loading ? (
        <div className="mt-14 flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading reels...
        </div>
      ) : reels.length > 4 ? (
        <div className="mt-14 overflow-hidden">
          <motion.div
            className="flex w-max gap-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: reels.length * 4, repeat: Infinity, ease: "linear" }}
          >
            {[...reels, ...reels].map((reel, i) => (
              <ReelTile
                key={`${reel.id}-${i}`}
                reel={reel}
                gradient={GRADIENTS[i % GRADIENTS.length]}
              />
            ))}
          </motion.div>
        </div>
      ) : (
        <div className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
          {reels.map((reel, i) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "90px" }}
              transition={{ duration: 0.35, delay: i * 0.08, ease: "easeOut" }}
              className="snap-start"
            >
              <ReelTile
                reel={reel}
                gradient={GRADIENTS[i % GRADIENTS.length]}
                className="sm:w-auto"
              />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
