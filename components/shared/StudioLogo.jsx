"use client";

import { useEffect, useState } from "react";
import { cldOptimize } from "@/lib/utils";

// Shown immediately (no flash of the "ASM" text/blank state) while
// /api/settings loads — overwritten below with whatever Admin > Settings >
// Studio Profile actually has once the fetch resolves, so this only matters
// for that first paint and stays correct if the admin later changes the logo.
const FALLBACK_LOGO_URL =
  "https://res.cloudinary.com/fexwwils/image/upload/v1788164253/studio/ygwgc9lzitevpwjhqgwu.png";

// Renders the studio's uploaded logo (Admin > Settings > Studio Profile) if
// one is set, falling back to the "ASM" wordmark otherwise.
export default function StudioLogo({ className, imgClassName = "h-8 w-auto object-contain" }) {
  const [logoUrl, setLogoUrl] = useState(FALLBACK_LOGO_URL);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/settings")
      .then((res) => {
        // A non-2xx here (e.g. a transient DB hiccup) is NOT "no logo set" —
        // throw so it's handled the same as a network failure below,
        // keeping the fallback logo instead of blanking it out.
        if (!res.ok) throw new Error(`Settings fetch failed: ${res.status}`);
        return res.json();
      })
      .then((body) => {
        // A successful response is the source of truth even when it has no
        // logo (admin removed it) — only a failed fetch (caught below)
        // should leave the fallback logo in place.
        if (!cancelled) setLogoUrl(body.settings?.logoUrl || null);
      })
      .catch(() => {
        // network hiccup or server error — keep showing the fallback logo
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (logoUrl) {
    return <img src={cldOptimize(logoUrl)} alt="ASM Dance Studio" className={imgClassName} />;
  }

  return <span className={className}>ASM</span>;
}
