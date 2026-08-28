"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeartHandshake, Building, CalendarClock, ShieldCheck, ArrowUpRight } from "lucide-react";
import ImageWithFallback from "@/components/media/ImageWithFallback";

// Paste an image URL here to show it in the middle column — leave null to
// keep the current gradient placeholder.
const IMAGE_URL = "https://res.cloudinary.com/fexwwils/image/upload/v1787828574/why-choose-image_1.png";

const BULLETS = [
  "High-quality services backed by expert experience",
  "Tailored solutions designed to meet your needs",
  "Fast and reliable support for every project",
];

const HIGHLIGHTS = [
  {
    icon: HeartHandshake,
    label: "Expert Trainers",
    description:
      "Learn from certified instructors who bring skill, discipline, and heart to every class.",
  },
  {
    icon: Building,
    label: "Modern Studio",
    description:
      "Spacious, mirrored studios with professional flooring and sound systems.",
  },
  {
    icon: CalendarClock,
    label: "Flexible Batches",
    description:
      "Morning, evening, and weekend slots designed around your schedule.",
  },
  {
    icon: ShieldCheck,
    label: "Safe Environment",
    description:
      "A safe, encouraging space for dancers of every age and skill level.",
  },
];


export default function WhyChooseUs() {
  return (
    <section className="container-page pt-4 pb-20 md:pt-6 md:pb-28 lg:max-w-[1420px]">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_1.4fr_1.1fr] lg:items-start lg:gap-4">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="h2-display mt-12 text-balance text-[clamp(2rem,3.67vw,3.7rem)] leading-[1.08]">
            Why our dance academy is your best choice
          </h2>
          <ul className="mt-8 flex flex-col gap-4">
            {BULLETS.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <span className="mt-1 flex size-2.5 shrink-0 rounded-full bg-[#c62e7c]" />
                <span className="text-xs tracking-[0.08em] text-muted-foreground uppercase">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/book-trial"
            className="group relative mt-[130px] ml-[7.4vw] flex size-[clamp(120px,9.5vw,155px)] items-center justify-center rounded-full bg-[#c62e7c] text-white shadow-xl transition-transform hover:scale-105"
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-[spin_10s_linear_infinite]">
              <defs>
                <path id="join-academy-ring" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
              </defs>
              <text fontSize="7.4" fill="currentColor" letterSpacing="1" fontWeight="700">
                <textPath href="#join-academy-ring">
                  Join The Academy ✦ Join The Academy ✦
                </textPath>
              </text>
            </svg>
            <ArrowUpRight className="size-[34px] shrink-0" strokeWidth={2.5} />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mx-auto w-full"
        >
          <ImageWithFallback
            src={IMAGE_URL}
            gradient="from-brand-start/20 via-surface to-brand-mid/20"
            className="aspect-[2/3] w-full"
            imgClassName="object-contain"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-12 flex flex-col gap-16 lg:gap-20"
        >
          {HIGHLIGHTS.map(({ icon: Icon, label, description }) => (
            <div key={label} className="flex gap-4">
              <span className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-[#c62e7c]">
                <Icon className="size-5 text-white" />
              </span>
              <div className="max-w-[424px]">
                <p className="text-sm font-bold tracking-[0.06em] text-white uppercase">
                  {label}:
                </p>
                <p className="mt-1 text-xs tracking-[0.05em] text-white/70 uppercase">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
