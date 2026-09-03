"use client";

import { motion } from "framer-motion";
import { Zap, Clock, Users, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const VALUES = [
  {
    name: "Passion",
    icon: Zap,
    color: "bg-brand-start",
    iconColor: "text-white",
    description:
      "We pour our hearts into every move, every class, and every performance.",
  },
  {
    name: "Discipline",
    icon: Clock,
    color: "bg-brand-mid",
    iconColor: "text-white",
    description:
      "Greatness is built through consistency, hard work, and technical precision.",
  },
  {
    name: "Community",
    icon: Users,
    color: "bg-brand-lime-tint",
    iconColor: "text-brand-lime-ink",
    description: "ASM is a family where we support, grow, and celebrate each other.",
  },
  {
    name: "Inclusivity",
    icon: Globe,
    color: "bg-brand-end",
    iconColor: "text-white",
    description:
      "Dance is for everyone, regardless of age, background, or ability.",
  },
];

// "Our Values" — four core value cards.
export default function OurValues() {
  return (
    <section className="container-page section-y">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "120px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="h2-display text-center uppercase"
      >
        Our Values
      </motion.h2>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((value, i) => (
          <motion.div
            key={value.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "90px" }}
            transition={{ duration: 0.35, delay: i * 0.08, ease: "easeOut" }}
            className="glass rounded-3xl p-10 transition-transform hover:-translate-y-1"
          >
            <div
              className={cn(
                "flex size-16 items-center justify-center rounded-md",
                value.color
              )}
            >
              <value.icon className={cn("size-6", value.iconColor)} strokeWidth={2} />
            </div>
            <h3 className="h4-display mt-6">{value.name}</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              {value.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
