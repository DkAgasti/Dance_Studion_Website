"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { cn } from "@/lib/utils";

// How many milestones are revealed at a time as the timeline is scrolled —
// keeps a long history from dumping every entry on screen at once.
const PAGE_SIZE = 2;

const STYLES = [
  { color: "text-brand-start", dot: "bg-brand-start", gradient: "from-[#3a2a1f] via-surface to-[#7a5320]" },
  { color: "text-brand-mid", dot: "bg-brand-mid", gradient: "from-[#1c1140] via-surface to-[#3a1f6b]" },
  { color: "text-brand-lime", dot: "bg-brand-lime", gradient: "from-[#2a2a0f] via-surface to-[#5a5a1a]" },
];

function toEvent(m, i) {
  const style = STYLES[i % STYLES.length];
  return {
    year: m.category,
    title: m.caption,
    body: m.body,
    imageUrl: m.url,
    ...style,
  };
}

function Milestone({ event, index }) {
  const reversed = index % 2 === 1;

  return (
    <div className="relative">
      <span
        aria-hidden
        className={cn(
          "absolute top-1/2 left-1/2 hidden size-4 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_20px_currentColor] md:block",
          event.dot,
          event.color
        )}
      />
      <div
        className={cn(
          "flex flex-col gap-6 md:flex-row md:items-center md:gap-20",
          reversed && "md:flex-row-reverse"
        )}
      >
        <motion.div
          initial={{ opacity: 0, x: reversed ? 24 : -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(
            "flex-1 text-center",
            !reversed ? "md:text-right" : "md:text-left"
          )}
        >
          <p className={cn("font-display text-4xl font-black", event.color)}>
            {event.year}
          </p>
          <h3 className="h4-display mt-2 uppercase">{event.title}</h3>
          <p
            className={cn(
              "mt-3 text-muted-foreground",
              !reversed && "md:ml-auto md:max-w-md"
            )}
          >
            {event.body}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: reversed ? -24 : 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1"
        >
          <ImageWithFallback
            src={event.imageUrl}
            alt={event.title}
            gradient={event.gradient}
            className="aspect-video w-full rounded-xl border border-border"
          />
        </motion.div>
      </div>
    </div>
  );
}

// Invisible marker sitting just below the last revealed milestone — once it
// scrolls into view inside the timeline's own scroll container, the parent
// reveals the next page of events. Uses a raw IntersectionObserver (rather
// than framer's useInView) so it can watch the scrollable div as its root
// instead of the window.
function LoadMoreTrigger({ scrollRootRef, onReveal }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onReveal();
          observer.disconnect();
        }
      },
      { root: scrollRootRef.current, rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref} aria-hidden className="h-px w-full" />;
}

// "Milestones" — alternating timeline of ASM's history. Events come from
// GET /api/media?type=MILESTONE (managed in Admin > Content > Milestones).
// Revealed a page at a time as the user scrolls, so a long history doesn't
// dump dozens of entries on screen at once.
export default function Milestones() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const scrollRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/media?type=MILESTONE")
      .then((res) => (res.ok ? res.json() : { media: [] }))
      .then((body) => {
        if (!cancelled) setMilestones(body.media ?? []);
      })
      .catch(() => {
        // network/DB hiccup — leave milestones empty rather than crash
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && !milestones.length) return null;

  return (
    <section className="border-y border-border bg-white/[0.02]">
      <div className="container-page section-y">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h2-display text-center uppercase"
        >
          Milestones
        </motion.h2>

        {loading ? (
          <div className="mt-14 flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading milestones...
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="relative mt-20 max-h-[900px] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="relative flex flex-col gap-20">
              <span
                aria-hidden
                className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-border md:block"
              />
              {milestones.slice(0, visibleCount).map((m, i) => (
                <Milestone key={m.id} event={toEvent(m, i)} index={i} />
              ))}
              {visibleCount < milestones.length ? (
                <LoadMoreTrigger
                  scrollRootRef={scrollRef}
                  onReveal={() =>
                    setVisibleCount((c) => Math.min(c + PAGE_SIZE, milestones.length))
                  }
                />
              ) : null}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
