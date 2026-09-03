"use client";

import { motion } from "framer-motion";
import ImageWithFallback from "@/components/media/ImageWithFallback";

// Paste the hero background image URL here.
const HERO_IMAGE_URL = "https://res.cloudinary.com/fexwwils/image/upload/v1787986521/Love_to_Dance__Want_to_burn_some_major_calories_before_the_holidays__Give_this_a_go_CIZE_http___teambeachbody_com_shop_-_shopping_BCPCZ160_referringRepId_587772_dancefitness_healthyeating_portioncontrol_cleaneating_healthtips_chr.jpg";

// "Keep Dancing, Stay Fit" hero for the services/fitness page.
export default function FitnessHero() {
  return (
    <section className="relative flex h-[60vh] min-h-[440px] items-center overflow-hidden">
      <ImageWithFallback
        src={HERO_IMAGE_URL}
        alt="Dance fitness at ASM Dance Studio"
        gradient="from-brand-mid/25 via-surface to-brand-start/20"
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="container-page relative pt-[calc(var(--header-h,88px)+24px)] text-center lg:pt-0"
      >
        <p className="eyebrow text-white/70">Health &amp; Performance</p>
        <h1 className="h1-display mx-auto mt-4 max-w-3xl text-balance text-white">
          Keep Dancing, <span className="text-gradient-brand">Stay Fit.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/70 md:text-xl">
          Elevate your health with our curated fitness programs, designed
          for rhythm, strength, and inner balance.
        </p>
      </motion.div>
    </section>
  );
}
