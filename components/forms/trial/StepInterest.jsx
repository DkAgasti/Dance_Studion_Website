"use client";

import StepHeading from "@/components/forms/trial/StepHeading";
import Chip from "@/components/forms/trial/Chip";
import { classCatalog, fitnessClasses } from "@/config/classes";

const DANCE_OPTIONS = classCatalog.map((c) => ({ key: c.slug, label: c.name }));
const FITNESS_OPTIONS = fitnessClasses.map((c) => ({ key: c.slug, label: c.name }));

export default function StepInterest({ value, onChange }) {
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
