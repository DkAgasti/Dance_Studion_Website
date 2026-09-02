"use client";

import { useEffect } from "react";
import { useCloseRoute } from "@/lib/useCloseRoute";

// Wraps an intercepted route's page content in a full-viewport overlay so it
// opens as a popup over whatever page the user was on, instead of navigating
// away to it — see app/(public)/@modal for the intercepting-route wiring.
// The page's own close button (inside `children`) should use useCloseRoute()
// too, so both the backdrop and the X land on the same "go back" behavior.
export default function RouteModal({ children }) {
  const closeRoute = useCloseRoute();

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") closeRoute();
    }
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeRoute();
      }}
    >
      {children}
    </div>
  );
}
