"use client";

import StepHeading from "@/components/forms/trial/StepHeading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const fieldClassName = "h-12 rounded-xl border-border bg-foreground/[0.04] px-4";

export default function StepDetails({ register, errors }) {
  return (
    <div>
      <StepHeading
        step={5}
        total={6}
        title="Almost there!"
        subtitle="We'll use these details to confirm your trial class."
      />

      <div className="mt-8 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="trial-name">Full Name</Label>
          <Input
            id="trial-name"
            placeholder="Enter your full name"
            className={fieldClassName}
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name ? (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="trial-phone">
            Phone <span className="text-brand-lime-ink">(primary contact)</span>
          </Label>
          <Input
            id="trial-phone"
            type="tel"
            placeholder="+91 98765 43210"
            className={fieldClassName}
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
          {errors.phone ? (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="trial-email">
            Email <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="trial-email"
            type="email"
            placeholder="you@example.com"
            className={fieldClassName}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
