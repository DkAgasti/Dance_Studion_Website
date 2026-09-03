"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Reusable section heading with eyebrow, title, and subtitle — scroll-reveals
// once, then stays put.
export default function SectionHeading({
  eyebrow,
  title,
  gradientWord,
  subtitle,
  align = "left",
  className,
  stackGradientWord = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "120px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
      <h2 className="h2-display text-balance">
        {title}
        {gradientWord ? (
          <>
            {stackGradientWord ? <br /> : " "}
            <span className="text-gradient-brand-2">{gradientWord}</span>
          </>
        ) : null}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
      ) : null}
    </motion.div>
  );
}
