"use client";

import { CalendarCheck, Trophy, UserX } from "lucide-react";
import DetailPanel from "@/components/admin/DetailPanel";
import { trialStatusMeta, statusToKey } from "@/components/admin/trialBookingsData";
import { interestName } from "@/config/classes";

function formatDateTime(value) {
  if (!value) return "Not set";
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function capitalize(value) {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// "Booking Details" panel — shown when a row is selected in the trial
// bookings table. Status actions PATCH /api/trial-bookings/[id].
export default function TrialDetailPanel({ booking, onClose, onMarkAttended, onMarkConverted, onMarkNoShow }) {
  if (!booking) return null;
  const meta = trialStatusMeta[statusToKey[booking.status]];

  return (
    <DetailPanel
      title="Booking Details"
      onClose={onClose}
      avatarGradient="from-brand-end/25 via-surface to-brand-lime/15"
      name={booking.name}
      subtitleLines={[booking.email, booking.phone].filter(Boolean)}
      badge={meta}
      actions={[
        {
          label: booking.status === "ATTENDED" ? "Attended" : "Mark Attended",
          onClick: onMarkAttended,
          disabled: booking.status !== "NEW",
          icon: CalendarCheck,
          className: "bg-brand-end text-background hover:bg-brand-end/90",
        },
        {
          label: booking.status === "CONVERTED" ? "Converted" : "Mark Converted",
          onClick: onMarkConverted,
          disabled: booking.status !== "NEW",
          icon: Trophy,
          className: "bg-brand-lime text-background hover:bg-brand-lime/90",
        },
        {
          label: booking.status === "NO_SHOW" ? "No-show" : "Mark No-show",
          onClick: onMarkNoShow,
          disabled: booking.status !== "NEW",
          variant: "outline",
          icon: UserX,
        },
      ]}
    >
      <div className="mt-6 border-t border-border pt-5">
        <p className="eyebrow !text-[10px]">Interest</p>
        <p className="mt-2 font-medium">
          {booking.interests?.map(interestName).join(", ") || "—"}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Age group: {capitalize(booking.ageGroup)} • Experience: {capitalize(booking.experienceLevel)}
        </p>
      </div>

      <div className="mt-5 border-t border-border pt-5">
        <p className="eyebrow !text-[10px]">Preferred Date &amp; Time</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {formatDateTime(booking.preferredDateTime)}
        </p>
      </div>

      {booking.notes ? (
        <div className="mt-5 border-t border-border pt-5">
          <p className="eyebrow !text-[10px]">Notes</p>
          <p className="mt-2 text-sm text-muted-foreground">{booking.notes}</p>
        </div>
      ) : null}
    </DetailPanel>
  );
}
