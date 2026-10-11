// Trial booking status metadata for the admin Trial Bookings page + detail panel.
// Data itself comes from GET /api/trial-bookings (Prisma).

// Prisma TrialStatus enum -> UI filter/badge key.
export const statusToKey = {
  NEW: "new",
  ATTENDED: "attended",
  CONVERTED: "converted",
  NO_SHOW: "no-show",
};

// Status is semantic, not brand — ok/warn/danger read as meaning on white
// where a neon brand hue (especially bg-brand-lime as text) did not.
export const trialStatusMeta = {
  new: { label: "New", dot: "bg-warn", text: "text-warn" },
  attended: { label: "Attended", dot: "bg-brand-mid", text: "text-brand-mid" },
  converted: { label: "Converted", bg: "bg-brand-lime-tint", text: "text-brand-lime-ink" },
  "no-show": { label: "No-show", dot: "bg-danger", text: "text-danger" },
};
