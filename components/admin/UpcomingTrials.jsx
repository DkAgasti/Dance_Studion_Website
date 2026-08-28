"use client";

import Link from "next/link";
import { interestName } from "@/config/classes";

function formatDay(value) {
  const d = new Date(value);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tmrw";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

// "Upcoming Trials" card for the admin overview page — next 5 trial
// bookings from today onward (see lib/dashboard.js).
export default function UpcomingTrials({ trials }) {
  return (
    <div className="glass-tile rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Upcoming Trials</h3>
        <Link
          href="/admin/trial-bookings"
          className="text-xs font-bold text-brand-lime hover:underline"
        >
          View All
        </Link>
      </div>

      {trials.length ? (
        <ul className="mt-4 flex flex-col divide-y divide-border/60">
          {trials.map((trial) => (
            <li key={trial.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
              <div className="w-14 shrink-0 text-xs text-muted-foreground">
                <p className="font-bold text-foreground">{formatDay(trial.preferredDateTime)}</p>
                <p>{formatTime(trial.preferredDateTime)}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{trial.name}</p>
                <p className="text-xs text-muted-foreground">{interestName(trial.interest)}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 py-6 text-center text-sm text-muted-foreground">
          No upcoming trials scheduled.
        </p>
      )}
    </div>
  );
}
