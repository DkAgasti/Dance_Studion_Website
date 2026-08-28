"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, CalendarPlus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { classCatalog, fitnessClasses } from "@/config/classes";
import { siteConfig } from "@/config/site";

const TIME_START_HOUR = { morning: 9, afternoon: 12, evening: 16, night: 19 };
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

function pad(n) {
  return String(n).padStart(2, "0");
}

function googleCalendarHref(values) {
  const startHour = TIME_START_HOUR[values.timeSlot] ?? 9;
  const start = new Date(`${values.date}T${pad(startHour)}:00:00`);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const fmt = (d) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(
      d.getMinutes()
    )}00`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `ASM Dance Studio — ${interestName(values.interest)} Trial Class`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `Free trial class for ${interestName(values.interest)} at ASM Dance Studio.`,
    location: siteConfig.address.full,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function whatsappHref(values) {
  const message = `Hi ASM! I just booked a free trial for ${interestName(
    values.interest
  )} on ${values.date} (${TIME_LABEL[values.timeSlot]}). Looking forward to it!`;
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

// Confirmation screen shown after the trial booking form is submitted.
export default function TrialSuccess({ values }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto flex max-w-lg flex-col items-center py-10 text-center"
    >
      <CheckCircle2 className="size-16 text-brand-lime" strokeWidth={1.5} />
      <h2 className="h2-display mt-6 text-balance">You&apos;re all set!</h2>
      <p className="mt-3 text-muted-foreground">
        We&apos;ve saved your trial request. Our team will reach out on{" "}
        <span className="font-medium text-foreground">{values.phone}</span> to
        confirm your slot.
      </p>

      <div className="glass mt-8 w-full rounded-2xl p-6 text-left text-sm">
        <p className="flex justify-between py-1.5">
          <span className="text-muted-foreground">Class</span>
          <span className="font-medium">{interestName(values.interest)}</span>
        </p>
        <p className="flex justify-between py-1.5">
          <span className="text-muted-foreground">Date</span>
          <span className="font-medium">{values.date}</span>
        </p>
        <p className="flex justify-between py-1.5">
          <span className="text-muted-foreground">Time</span>
          <span className="font-medium">{TIME_LABEL[values.timeSlot]}</span>
        </p>
      </div>

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
        <Button asChild className="h-12 flex-1 gap-2 rounded-full font-bold">
          <a href={googleCalendarHref(values)} target="_blank" rel="noreferrer noopener">
            <CalendarPlus className="size-4" />
            Add to Calendar
          </a>
        </Button>
        <Button
          asChild
          className="h-12 flex-1 gap-2 rounded-full bg-whatsapp font-bold text-white hover:bg-whatsapp/90"
        >
          <a href={whatsappHref(values)} target="_blank" rel="noreferrer noopener">
            <MessageCircle className="size-4" />
            WhatsApp Us
          </a>
        </Button>
      </div>

      <Link
        href="/"
        className="mt-8 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Back to home
      </Link>
    </motion.div>
  );
}
