"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCENT_HEX = {
  "brand-start": "#ff2d55",
  "brand-mid": "#7c5cff",
  "brand-end": "#22d3ee",
  "brand-lime": "#c6ff3a",
};

// One alternating (image left/right) service block.
export default function ServiceBlock({ service, reverse = false }) {
  const hex = ACCENT_HEX[service.accent];
  const words = service.name.split(" ");
  const lastWord = words.pop();
  const leadWords = words.join(" ");

  return (
    <section className="container-page section-y">
      <div
        className={cn(
          "grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16",
          reverse && "lg:[&>*:first-child]:order-2"
        )}
      >
        <motion.div
          initial={{ opacity: 0, x: reverse ? 24 : -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <ImageWithFallback
            src={service.imageUrl}
            alt={service.name}
            gradient={service.gradient}
            className="aspect-4/3 w-full rounded-3xl border border-border shadow-2xl"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: reverse ? -24 : 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p
            style={{ color: hex }}
            className="text-xs font-bold tracking-[0.14em] uppercase"
          >
            {service.eyebrow}
          </p>

          <h2 className="h2-display mt-3 text-balance">
            {leadWords ? `${leadWords} ` : ""}
            <span style={{ color: hex }}>{lastWord}</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {service.longDescription}
          </p>

          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
            {(service.benefits ?? []).map((benefit) => (
              <li key={benefit} className="flex items-center gap-2.5">
                <span
                  style={{ backgroundColor: hex }}
                  className="size-1.5 shrink-0 rounded-full"
                />
                <span className="text-sm text-foreground/90">{benefit}</span>
              </li>
            ))}
          </ul>

          <Button
            asChild
            size="lg"
            className={cn(
              "mt-10 h-14 gap-2 rounded-full px-8 font-bold hover:brightness-110",
              service.accent === "brand-lime" ? "text-background" : "text-white"
            )}
            style={{ backgroundColor: hex }}
          >
            <Link href={service.ctaHref}>
              {service.ctaLabel}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
