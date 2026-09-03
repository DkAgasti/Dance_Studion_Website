"use client";

import { cn } from "@/lib/utils";

// Big selectable card (icon + title + description) — used by "Who is this for?".
export default function OptionCard({ icon: Icon, title, description, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex flex-1 flex-col gap-3 rounded-2xl border-2 p-6 text-left transition-colors",
        selected
          ? "border-primary bg-primary/10"
          : "glass-tile border-transparent hover:border-foreground/20"
      )}
    >
      <span
        className={cn(
          "flex size-11 items-center justify-center rounded-full",
          selected ? "bg-primary text-white" : "bg-foreground/10 text-foreground/80"
        )}
      >
        <Icon className="size-5" />
      </span>
      <span>
        <span className="block font-medium">{title}</span>
        <span className="mt-1 block text-sm text-muted-foreground">
          {description}
        </span>
      </span>
    </button>
  );
}
