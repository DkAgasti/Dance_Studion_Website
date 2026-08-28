"use client";

// Shared "STEP X OF N" eyebrow + heading + subtext for each wizard step.
export default function StepHeading({ step, total, title, subtitle }) {
  return (
    <div>
      <p className="eyebrow text-brand-lime">
        Step {step} of {total}
      </p>
      <h2 className="h3-display mt-3 text-balance sm:text-3xl">{title}</h2>
      {subtitle ? (
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
