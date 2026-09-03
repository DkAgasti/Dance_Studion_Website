"use client";

import { Loader2 } from "lucide-react";
import Chip from "@/components/forms/trial/Chip";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function StepClassSelection({ value, onChange, register, classes, classesLoading }) {
  return (
    <div>
      <h2 className="h3-display text-balance sm:text-3xl">Class Selection</h2>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        Which class is the student enrolling in?
      </p>

      <div className="mt-8">
        {classesLoading ? (
          <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading classes...
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {classes.map((c) => (
              <Chip
                key={c.id}
                label={c.name}
                description={[c.level, c.ageGroup].filter(Boolean).join(" • ") || undefined}
                selected={value === c.id}
                onClick={() => onChange(c.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-2">
        <Label htmlFor="preferredBatchNote">
          Preferred Batch/Timing <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="preferredBatchNote"
          rows={2}
          placeholder="e.g. Weekday evenings after 6 PM"
          className="h-auto min-h-20 rounded-xl border-border bg-foreground/[0.04] px-4 py-3"
          {...register("preferredBatchNote")}
        />
      </div>
    </div>
  );
}
