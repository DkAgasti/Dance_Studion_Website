"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// A single pricing plan card — price animates when the billing period toggles.
export default function PlanCard({ plan, period, index }) {
  const price = period === "quarterly" ? plan.quarterlyPrice : plan.monthlyPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className={cn(
        "relative flex flex-col rounded-3xl border p-8 transition-transform hover:-translate-y-1",
        plan.highlighted
          ? "border-brand-lime bg-surface/80 shadow-2xl"
          : "glass-tile"
      )}
    >
      {plan.highlighted ? (
        <span className="bg-brand-lime absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-[11px] font-bold tracking-wide text-background uppercase">
          Most Popular
        </span>
      ) : null}

      <h3 className="h4-display">{plan.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{plan.tagline}</p>

      <div className="mt-6 flex items-baseline gap-1">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={price}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="font-display text-4xl font-bold"
          >
            ₹{(price ?? 0).toLocaleString("en-IN")}
          </motion.span>
        </AnimatePresence>
        <span className="eyebrow !text-[11px]">/month</span>
      </div>

      <ul className="mt-8 flex flex-col gap-3">
        {(plan.features ?? []).map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                plan.highlighted
                  ? "bg-brand-lime text-background"
                  : "bg-brand-mid/15 text-brand-mid"
              )}
            >
              <Check className="size-3" strokeWidth={3} />
            </span>
            <span className="text-sm text-foreground/90">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        asChild
        size="lg"
        className={cn(
          "mt-10 h-14 rounded-full font-bold",
          plan.highlighted
            ? "bg-brand-lime text-background hover:bg-brand-lime/90"
            : "border border-border bg-transparent text-foreground hover:bg-white/5"
        )}
      >
        <Link href={`/admissions?plan=${plan.id}`}>{plan.ctaLabel}</Link>
      </Button>
    </motion.div>
  );
}
