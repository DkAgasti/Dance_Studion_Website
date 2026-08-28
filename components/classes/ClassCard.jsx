"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ImageWithFallback from "@/components/media/ImageWithFallback";

// A single class card — image, level/age badges, name, blurb, CTA.
export default function ClassCard({ classItem, gradient, index = 0 }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05, ease: "easeOut" }}
    >
      <Link
        href={`/classes/${classItem.slug}`}
        className="group glass-tile block overflow-hidden rounded-2xl transition-transform hover:-translate-y-1"
      >
        <div className="relative aspect-4/3 overflow-hidden">
          <ImageWithFallback
            src={classItem.imageUrl}
            gradient={gradient}
            className="absolute inset-0 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <div className="absolute inset-x-4 top-4 flex items-center justify-between text-[11px] font-bold tracking-wide uppercase">
            <span className="text-brand-lime">{classItem.level}</span>
            <span className="text-white/70">{classItem.ageGroup}</span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="h4-display">{classItem.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{classItem.description}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-lime">
            Book Trial
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
