"use client";

import { useState } from "react";
import { cn, cldOptimize } from "@/lib/utils";

function initialsOf(label) {
  if (!label) return "";
  const parts = label.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "")).toUpperCase();
}

// Wraps a plain <img> (Cloudinary already serves optimized/CDN'd images, so
// next/image's remote-pattern allowlist isn't needed) with a gradient + icon
// (or initials, when a `label` is given — e.g. a student/booking name)
// placeholder shown when no src is provided yet or the real src 404s.
export default function ImageWithFallback({
  src,
  alt = "",
  gradient = "from-surface via-surface to-background",
  icon: Icon,
  label,
  className,
  imgClassName,
  ...props
}) {
  const [errored, setErrored] = useState(false);
  const showPlaceholder = !src || errored;
  const initials = initialsOf(label);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {showPlaceholder ? (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-gradient-to-br",
            gradient
          )}
        >
          {initials ? (
            <span className="text-xs font-bold text-foreground/60">{initials}</span>
          ) : Icon ? (
            <Icon className="size-10 text-foreground/25" strokeWidth={1.5} />
          ) : null}
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cldOptimize(src)}
          alt={alt}
          className={cn("absolute inset-0 size-full object-cover", imgClassName)}
          onError={() => setErrored(true)}
          {...props}
        />
      )}
    </div>
  );
}
