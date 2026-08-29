"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Star, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import ImageWithFallback from "@/components/media/ImageWithFallback";

const ACHIEVEMENTS = [
  "Best Dance Academy 2024",
  "Excellence in Fitness 2023",
  "Community Choice Award",
];

const MAX_REVIEWS = 10;

function GoogleIcon({ className }) {
  return (
    <svg viewBox="0 0 18 18" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

function Stars({ rating, className }) {
  return (
    <div className={"flex gap-0.5 text-brand-lime " + (className ?? "")}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-4" strokeWidth={0} fill="currentColor" opacity={i < rating ? 1 : 0.2} />
      ))}
    </div>
  );
}

// "2 months ago" / "3 years ago" from an ISO timestamp.
function timeAgo(isoString) {
  if (!isoString) return "";
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays < 1) return "Today";
  if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} year${diffYears === 1 ? "" : "s"} ago`;
}

function GoogleReviewCard({ review }) {
  return (
    <div className="glass w-[280px] shrink-0 snap-start rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ImageWithFallback
            src={review.avatarUrl}
            gradient="from-brand-mid/25 via-surface to-brand-start/15"
            className="size-11 shrink-0 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold text-brand-end">{review.name}</p>
            <p className="text-xs text-muted-foreground">{timeAgo(review.createTime)}</p>
          </div>
        </div>
        <GoogleIcon className="size-5 shrink-0" />
      </div>
      <Stars rating={review.rating} className="mt-3" />
      <p className="mt-3 max-h-24 overflow-y-auto text-sm text-foreground/90">{review.text}</p>
    </div>
  );
}

// Live Google reviews widget — fetches real, auto-updating reviews via
// GET /api/google-reviews (a server-side proxy for the studio's Featurable
// widget, since Featurable's API has no CORS for direct browser calls).
// No admin panel or hardcoded review text involved.
export default function Reviews() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/google-reviews")
      .then((res) => res.json())
      .then((body) => {
        if (!cancelled) setData(body);
      })
      .catch(() => {
        // network hiccup — leave data null, widget just won't render
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const reviews = (data?.reviews ?? []).slice(0, MAX_REVIEWS);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    function onScroll() {
      const cardWidth = el.firstElementChild?.getBoundingClientRect().width ?? 1;
      setActiveIndex(Math.round(el.scrollLeft / (cardWidth + 16)));
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [reviews.length]);

  function scrollToIndex(i) {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.getBoundingClientRect().width ?? 0;
    el.scrollTo({ left: i * (cardWidth + 16), behavior: "smooth" });
  }

  function scrollBy(dir) {
    scrollToIndex(Math.min(Math.max(activeIndex + dir, 0), reviews.length - 1));
  }

  return (
    <section className="container-page pb-20 md:pb-28">
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading reviews...
        </div>
      ) : reviews.length ? (
        <div className="glass flex flex-col gap-8 rounded-3xl p-6 md:flex-row md:items-center md:p-8">
          <div className="flex flex-col gap-3 md:w-56 md:shrink-0 md:border-r md:border-border md:pr-8">
            <div className="flex items-center gap-3">
              <ImageWithFallback
                gradient="from-brand-mid/25 via-surface to-brand-start/15"
                className="size-12 shrink-0 rounded-full"
              />
              <p className="font-display font-bold">ASM Dance Studio</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-brand-lime">
                {data.averageRating?.toFixed(1)}
              </span>
              <Stars rating={5} />
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {data.totalReviewCount} reviews
            </p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              powered by <GoogleIcon className="size-3.5" />
              <span className="font-medium text-foreground/80">Google</span>
            </p>
            <a
              href={data.profileUrl ?? "#"}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-[#4285F4] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#4285F4]/90"
            >
              Review us on
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white p-0.5">
                <GoogleIcon className="size-full" />
              </span>
            </a>
          </div>

          <div className="relative min-w-0 flex-1">
            <button
              type="button"
              aria-label="Previous review"
              onClick={() => scrollBy(-1)}
              disabled={activeIndex === 0}
              className="glass-strong absolute top-1/2 -left-3 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full disabled:opacity-30 md:-left-4"
            >
              <ChevronLeft className="size-4" />
            </button>

            <div
              ref={scrollerRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 py-1 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              {reviews.map((review) => (
                <GoogleReviewCard key={review.id} review={review} />
              ))}
            </div>

            <button
              type="button"
              aria-label="Next review"
              onClick={() => scrollBy(1)}
              disabled={activeIndex >= reviews.length - 1}
              className="glass-strong absolute top-1/2 -right-3 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full disabled:opacity-30 md:-right-4"
            >
              <ChevronRight className="size-4" />
            </button>

            <div className="mt-4 flex items-center justify-center gap-2">
              {reviews.map((review, i) => (
                <button
                  key={review.id}
                  type="button"
                  aria-label={`Go to review ${i + 1}`}
                  onClick={() => scrollToIndex(i)}
                  className={
                    "size-1.5 rounded-full transition-colors " +
                    (i === activeIndex ? "bg-brand-lime" : "bg-border")
                  }
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-6"
      >
        {ACHIEVEMENTS.map((label) => (
          <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="size-6 text-brand-lime" strokeWidth={1.5} />
            {label}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
