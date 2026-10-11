"use client";

import { CalendarCheck, UserPlus, Receipt, CircleAlert, TrendingUp, Users } from "lucide-react";
import StatCard from "@/components/admin/StatCard";

function money(n) {
  return `₹${(n || 0).toLocaleString("en-IN")}`;
}

// Admin overview stat tiles — built from real aggregates (lib/dashboard.js).
export default function StatsGrid({ stats }) {
  const cards = [
    {
      label: "Trials Today",
      value: String(stats.trialsToday),
      trend:
        stats.trialsTodayDelta === 0
          ? "Same as yesterday"
          : `${stats.trialsTodayDelta > 0 ? "+" : ""}${stats.trialsTodayDelta} from yesterday`,
      trendType: stats.trialsTodayDelta > 0 ? "positive" : stats.trialsTodayDelta < 0 ? "negative" : "neutral",
      icon: CalendarCheck,
    },
    {
      label: "Pending Admissions",
      value: String(stats.pendingAdmissions),
      trend: stats.pendingAdmissions ? "Requires follow-up" : "All caught up",
      trendType: "neutral",
      icon: UserPlus,
    },
    {
      label: "Fees Due",
      value: money(stats.feesDue),
      trend: `${stats.feesDueCount} pending payment${stats.feesDueCount === 1 ? "" : "s"}`,
      trendType: "neutral",
      icon: Receipt,
    },
    {
      label: "Overdue Fees",
      value: money(stats.feesOverdue),
      trend: `${stats.feesOverdueCount} overdue account${stats.feesOverdueCount === 1 ? "" : "s"}`,
      trendType: stats.feesOverdueCount ? "negative" : "neutral",
      icon: CircleAlert,
    },
    {
      label: "Monthly Revenue",
      value: money(stats.monthlyRevenue),
      trend:
        stats.revenueTrendPercent === null
          ? null
          : `${stats.revenueTrendPercent >= 0 ? "+" : ""}${stats.revenueTrendPercent}% vs last month`,
      trendType: stats.revenueTrendPercent > 0 ? "positive" : stats.revenueTrendPercent < 0 ? "negative" : "neutral",
      icon: TrendingUp,
    },
    {
      label: "Active Students",
      value: String(stats.activeStudents),
      icon: Users,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
      {cards.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
