"use client";

import { useEffect, useState } from "react";

// Shared fetch for the singleton StudioSettings row (map embed, socials,
// address, etc.) — used anywhere on the public site that needs to reflect
// what the admin set under Admin > Settings > Social & Map, instead of the
// static config/site.js defaults. Returns null until the fetch resolves;
// callers fall back to their own static default in that case.
export function useStudioSettings() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : { settings: null }))
      .then((body) => {
        if (!cancelled) setSettings(body.settings ?? null);
      })
      .catch(() => {
        // network hiccup — callers fall back to their own static defaults
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
}
