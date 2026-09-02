"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import BookingLink from "@/components/shared/BookingLink";
import { cldOptimize } from "@/lib/utils";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const HERO_SUBTEXT =
  "Classical to freestyle. Kids to pros. Bhubaneswar's home of dance & fitness.";
const HERO_IMAGE_URL ="https://res.cloudinary.com/fexwwils/image/upload/v1787773374/home_dance.png";
// 👈 yahan apna smoke video URL daalo
const HERO_SMOKE_VIDEO_URL = "https://res.cloudinary.com/fexwwils/video/upload/v1788000662/From_Klickpin.com-_Earthy_flower_field_vibes_that_feel_fresh_and_shareable_on_a_budget_to_refresh_your_mood-pin-id-624100460884464450.mp4";
const HERO_MOBILE_VIDEO_URL = "https://res.cloudinary.com/fexwwils/video/upload/v1788200626/hero_dance.mp4";

const HEADING_CLASS = "font-display font-bold uppercase leading-[1.05] tracking-tight text-5xl md:text-7xl";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-[calc(var(--header-h,88px)+72px)] pb-4 md:pt-52 md:pb-32 lg:pt-36 lg:pb-16">
      <div className="pointer-events-none absolute inset-0 -z-20" aria-hidden>
        <div className="absolute top-0 left-1/2 h-[520px] w-[1200px] -translate-x-1/2 rounded-full bg-gradient-brand opacity-[0.15] blur-[120px]" />
        <div className="absolute -right-40 top-24 h-[500px] w-[500px] rounded-full bg-brand-mid opacity-[0.18] blur-[110px]" />
      </div>

      <video
        src={HERO_SMOKE_VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden size-full object-cover opacity-30 mix-blend-screen lg:block"
      />

      <video
        src={HERO_MOBILE_VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 block size-full object-cover lg:hidden"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 block bg-black/60 lg:hidden"
        aria-hidden="true"
      />

      <div className="container-page relative grid grid-cols-1 items-center gap-12 lg:max-w-[1360px] lg:grid-cols-[1fr_1fr] lg:items-stretch lg:gap-0">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 order-2 flex flex-col justify-center lg:order-none lg:w-[clamp(720px,51vw,960px)] lg:max-w-none"
        >
          <motion.h1 variants={item} className={HEADING_CLASS}>
            WHERE EVERY
            <br />
            <span className="text-outline">RHYTHM</span> FINDS
            <br />
            <span className="text-gradient-brand">A HOME</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-xl text-xl leading-relaxed text-muted-foreground md:text-2xl lg:mt-6"
          >
            {HERO_SUBTEXT}
          </motion.p>

          <motion.div variants={item} className="mt-12 flex flex-nowrap gap-3 lg:mt-8 lg:gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-brand h-14 flex-1 whitespace-nowrap rounded-full px-4 text-sm font-bold text-white shadow-xl hover:brightness-110 sm:h-[62px] sm:flex-none sm:px-10 sm:text-base"
            >
              <BookingLink href="/book-trial">Book a Free Trial</BookingLink>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 flex-1 whitespace-nowrap rounded-full border-white/20 bg-transparent px-4 text-sm font-bold backdrop-blur-sm hover:bg-white/10 sm:h-[62px] sm:flex-none sm:px-10 sm:text-base"
            >
              <Link href="/classes">Explore Classes</Link>
            </Button>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-muted-foreground lg:mt-10"
          >
            <span className="flex items-center gap-2">
              <span className="font-semibold text-foreground">⭐ 4.9</span>
              117 Google reviews
            </span>
            <span className="hidden size-1 rounded-full bg-border sm:block" />
            <span className="flex items-center gap-2">
              <span className="font-semibold text-foreground">8+</span>
              Dance styles
            </span>
            <span className="hidden size-1 rounded-full bg-border sm:block" />
            <span>All ages</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative order-1 hidden translate-y-4 items-center justify-center lg:absolute lg:inset-y-0 lg:right-0 lg:order-none lg:flex"
        >
          <img
            src={cldOptimize(HERO_IMAGE_URL)}
            alt=""
            fetchPriority="high"
            className="h-auto max-h-[46vh] w-auto max-w-full object-contain lg:h-[110%] lg:w-auto lg:max-w-none lg:max-h-none lg:translate-x-[13.5%] lg:translate-y-4 lg:object-contain lg:object-bottom"
          />
        </motion.div>
      </div>
    </section>
  );
}
