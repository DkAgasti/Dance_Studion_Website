"use client";

import { X } from "lucide-react";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Generic side/drawer panel shell — shown when a row is selected in an admin
// table. Reused by Admissions ("Applicant Details") and Trial Bookings
// ("Booking Details"): header + avatar/name/subtitle/status, then arbitrary
// content sections (children), then an action button group.
export default function DetailPanel({
  title,
  onClose,
  avatarGradient = "from-brand-mid/30 via-surface to-brand-start/20",
  name,
  subtitleLines = [],
  badge,
  children,
  actions = [],
}) {
  return (
    <div className="glass-tile flex h-fit w-full flex-col rounded-2xl p-6 lg:w-96 lg:shrink-0">
      <div className="flex items-start justify-between">
        <h3 className="font-medium">{title}</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-white/10 hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-6 flex flex-col items-center text-center">
        <ImageWithFallback
          gradient={avatarGradient}
          className="size-20 rounded-full border border-border"
        />
        <p className="mt-3 font-display font-bold">{name}</p>
        {subtitleLines.map((line) => (
          <p key={line} className="mt-0.5 text-xs text-muted-foreground">
            {line}
          </p>
        ))}
        {badge ? (
          <span
            className={cn(
              "mt-3 flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-bold",
              badge.text
            )}
          >
            <span className={cn("size-1.5 rounded-full", badge.dot)} />
            {badge.label}
          </span>
        ) : null}
      </div>

      {children}

      {actions.length ? (
        <div className="mt-6 flex flex-col gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              onClick={action.onClick}
              disabled={action.disabled}
              variant={action.variant === "outline" ? "outline" : undefined}
              className={cn(
                "h-12 gap-2 rounded-full font-bold",
                action.variant === "outline"
                  ? "border-border"
                  : (action.className ?? "bg-brand-start text-white hover:bg-brand-start/90")
              )}
            >
              {action.icon ? <action.icon className="size-4" /> : null}
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
