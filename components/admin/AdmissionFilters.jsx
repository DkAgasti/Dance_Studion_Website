"use client";

import StatusFilters from "@/components/admin/StatusFilters";

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

// Status filter tabs for the admissions table.
export default function AdmissionFilters({ active, onChange, counts }) {
  return <StatusFilters tabs={TABS} active={active} onChange={onChange} counts={counts} />;
}
