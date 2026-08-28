"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Full-width call-to-action band (used at page bottoms).
export default function CTABand({
  title = "Ready to take the floor?",
  subtitle = "Join the ASM family today. Your first class is on us.",
  primaryHref = "/book-trial",
  primaryLabel = "Book Free Trial",
  secondaryHref,
  secondaryLabel = "Chat Now",
  className,
}) {
  return (
    <section className={cn("container-page", className)}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gradient-brand relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12 sm:py-20 md:rounded-4xl md:py-24"
      >
        <h2 className="h2-display mx-auto max-w-3xl text-white text-balance">
          {title}
        </h2>
        {subtitle ? (
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
            {subtitle}
          </p>
        ) : null}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="h-[68px] rounded-full bg-white px-10 text-base font-bold text-background shadow-2xl hover:bg-white/90"
          >
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>
          {secondaryHref ? (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-[68px] gap-2 rounded-full border-2 border-white/40 bg-transparent px-10 text-base font-bold text-white hover:bg-white/10"
            >
              <Link href={secondaryHref}>
                <MessageCircle className="size-[18px]" />
                {secondaryLabel}
              </Link>
            </Button>
          ) : null}
        </div>
      </motion.div>
    </section>
  );
}
