"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function StepMedicalConsent({ register, errors, consent, onConsentChange }) {
  return (
    <div>
      <h2 className="h3-display text-balance sm:text-3xl">Medical Consent</h2>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        Help us keep the student safe during class.
      </p>

      <div className="mt-8 flex flex-col gap-2">
        <Label htmlFor="medicalNotes">
          Medical Conditions, Allergies, or Injuries{" "}
          <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="medicalNotes"
          rows={4}
          placeholder="Let us know anything our trainers should be aware of."
          className="h-auto min-h-28 rounded-xl border-border bg-foreground/[0.04] px-4 py-3"
          {...register("medicalNotes")}
        />
      </div>

      <label className="glass mt-6 flex cursor-pointer items-start gap-3 rounded-2xl p-5">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => onConsentChange(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-primary"
        />
        <span className="text-sm text-foreground/90">
          I consent to ASM Dance Studio staff providing basic first aid in
          case of injury during class, and confirm the information above is
          accurate to the best of my knowledge.
        </span>
      </label>
      {errors.medicalConsent ? (
        <p className="mt-2 text-xs text-destructive">
          {errors.medicalConsent.message}
        </p>
      ) : null}
    </div>
  );
}
