// Admission status metadata for the admin Admissions page + detail panel.
// Data itself comes from GET /api/admissions (Prisma).

// Prisma AdmissionStatus enum -> UI filter/badge key.
export const statusToKey = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

// Status is semantic, not brand — ok/warn/danger read as meaning on white
// where a neon brand hue (especially bg-brand-lime as text) did not.
export const statusMeta = {
  pending: { label: "Pending", dot: "bg-warn", text: "text-warn" },
  approved: { label: "Approved", bg: "bg-brand-lime-tint", text: "text-brand-lime-ink" },
  rejected: { label: "Rejected", dot: "bg-danger", text: "text-danger" },
};
