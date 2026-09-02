"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Star, ChevronLeft, ChevronRight, Loader2, Trophy, FileBadge, BadgeCheck } from "lucide-react";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import StudioLogo from "@/components/shared/StudioLogo";

const ACHIEVEMENTS = [
  "Best Dance Academy 2024",
  "Excellence in Fitness 2023",
  "Community Choice Award",
];

const ACHIEVEMENT_ICONS = [Trophy, FileBadge, BadgeCheck];

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

// Google's public "write a review" link comes back as
// search.google.com/local/writereview?placeid=X — swap the path to get the
// place's full reviews list instead (same placeid).
function allReviewsUrl(profileUrl) {
  if (!profileUrl) return null;
  try {
    const placeId = new URL(profileUrl).searchParams.get("placeid");
    return placeId ? `https://search.google.com/local/reviews?placeid=${placeId}` : profileUrl;
  } catch {
    return profileUrl;
  }
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
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [autoPaused, setAutoPaused] = useState(false);
  const activePageRef = useRef(0);
  const pageCountRef = useRef(1);

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

  // A "page" is however many cards fit in the visible track at once — prev/
  // next and the dots move by a whole page, so the last dot always lines up
  // with the actual scroll limit (no dead clicks near the end).
  function getMetrics() {
    const el = scrollerRef.current;
    if (!el || !el.firstElementChild) return null;
    const cardWidth = el.firstElementChild.getBoundingClientRect().width;
    const step = cardWidth + 16;
    const perPage = Math.max(1, Math.round(el.clientWidth / step));
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const pages = Math.max(1, Math.ceil(reviews.length / perPage));
    return { step, perPage, maxScroll, pages };
  }

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    function sync() {
      const m = getMetrics();
      if (!m) return;
      setPageCount(m.pages);
      // Map scroll position proportionally onto the dots (rather than
      // page * perPage * step) so the last dot always lines up exactly
      // with maxScroll even when reviews.length isn't a clean multiple
      // of perPage — otherwise "next" can stall a dot early.
      const progress = m.maxScroll > 0 ? el.scrollLeft / m.maxScroll : 0;
      const raw = Math.round(progress * (m.pages - 1));
      setActivePage(Math.min(Math.max(raw, 0), m.pages - 1));
    }

    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [reviews.length]);

  function scrollToPage(page) {
    const el = scrollerRef.current;
    const m = getMetrics();
    if (!el || !m) return;
    const target = m.pages > 1 ? (page / (m.pages - 1)) * m.maxScroll : 0;
    el.scrollTo({ left: Math.min(Math.max(target, 0), m.maxScroll), behavior: "smooth" });
  }

  function scrollByPage(dir) {
    scrollToPage(Math.min(Math.max(activePage + dir, 0), pageCount - 1));
  }

  useEffect(() => {
    activePageRef.current = activePage;
  }, [activePage]);

  useEffect(() => {
    pageCountRef.current = pageCount;
  }, [pageCount]);

  // Auto-advance one page every few seconds, looping back to the start —
  // paused while the user is hovering/interacting with the carousel.
  useEffect(() => {
    if (!reviews.length || autoPaused) return;
    const id = setInterval(() => {
      const next =
        activePageRef.current >= pageCountRef.current - 1 ? 0 : activePageRef.current + 1;
      scrollToPage(next);
    }, 4000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews.length, autoPaused]);

  return (
    <section className="container-page pb-8 md:pb-28">
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading reviews...
        </div>
      ) : reviews.length ? (
        <div className="glass flex flex-col gap-8 rounded-3xl p-6 md:flex-row md:items-center md:p-8">
          <div className="flex flex-col items-center gap-3 text-center md:w-56 md:shrink-0 md:items-start md:border-r md:border-border md:pr-8 md:text-left">
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-mid/25 via-surface to-brand-start/15">
                <StudioLogo
                  className="font-display text-xs font-bold text-gradient-brand"
                  imgClassName="size-full object-cover"
                />
              </div>
              <p className="font-display font-bold">ASM Dance Studio</p>
            </div>
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <span className="text-2xl font-bold text-brand-lime">
                {data.averageRating?.toFixed(1)}
              </span>
              <Stars rating={5} />
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {data.totalReviewCount} reviews
            </p>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground md:justify-start">
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

          <div
            className="relative min-w-0 flex-1"
            onMouseEnter={() => setAutoPaused(true)}
            onMouseLeave={() => setAutoPaused(false)}
          >
            <button
              type="button"
              aria-label="Previous review"
              onClick={() => scrollByPage(-1)}
              disabled={activePage === 0}
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
              onClick={() => scrollByPage(1)}
              disabled={activePage >= pageCount - 1}
              className="glass-strong absolute top-1/2 -right-3 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full disabled:opacity-30 md:-right-4"
            >
              <ChevronRight className="size-4" />
            </button>

            <div className="mt-4 flex items-center justify-center gap-2">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to page ${i + 1}`}
                  onClick={() => scrollToPage(i)}
                  className={
                    "size-1.5 rounded-full transition-colors " +
                    (i === activePage ? "bg-brand-lime" : "bg-border")
                  }
                />
              ))}
            </div>

            {data.totalReviewCount > reviews.length ? (
              <a
                href={allReviewsUrl(data.profileUrl) ?? "#"}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 block text-center text-xs font-medium text-brand-end hover:underline"
              >
                See all {data.totalReviewCount} reviews on Google
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="mt-16 hidden flex-wrap items-center justify-center gap-x-12 gap-y-6 md:flex"
      >
        {ACHIEVEMENTS.map((label) => (
          <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="size-6 text-brand-lime" strokeWidth={1.5} />
            {label}
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="mt-10 flex items-center justify-center gap-x-14 md:hidden"
      >
        {ACHIEVEMENT_ICONS.map((Icon, i) => (
          <Icon key={i} className="size-9 text-muted-foreground/60" strokeWidth={1.5} />
        ))}
      </motion.div>
    </section>
  );
}
