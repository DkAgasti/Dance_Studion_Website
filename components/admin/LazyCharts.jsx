"use client";

// Recharts is a large dependency — split it into its own client-only chunk
// so the admin dashboard's initial JS bundle doesn't have to include it.
// (next/dynamic with ssr:false must live in a Client Component; it's not
// supported directly inside the Server Component that renders this.)
import dynamic from "next/dynamic";

const chartLoading = <div className="h-64 w-full animate-pulse rounded-xl bg-white/5" />;

export const RevenueChart = dynamic(
  () => import("@/components/admin/Charts").then((mod) => mod.RevenueChart),
  { ssr: false, loading: () => chartLoading }
);

export const EnrollmentChart = dynamic(
  () => import("@/components/admin/Charts").then((mod) => mod.EnrollmentChart),
  { ssr: false, loading: () => chartLoading }
);
