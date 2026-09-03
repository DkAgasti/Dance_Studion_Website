"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import BookingLink from "@/components/shared/BookingLink";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// One alternating (image left/right) service block. Every service shares the
// single brand primary — differentiation comes from the image and the
// eyebrow/heading copy, not a different accent color per section.
const ACCENT_HEX = "var(--primary)";

export default function ServiceBlock({ service, reverse = false }) {
  const hex = ACCENT_HEX;
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
          viewport={{ once: true, margin: "120px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
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
          viewport={{ once: true, margin: "120px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <p className="eyebrow">{service.eyebrow}</p>

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

          {(service.timeSlots ?? []).length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {service.timeSlots.map((slot) => (
                <span
                  key={slot}
                  className="glass-tile flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-foreground/90"
                >
                  <Clock className="size-3.5" style={{ color: hex }} />
                  {slot}
                </span>
              ))}
            </div>
          ) : null}

          <Button
            asChild
            size="lg"
            className="mt-10 h-14 gap-2 rounded-full bg-primary px-8 font-bold text-white hover:bg-primary/90"
          >
            <BookingLink href={service.ctaHref}>
              {service.ctaLabel}
              <ArrowRight className="size-4" />
            </BookingLink>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
