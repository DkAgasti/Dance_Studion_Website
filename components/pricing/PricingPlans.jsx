"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import BillingToggle from "@/components/pricing/BillingToggle";
import PlanCard from "@/components/pricing/PlanCard";

// Billing toggle + the plan cards — toggle state lives here so every
// card's displayed price switches together. Plans come from GET /api/plans
// (managed in Admin > Settings > Plans & Pricing).
export default function PricingPlans() {
  const [period, setPeriod] = useState("monthly");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/plans")
      .then((res) => (res.ok ? res.json() : { plans: [] }))
      .then((body) => {
        if (!cancelled) setPlans(body.plans ?? []);
      })
      .catch(() => {
        // network/DB hiccup — leave plans empty rather than crash
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="container-page pb-20 md:pb-28">
      <BillingToggle period={period} onChange={setPeriod} />

      {loading ? (
        <div className="mt-12 flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading plans...
        </div>
      ) : plans.length ? (
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} period={period} index={i} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          Plans coming soon — check back shortly.
        </p>
      )}
    </section>
  );
}
