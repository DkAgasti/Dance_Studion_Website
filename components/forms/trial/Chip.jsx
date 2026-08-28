"use client";

import { cn } from "@/lib/utils";

// Small selectable pill — used for experience level, age group, interest,
// and time-slot choices.
export default function Chip({ label, description, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors",
        selected
          ? "border-brand-lime bg-brand-lime/10 text-foreground"
          : "glass-tile border-transparent text-foreground/90 hover:border-white/20"
      )}
    >
      {label}
      {description ? (
        <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
          {description}
        </span>
      ) : null}
    </button>
  );
}
