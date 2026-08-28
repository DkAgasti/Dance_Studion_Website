"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { pricingPlans } from "@/config/pricing";

export default function StepPlanSelection({ value, onChange }) {
  return (
    <div>
      <h2 className="h3-display text-balance sm:text-3xl">Plan Selection</h2>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        Choose the membership plan that fits best — you can always change it
        later.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {pricingPlans.map((plan) => {
          const selected = value === plan.slug;
          return (
            <button
              key={plan.slug}
              type="button"
              onClick={() => onChange(plan.slug)}
              aria-pressed={selected}
              className={cn(
                "flex flex-col rounded-2xl border-2 p-5 text-left transition-colors",
                selected
                  ? "border-brand-lime bg-brand-lime/10"
                  : "glass-tile border-transparent hover:border-white/20"
              )}
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{plan.name}</p>
                {selected ? (
                  <span className="bg-brand-lime flex size-5 items-center justify-center rounded-full text-background">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                ) : null}
              </div>
              <p className="mt-2 font-display text-2xl font-bold">
                ₹{plan.monthlyPrice.toLocaleString("en-IN")}
                <span className="text-xs font-normal text-muted-foreground">
                  {" "}
                  /month
                </span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{plan.tagline}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
