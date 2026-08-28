// Trial booking status metadata for the admin Trial Bookings page + detail panel.
// Data itself comes from GET /api/trial-bookings (Prisma).

// Prisma TrialStatus enum -> UI filter/badge key.
export const statusToKey = {
  NEW: "new",
  ATTENDED: "attended",
  CONVERTED: "converted",
  NO_SHOW: "no-show",
};

export const trialStatusMeta = {
  new: { label: "New", dot: "bg-brand-mid", text: "text-brand-mid" },
  attended: { label: "Attended", dot: "bg-brand-end", text: "text-brand-end" },
  converted: { label: "Converted", dot: "bg-brand-lime", text: "text-brand-lime" },
  "no-show": { label: "No-show", dot: "bg-brand-start", text: "text-brand-start" },
};
