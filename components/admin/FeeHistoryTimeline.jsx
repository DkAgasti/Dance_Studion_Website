"use client";

import { feeStatusMeta } from "@/components/admin/studentsData";

// Vertical fee-payment history timeline for the student profile page.
export default function FeeHistoryTimeline({ history }) {
  if (!history?.length) {
    return <p className="text-sm text-muted-foreground">No fee history yet.</p>;
  }

  return (
    <ol className="relative flex flex-col gap-6 pl-6">
      <span aria-hidden className="absolute top-1 bottom-1 left-[7px] w-px bg-border" />
      {history.map((entry, i) => {
        const meta = feeStatusMeta[entry.status];
        return (
          <li key={i} className="relative">
            <span
              aria-hidden
              className={`absolute top-1 -left-6 size-3.5 rounded-full border-2 border-background ${meta.dot}`}
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">₹{entry.amount.toLocaleString("en-IN")}</p>
              <span className={`text-xs font-bold ${meta.text}`}>{meta.label}</span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {entry.date} {entry.method !== "—" ? `• ${entry.method}` : ""}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
