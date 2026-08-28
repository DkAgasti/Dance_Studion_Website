"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const fieldClassName = "h-12 rounded-xl border-border bg-white/[0.04] px-4";

export default function StepContactDetails({ register, errors }) {
  return (
    <div>
      <h2 className="h3-display text-balance sm:text-3xl">Contact Details</h2>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        Where should we reach you about batches, fees, and updates?
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="admission-phone">Phone</Label>
          <Input
            id="admission-phone"
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
          <Label htmlFor="admission-email">Email</Label>
          <Input
            id="admission-email"
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

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="addressLine1">Address</Label>
          <Input
            id="addressLine1"
            placeholder="House no., street, area"
            className={fieldClassName}
            aria-invalid={!!errors.addressLine1}
            {...register("addressLine1")}
          />
          {errors.addressLine1 ? (
            <p className="text-xs text-destructive">{errors.addressLine1.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="Bhubaneswar"
            className={fieldClassName}
            aria-invalid={!!errors.city}
            {...register("city")}
          />
          {errors.city ? (
            <p className="text-xs text-destructive">{errors.city.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            placeholder="Odisha"
            className={fieldClassName}
            aria-invalid={!!errors.state}
            {...register("state")}
          />
          {errors.state ? (
            <p className="text-xs text-destructive">{errors.state.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="pincode">Postal Code</Label>
          <Input
            id="pincode"
            inputMode="numeric"
            placeholder="751024"
            className={fieldClassName}
            aria-invalid={!!errors.pincode}
            {...register("pincode")}
          />
          {errors.pincode ? (
            <p className="text-xs text-destructive">{errors.pincode.message}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
