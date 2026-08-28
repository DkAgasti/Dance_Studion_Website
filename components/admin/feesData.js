// Fee status metadata for the admin Fees page. Fee records come from
// GET /api/fees (Prisma) — raw FeeStatus enum values (PENDING/OVERDUE/PAID).

// Prisma FeeStatus enum -> UI tab/badge key.
export const statusToKey = {
  PENDING: "due",
  OVERDUE: "overdue",
  PAID: "paid",
};

export const feeStatusMeta = {
  due: { label: "Due soon", dot: "bg-brand-mid", text: "text-brand-mid" },
  overdue: { label: "Overdue", dot: "bg-brand-start", text: "text-brand-start" },
  paid: { label: "Paid", dot: "bg-brand-lime", text: "text-brand-lime" },
};
