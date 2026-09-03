"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { cn } from "@/lib/utils";

// Card displaying a single student/parent review/testimonial.
export default function ReviewCard({ review, className }) {
  if (!review) return null;
  const { quote, name, role, rating = 5, avatarUrl } = review;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "90px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn("glass rounded-xl p-8", className)}
    >
      <div className="flex gap-1 text-gold">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="size-[18px] fill-current" strokeWidth={0} />
        ))}
      </div>
      <p className="mt-6 text-lg leading-relaxed text-foreground/90">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-8 flex items-center gap-4">
        <ImageWithFallback
          src={avatarUrl}
          className="size-12 shrink-0 rounded-full"
          gradient="from-brand-mid to-brand-end"
        />
        <div>
          <p className="font-medium text-foreground">{name}</p>
          <p className="eyebrow !text-[11px] !tracking-[0.1em]">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}
