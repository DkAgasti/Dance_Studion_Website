// Student fee-status metadata + static dropdown option lists for the admin
// Students page. Student records themselves come from GET /api/students —
// each already carries a computed `feeStatus` ("paid"/"due-soon"/"overdue",
// see lib/feeStatus.js), so no enum-to-key mapping is needed here.
export const feeStatusMeta = {
  paid: { label: "Paid", dot: "bg-brand-lime", text: "text-brand-lime" },
  overdue: { label: "Overdue", dot: "bg-brand-start", text: "text-brand-start" },
  "due-soon": { label: "Due soon", dot: "bg-brand-mid", text: "text-brand-mid" },
  "no-fee": { label: "No Fee Set", dot: "bg-muted-foreground", text: "text-muted-foreground" },
};

export const classOptions = [
  "Classical",
  "Contemporary",
  "Hip-Hop Mastery",
  "Jazz",
  "Kids",
  "Lyrical",
  "Modern",
  "Zumba Fitness",
  "Kickboxing / MMA",
];

export const planOptions = ["Monthly", "Quarterly"];
