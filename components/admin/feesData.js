// Fee status metadata for the admin Fees page. Fee records come from
// GET /api/fees (Prisma) — raw FeeStatus enum values (PENDING/OVERDUE/PAID).

// Prisma FeeStatus enum -> UI tab/badge key.
export const statusToKey = {
  PENDING: "due",
  OVERDUE: "overdue",
  PAID: "paid",
};

export const feeStatusMeta = {
  due: { label: "Due soon", dot: "bg-warn", text: "text-warn" },
  overdue: { label: "Overdue", dot: "bg-danger", text: "text-danger" },
  paid: { label: "Paid", bg: "bg-brand-lime-tint", text: "text-brand-lime-ink" },
};
