// Admission status metadata for the admin Admissions page + detail panel.
// Data itself comes from GET /api/admissions (Prisma).

// Prisma AdmissionStatus enum -> UI filter/badge key.
export const statusToKey = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const statusMeta = {
  pending: { label: "Pending", dot: "bg-brand-mid", text: "text-brand-mid" },
  approved: { label: "Approved", dot: "bg-brand-lime", text: "text-brand-lime" },
  rejected: { label: "Rejected", dot: "bg-brand-start", text: "text-brand-start" },
};
