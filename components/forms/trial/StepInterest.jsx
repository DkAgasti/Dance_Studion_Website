"use client";

import StepHeading from "@/components/forms/trial/StepHeading";
import Chip from "@/components/forms/trial/Chip";
import { classCatalog } from "@/config/classes";

const DANCE_OPTIONS = classCatalog.map((c) => ({ key: c.slug, label: c.name }));

export default function StepInterest({ value, onChange, services = [] }) {
  // Fitness options come from the real, admin-managed Service records (not
  // the static config catalog) so the slug picked here matches a real
  // service — needed so Step 4 can look up that service's actual times.
  const FITNESS_OPTIONS = services.map((s) => ({ key: s.slug, label: s.name }));
  return (
    <div>
      <StepHeading
        step={3}
        total={6}
        title="What excites you?"
        subtitle="Pick the class you'd like to try in your trial."
      />

      <div className="mt-8">
        <p className="eyebrow">Dance Styles</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DANCE_OPTIONS.map((option) => (
            <Chip
              key={option.key}
              label={option.label}
              selected={value === option.key}
              onClick={() => onChange(option.key)}
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p className="eyebrow">Fitness</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FITNESS_OPTIONS.map((option) => (
            <Chip
              key={option.key}
              label={option.label}
              selected={value === option.key}
              onClick={() => onChange(option.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
