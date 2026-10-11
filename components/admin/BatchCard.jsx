"use client";

import { Music, Feather, Zap, Sparkles, Clock, User, Users, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = { music: Music, feather: Feather, zap: Zap, sparkles: Sparkles };

const ACCENT_HEX = {
  "brand-start": "#c8102e",
  "brand-mid": "#5b21b6",
  "brand-end": "#0e7490",
  "brand-lime": "#3f6212",
};

// Capacity is a status, not a brand accent — semantic ok/warn/danger colors
// instead of borrowing a neon brand hue for meaning it never had.
function capacityInfo(enrolled, capacity) {
  const percent = Math.min(100, Math.round((enrolled / capacity) * 100));
  if (enrolled >= capacity) {
    return { label: "Full", percent: 100, color: "var(--danger)" };
  }
  if (percent >= 70) {
    return { label: `${percent}% Capacity`, percent, color: "var(--warn)" };
  }
  return { label: `${percent}% Capacity`, percent, color: "var(--ok)" };
}

// A single batch/schedule card — click opens the roster panel; edit/delete
// appear on hover (visual only, no backend).
export default function BatchCard({ batch, onSelect, onEdit, onDelete }) {
  const Icon = ICONS[batch.iconName];
  const hex = ACCENT_HEX[batch.accent];
  const cap = capacityInfo(batch.enrolled, batch.capacity);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(batch)}
      onKeyDown={(e) => e.key === "Enter" && onSelect(batch)}
      className="group glass-tile relative cursor-pointer rounded-2xl p-6 text-left transition-transform hover:-translate-y-1"
    >
      <div className="absolute top-4 right-4 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(batch);
          }}
          aria-label={`Edit ${batch.name}`}
          className="flex size-7 items-center justify-center rounded-full bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
        >
          <Pencil className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(batch);
          }}
          aria-label={`Delete ${batch.name}`}
          className="flex size-7 items-center justify-center rounded-full bg-white/5 text-muted-foreground hover:bg-brand-start/20 hover:text-brand-start"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <div
        style={{ backgroundColor: `${hex}22`, color: hex }}
        className="flex size-11 items-center justify-center rounded-xl"
      >
        {Icon ? <Icon className="size-5" /> : null}
      </div>

      <h3 className="h4-display mt-4">{batch.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {batch.level} • {batch.studio}
      </p>

      <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <Clock className="size-4 shrink-0" />
          {batch.days} • {batch.time}
        </span>
        <span className="flex items-center gap-2">
          <User className="size-4 shrink-0" />
          Trainer: {batch.trainer}
        </span>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 font-medium">
            <Users className="size-4 text-muted-foreground" />
            {batch.enrolled} Students
          </span>
          <span
            style={{ color: cap.color }}
            className="text-xs font-bold tracking-wide uppercase"
          >
            {cap.label}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className={cn("h-full rounded-full")}
            style={{ width: `${cap.percent}%`, backgroundColor: cap.color }}
          />
        </div>
      </div>
    </div>
  );
}
