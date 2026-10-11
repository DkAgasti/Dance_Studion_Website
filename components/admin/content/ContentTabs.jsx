"use client";

import { cn } from "@/lib/utils";

// Horizontal underline tab bar for the Content Management page.
export default function ContentTabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-6 overflow-x-auto border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            "relative shrink-0 pb-3 text-sm font-medium whitespace-nowrap transition-colors",
            active === tab.key
              ? "text-brand-end"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
          {active === tab.key ? (
            <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-end" />
          ) : null}
        </button>
      ))}
    </div>
  );
}
