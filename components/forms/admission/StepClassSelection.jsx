"use client";

import Chip from "@/components/forms/trial/Chip";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { classCatalog, fitnessClasses } from "@/config/classes";

const DANCE_OPTIONS = classCatalog.map((c) => ({ key: c.slug, label: c.name }));
const FITNESS_OPTIONS = fitnessClasses.map((c) => ({ key: c.slug, label: c.name }));

export default function StepClassSelection({ value, onChange, register }) {
  return (
    <div>
      <h2 className="h3-display text-balance sm:text-3xl">Class Selection</h2>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        Which class is the student enrolling in?
      </p>

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

      <div className="mt-8 flex flex-col gap-2">
        <Label htmlFor="preferredBatchNote">
          Preferred Batch/Timing <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="preferredBatchNote"
          rows={2}
          placeholder="e.g. Weekday evenings after 6 PM"
          className="h-auto min-h-20 rounded-xl border-border bg-white/[0.04] px-4 py-3"
          {...register("preferredBatchNote")}
        />
      </div>
    </div>
  );
}
