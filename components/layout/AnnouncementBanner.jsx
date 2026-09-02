"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import BookingLink from "@/components/shared/BookingLink";

function isWithinWindow(startsAt, endsAt) {
  const now = new Date();
  if (startsAt && now < new Date(startsAt)) return false;
  if (endsAt) {
    const end = new Date(endsAt);
    end.setHours(23, 59, 59, 999);
    if (now > end) return false;
  }
  return true;
}

// Top promo banner, admin-managed via Admin → Content → Announcements. Only
// renders when the saved announcement is switched on and today falls inside
// its optional start/end window.
export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/announcements")
      .then((res) => (res.ok ? res.json() : { announcement: null }))
      .then((body) => {
        if (cancelled) return;
        const a = body.announcement;
        if (!a?.active || !isWithinWindow(a.startsAt, a.endsAt)) return;
        setAnnouncement(a);
      })
      .catch(() => {
        // network hiccup — just don't show a banner
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!announcement || dismissed) return null;

  // Intentionally not persisted (no localStorage/sessionStorage) — closing
  // only hides it for this page view, so it's back on the next visit/reload
  // instead of staying hidden until the admin changes it.
  function handleDismiss() {
    setDismissed(true);
  }

  const message = (
    <>
      <p className="text-sm font-bold text-white">{announcement.title}</p>
      {announcement.text ? <p className="text-sm text-white/85">{announcement.text}</p> : null}
    </>
  );

  return (
    <div className="bg-gradient-brand relative flex flex-col items-center gap-2 px-10 py-3 text-center sm:flex-row sm:justify-center sm:gap-4">
      {announcement.link ? (
        <BookingLink
          href={announcement.link}
          className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4"
        >
          {message}
          <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold whitespace-nowrap text-background">
            Learn More
          </span>
        </BookingLink>
      ) : (
        message
      )}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="absolute top-1/2 right-3 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-white/80 hover:bg-white/20 hover:text-white"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
