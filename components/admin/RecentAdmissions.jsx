"use client";

import Link from "next/link";
import DataTable from "@/components/admin/DataTable";
import { cn } from "@/lib/utils";

function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const STATUS_LABEL = { PENDING: "Pending", APPROVED: "Active", REJECTED: "Rejected" };

const COLUMNS = [
  {
    key: "name",
    label: "Name",
    render: (row) => (
      <div className="flex items-center gap-3">
        <span className="bg-gradient-brand flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
          {initials(row.name)}
        </span>
        <span className="font-medium">{row.name}</span>
      </div>
    ),
  },
  { key: "className", label: "Class" },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <span
        className={cn(
          "rounded-full px-2.5 py-1 text-xs font-bold",
          row.status === "APPROVED"
            ? "bg-brand-lime/15 text-brand-lime"
            : "bg-white/10 text-muted-foreground"
        )}
      >
        {STATUS_LABEL[row.status] ?? row.status}
      </span>
    ),
  },
];

// "Recent Admissions" card for the admin overview page — last 5 admissions
// (see lib/dashboard.js).
export default function RecentAdmissions({ admissions }) {
  return (
    <div className="glass-tile rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Recent Admissions</h3>
        <Link
          href="/admin/admissions"
          className="text-xs font-bold text-brand-lime hover:underline"
        >
          View All
        </Link>
      </div>
      <div className="mt-4">
        <DataTable columns={COLUMNS} rows={admissions} />
      </div>
    </div>
  );
}
