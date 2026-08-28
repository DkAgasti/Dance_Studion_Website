"use client";

import StepHeading from "@/components/forms/trial/StepHeading";
import Chip from "@/components/forms/trial/Chip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TIME_SLOTS = [
  { key: "morning", label: "Morning", description: "9 - 11 AM" },
  { key: "afternoon", label: "Afternoon", description: "12 - 3 PM" },
  { key: "evening", label: "Evening", description: "4 - 7 PM" },
  { key: "night", label: "Night", description: "7 - 9 PM" },
];

export default function StepSchedule({
  date,
  timeSlot,
  onDateChange,
  onTimeSlotChange,
  error,
}) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <StepHeading step={4} total={6} title="When works for you?" />

      <div className="mt-8 flex flex-col gap-2">
        <Label htmlFor="trial-date">Preferred Date</Label>
        <Input
          id="trial-date"
          type="date"
          min={today}
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="h-12 w-full max-w-xs rounded-xl border-border bg-white/[0.04] px-4"
        />
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>

      <div className="mt-8">
        <p className="eyebrow">Preferred Time</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TIME_SLOTS.map((slot) => (
            <Chip
              key={slot.key}
              label={slot.label}
              description={slot.description}
              selected={timeSlot === slot.key}
              onClick={() => onTimeSlotChange(slot.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
