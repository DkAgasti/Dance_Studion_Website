"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Monthly / Quarterly switch — a sliding knob plus a "Save 10%" badge.
export default function BillingToggle({ period, onChange }) {
  const isQuarterly = period === "quarterly";

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={cn(
          "text-sm font-bold tracking-wide uppercase transition-colors",
          !isQuarterly ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Monthly
      </button>

      <button
        type="button"
        role="switch"
        aria-checked={isQuarterly}
        onClick={() => onChange(isQuarterly ? "monthly" : "quarterly")}
        className="relative flex h-7 w-12 items-center rounded-full border border-border bg-white/[0.06] p-1"
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className="size-5 rounded-full bg-white shadow"
          style={{ marginLeft: isQuarterly ? "auto" : 0 }}
        />
      </button>

      <button
        type="button"
        onClick={() => onChange("quarterly")}
        className={cn(
          "flex items-center gap-2 text-sm font-bold tracking-wide uppercase transition-colors",
          isQuarterly ? "text-brand-lime" : "text-muted-foreground"
        )}
      >
        Quarterly
        <span className="bg-brand-lime rounded-full px-2 py-0.5 text-[10px] font-bold text-background">
          Save 10%
        </span>
      </button>
    </div>
  );
}
