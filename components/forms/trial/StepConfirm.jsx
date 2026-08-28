"use client";

import StepHeading from "@/components/forms/trial/StepHeading";
import { classCatalog, fitnessClasses } from "@/config/classes";

const BOOKING_FOR_LABEL = { myself: "Just Me", "someone-else": "Someone Else" };
const EXPERIENCE_LABEL = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };
const AGE_LABEL = { kids: "Kids (5-12)", teens: "Teens (13-19)", adults: "Adults (20+)" };
const TIME_LABEL = {
  morning: "Morning (9 - 11 AM)",
  afternoon: "Afternoon (12 - 3 PM)",
  evening: "Evening (4 - 7 PM)",
  night: "Night (7 - 9 PM)",
};

function interestName(slug) {
  const all = [...classCatalog, ...fitnessClasses];
  return all.find((c) => c.slug === slug)?.name ?? slug;
}

function formatDate(value) {
  if (!value) return "";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function StepConfirm({ values, onEdit }) {
  const rows = [
    { label: "Booking For", value: BOOKING_FOR_LABEL[values.bookingFor], step: 1 },
    {
      label: "Experience & Age",
      value: `${EXPERIENCE_LABEL[values.experienceLevel]} · ${AGE_LABEL[values.ageGroup]}`,
      step: 2,
    },
    { label: "Interest", value: interestName(values.interest), step: 3 },
    {
      label: "Date & Time",
      value: `${formatDate(values.date)} · ${TIME_LABEL[values.timeSlot]}`,
      step: 4,
    },
    {
      label: "Contact",
      value: `${values.name} · ${values.phone}${values.email ? ` · ${values.email}` : ""}`,
      step: 5,
    },
  ];

  return (
    <div>
      <StepHeading
        step={6}
        total={6}
        title="Review &amp; confirm."
        subtitle="Take a quick look before we lock in your trial."
      />

      <div className="glass mt-8 flex flex-col divide-y divide-border rounded-2xl">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="eyebrow !text-[10px]">{row.label}</p>
              <p className="mt-1 text-sm font-medium text-foreground/90">{row.value}</p>
            </div>
            <button
              type="button"
              onClick={() => onEdit(row.step)}
              className="shrink-0 text-xs font-bold text-brand-lime hover:underline"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
