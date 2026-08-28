"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// Wraps a plain <img> (Cloudinary already serves optimized/CDN'd images, so
// next/image's remote-pattern allowlist isn't needed) with a gradient + icon
// placeholder shown when no src is provided yet or the real src 404s.
export default function ImageWithFallback({
  src,
  alt = "",
  gradient = "from-surface via-surface to-background",
  icon: Icon,
  className,
  imgClassName,
  ...props
}) {
  const [errored, setErrored] = useState(false);
  const showPlaceholder = !src || errored;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {showPlaceholder ? (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-gradient-to-br",
            gradient
          )}
        >
          {Icon ? (
            <Icon className="size-10 text-white/25" strokeWidth={1.5} />
          ) : null}
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={cn("absolute inset-0 size-full object-cover", imgClassName)}
          onError={() => setErrored(true)}
          {...props}
        />
      )}
    </div>
  );
}
