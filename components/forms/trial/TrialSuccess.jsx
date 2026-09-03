"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, CalendarPlus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { classCatalog, fitnessClasses } from "@/config/classes";
import { useStudioSettings } from "@/lib/useStudioSettings";

const TIME_START_HOUR = { morning: 9, afternoon: 12, evening: 16, night: 19 };
const TIME_LABEL = {
  morning: "Morning (9 - 11 AM)",
  afternoon: "Afternoon (12 - 3 PM)",
  evening: "Evening (4 - 7 PM)",
  night: "Night (7 - 9 PM)",
};

function interestName(slug, services = []) {
  const service = services.find((s) => s.slug === slug);
  if (service) return service.name;
  const all = [...classCatalog, ...fitnessClasses];
  return all.find((c) => c.slug === slug)?.name ?? slug;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function googleCalendarHref(values, services, address) {
  const startHour = TIME_START_HOUR[values.timeSlot] ?? 9;
  const start = new Date(`${values.date}T${pad(startHour)}:00:00`);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const fmt = (d) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(
      d.getMinutes()
    )}00`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `ASM Dance Studio — ${interestName(values.interest, services)} Trial Class`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `Free trial class for ${interestName(values.interest, services)} at ASM Dance Studio.`,
  });
  if (address) params.set("location", address);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function whatsappHref(values, services, whatsapp) {
  const timeLabel = TIME_LABEL[values.timeSlot] ?? values.timeSlot;
  const message = `Hi ASM! I just booked a free trial for ${interestName(
    values.interest,
    services
  )} on ${values.date} (${timeLabel}). Looking forward to it!`;
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}

// Confirmation screen shown after the trial booking form is submitted.
export default function TrialSuccess({ values, services = [] }) {
  const settings = useStudioSettings();
  const address = settings?.address || null;
  const whatsapp = settings?.whatsapp || null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto flex max-w-lg flex-col items-center text-center"
    >
      <CheckCircle2 className="size-16 text-brand-lime-ink" strokeWidth={1.5} />
      <h2 className="h2-display mt-6 text-balance">You&apos;re all set!</h2>
      <p className="mt-3 text-muted-foreground">
        We&apos;ve saved your trial request. Our team will reach out on{" "}
        <span className="font-medium text-foreground">{values.phone}</span> to
        confirm your slot.
      </p>

      <div className="glass mt-8 w-full rounded-2xl p-6 text-left text-sm">
        <p className="flex justify-between py-1.5">
          <span className="text-muted-foreground">Class</span>
          <span className="font-medium">{interestName(values.interest, services)}</span>
        </p>
        <p className="flex justify-between py-1.5">
          <span className="text-muted-foreground">Date</span>
          <span className="font-medium">{values.date}</span>
        </p>
        <p className="flex justify-between py-1.5">
          <span className="text-muted-foreground">Time</span>
          <span className="font-medium">{TIME_LABEL[values.timeSlot] ?? values.timeSlot}</span>
        </p>
      </div>

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
        <Button
          asChild
          variant="outline"
          className="h-16 w-full gap-2 rounded-full border-border text-base font-bold sm:flex-1"
        >
          <a href={googleCalendarHref(values, services, address)} target="_blank" rel="noreferrer noopener">
            <CalendarPlus className="size-4" />
            Add to Calendar
          </a>
        </Button>
        {whatsapp ? (
          <Button
            asChild
            className="h-16 w-full gap-2 rounded-full bg-whatsapp text-base font-bold text-white hover:bg-whatsapp/90 sm:flex-1"
          >
            <a href={whatsappHref(values, services, whatsapp)} target="_blank" rel="noreferrer noopener">
              <MessageCircle className="size-4" />
              WhatsApp Us
            </a>
          </Button>
        ) : null}
      </div>
    </motion.div>
  );
}
