"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const fieldClassName = "h-12 rounded-xl border-border bg-white/[0.04] px-4";

export default function StepGuardianInfo({ register, errors }) {
  return (
    <div>
      <h2 className="h3-display text-balance sm:text-3xl">Guardian Info</h2>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        For students under 18. If the student is an adult, feel free to skip
        this step.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="guardianName">Guardian Name</Label>
          <Input
            id="guardianName"
            placeholder="Enter guardian's full name"
            className={fieldClassName}
            {...register("guardianName")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="guardianRelationship">Relationship</Label>
          <select
            id="guardianRelationship"
            defaultValue=""
            className={cn(
              fieldClassName,
              "w-full appearance-none border text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            )}
            {...register("guardianRelationship")}
          >
            <option value="">Select relationship</option>
            <option value="parent">Parent</option>
            <option value="guardian">Legal Guardian</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="guardianPhone">Guardian Phone</Label>
          <Input
            id="guardianPhone"
            type="tel"
            placeholder="+91 98765 43210"
            className={fieldClassName}
            aria-invalid={!!errors.guardianPhone}
            {...register("guardianPhone")}
          />
          {errors.guardianPhone ? (
            <p className="text-xs text-destructive">{errors.guardianPhone.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="guardianEmail">
            Guardian Email <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="guardianEmail"
            type="email"
            placeholder="guardian@example.com"
            className={fieldClassName}
            aria-invalid={!!errors.guardianEmail}
            {...register("guardianEmail")}
          />
          {errors.guardianEmail ? (
            <p className="text-xs text-destructive">{errors.guardianEmail.message}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
