// Derives a student's overall fee status from their fee records —
// used by /api/students and /api/students/[id] (no stored column, always live).
export function computeFeeStatus(fees) {
  if (!fees?.length) return "paid";
  if (fees.some((f) => f.status === "OVERDUE")) return "overdue";
  if (fees.some((f) => f.status === "PENDING")) return "due-soon";
  return "paid";
}
