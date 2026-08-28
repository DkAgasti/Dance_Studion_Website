"use client";

import { cn } from "@/lib/utils";

// Small 2-3 option segmented control (e.g. Active / Inactive).
export default function SegmentedToggle({ options, active, onChange }) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-white/[0.03] p-1">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => onChange(option.key)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
            active === option.key
              ? "bg-white/10 text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
