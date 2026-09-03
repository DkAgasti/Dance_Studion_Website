"use client";

import Chip from "@/components/forms/trial/Chip";

// Shows the real batches (live schedule + price) for the class picked in the
// previous step — no more generic, disconnected membership tiers.
export default function StepPlanSelection({ value, onChange, selectedClass }) {
  const batches = selectedClass?.batches ?? [];

  return (
    <div>
      <h2 className="h3-display text-balance sm:text-3xl">Choose Your Batch</h2>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        {selectedClass
          ? `Pick a ${selectedClass.name} batch — the price shown is exactly what you'll pay.`
          : "Pick a class first to see its available batches."}
      </p>

      <div className="mt-8">
        {batches.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {batches.map((b) => (
              <Chip
                key={b.id}
                label={`${b.day} • ${b.startTime}`}
                description={[
                  b.trainer ? `Trainer: ${b.trainer}` : null,
                  `₹${(b.price ?? 0).toLocaleString("en-IN")}/mo`,
                  `${b.seatsLeft} seats left`,
                ]
                  .filter(Boolean)
                  .join(" • ")}
                selected={value === b.id}
                onClick={() => onChange(b.id)}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-border bg-foreground/[0.03] px-4 py-3 text-sm text-muted-foreground">
            No batches are scheduled for this class yet — our team will reach out to set up a
            time and confirm pricing with you.
          </p>
        )}
      </div>
    </div>
  );
}
