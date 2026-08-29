"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Play, Loader2 } from "lucide-react";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import SectionHeading from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";

// How many neighbors are shown peeking out on each side of the focused
// image, before the overlap fades them out entirely.
const SIDE_SLOTS = 2;

function CategoryPills({ categories, active, onChange }) {
  return (
    <div className="mt-8 flex snap-x gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center sm:overflow-visible">
      {categories.map((category) => {
        const isActive = category === active;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            aria-pressed={isActive}
            className={cn(
              "shrink-0 snap-start rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
              isActive
                ? "border-brand-lime bg-brand-lime text-background"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

function CarouselSlide({ photo, offset }) {
  const distance = Math.abs(offset);
  const isCenter = offset === 0;

  return (
    <motion.div
      initial={false}
      animate={{
        x: `${offset * 62}%`,
        scale: isCenter ? 1 : 1 - distance * 0.12,
        opacity: distance > SIDE_SLOTS ? 0 : 1 - distance * 0.28,
        zIndex: SIDE_SLOTS + 1 - distance,
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        isCenter ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      <div
        className={cn(
          "group relative overflow-hidden rounded-3xl border border-border shadow-2xl",
          isCenter
            ? "aspect-[3/4] w-[280px] sm:w-[340px] md:w-[400px]"
            : "aspect-[3/4] w-[220px] sm:w-[260px] md:w-[300px]"
        )}
      >
        <ImageWithFallback
          src={photo.url}
          alt={photo.caption || photo.category || "Studio gallery photo"}
          gradient="from-brand-mid/20 via-surface to-brand-end/15"
          className="absolute inset-0"
        />
        {!isCenter ? <div className="absolute inset-0 bg-background/40" /> : null}
        {photo.videoSource ? (
          <span className="glass-strong absolute right-4 bottom-4 flex size-10 items-center justify-center rounded-full">
            <Play className="ml-0.5 size-4 fill-white text-white" />
          </span>
        ) : null}
      </div>
    </motion.div>
  );
}

// "My Visual Diary" — overlapping-carousel photo gallery. Photos come from
// GET /api/media?type=PHOTO (managed in Admin > Content > Photos); category
// pills are derived from each photo's `category` field.
export default function PhotoCarouselGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/media?type=PHOTO")
      .then((res) => (res.ok ? res.json() : { media: [] }))
      .then((body) => {
        if (!cancelled) setPhotos(body.media ?? []);
      })
      .catch(() => {
        // network/DB hiccup — leave photos empty rather than crash
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(photos.map((p) => p.category).filter(Boolean)));
    return ["All", ...unique];
  }, [photos]);

  const filtered = useMemo(
    () =>
      activeCategory === "All" ? photos : photos.filter((p) => p.category === activeCategory),
    [photos, activeCategory]
  );

  function selectCategory(category) {
    setActiveCategory(category);
    setIndex(0);
  }

  function goPrev() {
    setIndex((i) => (i - 1 + filtered.length) % filtered.length);
  }
  function goNext() {
    setIndex((i) => (i + 1) % filtered.length);
  }

  if (!loading && !photos.length) return null;

  return (
    <section className="container-page section-y">
      <SectionHeading
        eyebrow="Gallery"
        align="center"
        title="My Visual"
        gradientWord="Diary"
        subtitle="See the world through my lens: adventures in photos and videos"
        className="mx-auto"
      />

      {loading ? (
        <div className="mt-14 flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading gallery...
        </div>
      ) : (
        <>
          {categories.length > 1 ? (
            <CategoryPills
              categories={categories}
              active={activeCategory}
              onChange={selectCategory}
            />
          ) : null}

          <div className="relative mt-14 flex h-[380px] items-center justify-center overflow-hidden sm:h-[440px] md:h-[500px]">
            <AnimatePresence initial={false}>
              {filtered.map((photo, i) => {
                let offset = i - index;
                const half = Math.floor(filtered.length / 2);
                if (offset > half) offset -= filtered.length;
                if (offset < -half) offset += filtered.length;
                if (Math.abs(offset) > SIDE_SLOTS) return null;
                return <CarouselSlide key={photo.id} photo={photo} offset={offset} />;
              })}
            </AnimatePresence>
          </div>

          {filtered.length > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous photo"
                className="glass flex size-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-white/10"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next photo"
                className="glass flex size-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-white/10"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
