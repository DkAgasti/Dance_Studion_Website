"use client";

import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const TREND_STYLES = {
  positive: "text-brand-lime",
  negative: "text-brand-start",
  neutral: "text-muted-foreground",
};

// Small stat tile for the admin overview page.
export default function StatCard({ label, value, trend, trendType = "neutral", icon: Icon }) {
  return (
    <div className="glass-tile rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {Icon ? (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-brand-mid">
            <Icon className="size-4" />
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-display text-3xl font-bold">{value}</p>
      {trend ? (
        <p className={cn("mt-2 flex items-center gap-1 text-xs font-medium", TREND_STYLES[trendType])}>
          {trendType === "positive" ? <ArrowUp className="size-3" /> : null}
          {trend}
        </p>
      ) : null}
    </div>
  );
}
