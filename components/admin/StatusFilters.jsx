"use client";

import { cn } from "@/lib/utils";

// Generic status filter tabs — reused by Admissions and Trial Bookings.
// `tabs`: [{ key, label }]. `counts`: { [key]: number } (optional).
export default function StatusFilters({ tabs, active, onChange, counts }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            active === tab.key
              ? "bg-brand-end text-background"
              : "glass-tile text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
          {counts ? (
            <span className="ml-1.5 opacity-70">({counts[tab.key] ?? 0})</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
