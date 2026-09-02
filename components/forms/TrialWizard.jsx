"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trialSchema, trialStepFields, trialDefaultValues } from "@/lib/validations/trial";
import StepWhoFor from "@/components/forms/trial/StepWhoFor";
import StepExperience from "@/components/forms/trial/StepExperience";
import StepInterest from "@/components/forms/trial/StepInterest";
import StepSchedule from "@/components/forms/trial/StepSchedule";
import StepDetails from "@/components/forms/trial/StepDetails";
import StepConfirm from "@/components/forms/trial/StepConfirm";
import TrialSuccess from "@/components/forms/trial/TrialSuccess";
import { useCloseRoute } from "@/lib/useCloseRoute";

const STEPS = [
  { key: 1, label: "Who Is This For?" },
  { key: 2, label: "Experience Level" },
  { key: 3, label: "Choose Style" },
  { key: 4, label: "Select Time" },
  { key: 5, label: "Your Details" },
  { key: 6, label: "Confirm" },
];

const TOTAL_STEPS = STEPS.length;

const variants = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction > 0 ? -24 : 24 }),
};

// Multi-step form for booking a trial class. `onClose`, when provided (i.e.
// rendered inside BookingModalProvider's popup), closes just the popup;
// otherwise this falls back to router-based "go back" for the standalone
// /book-trial page.
export default function TrialWizard({ onClose }) {
  const closeRoute = useCloseRoute();
  const close = onClose || closeRoute;
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [success, setSuccess] = useState(false);
  const [submittedValues, setSubmittedValues] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [services, setServices] = useState([]);
  const scrollBodyRef = useRef(null);

  // Real, admin-managed Service records — used so the fitness options and
  // their time slots shown in this wizard always match the /services page,
  // instead of the separate static config/classes.js catalog.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/services")
      .then((res) => (res.ok ? res.json() : { services: [] }))
      .then((body) => {
        if (!cancelled) setServices(body.services ?? []);
      })
      .catch(() => {
        // network hiccup — fitness options just fall back to empty
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const {
    register,
    control,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(trialSchema),
    mode: "onChange",
    defaultValues: trialDefaultValues,
  });

  const values = useWatch({ control });

  const canContinue = {
    1: !!values.bookingFor,
    2: !!values.experienceLevel && !!values.ageGroup,
    3: !!values.interest,
    4: !!values.date && !!values.timeSlot,
    5: true,
    6: true,
  }[step];

  function set(field, value) {
    setValue(field, value, { shouldValidate: true });
  }

  function goTo(nextStep) {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
    if (scrollBodyRef.current) scrollBodyRef.current.scrollTop = 0;
  }

  async function handleContinue() {
    if (step === TOTAL_STEPS) {
      const valid = await trigger();
      if (!valid) return;

      const formValues = getValues();
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const res = await fetch("/api/trial-bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error || "Something went wrong. Please try again.");
        }

        setSubmittedValues(formValues);
        setSuccess(true);
      } catch (err) {
        setSubmitError(err.message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    const valid = await trigger(trialStepFields[step]);
    if (valid) goTo(step + 1);
  }

  if (success) {
    return (
      <div className="w-full min-h-0 max-h-full">
        <div className="relative mx-auto w-full max-w-2xl min-h-0 max-h-full overflow-x-hidden">
          <div
            aria-hidden
            className="bg-gradient-brand absolute -inset-16 -z-10 rounded-full opacity-[0.12] blur-[100px]"
          />
          <div className="relative max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain rounded-3xl border-2 border-border-strong bg-popover p-6 shadow-2xl sm:p-10">
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-6 right-6 z-10 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <X className="size-5" />
            </button>
            <TrialSuccess values={submittedValues} services={services} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-0 max-h-full">
      <div className="relative mx-auto w-full max-w-4xl min-h-0 max-h-full overflow-x-hidden">
        <div
          aria-hidden
          className="bg-gradient-brand absolute -inset-16 -z-10 rounded-full opacity-[0.12] blur-[100px]"
        />

        <div className="relative flex max-h-[calc(100dvh-2rem)] w-full min-h-0 flex-col overflow-hidden rounded-3xl border-2 border-border-strong bg-popover shadow-2xl">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-6 right-6 z-10 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <X className="size-5" />
          </button>

          <div className="flex flex-1 min-h-0 flex-col lg:flex-row">
            {/* Sidebar stepper — desktop only */}
            <div className="hidden w-64 shrink-0 flex-col border-r border-border p-8 lg:flex">
              <p className="font-display text-lg font-bold">Book Free Trial</p>
              <ol className="relative mt-8 flex flex-col gap-6">
                <span
                  aria-hidden
                  className="absolute top-2 bottom-2 left-[9px] w-px bg-border"
                />
                {STEPS.map((s) => {
                  const state =
                    s.key < step ? "done" : s.key === step ? "active" : "upcoming";
                  return (
                    <li key={s.key} className="relative flex items-center gap-3">
                      <span
                        className={cn(
                          "z-10 flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                          state === "done" && "border-brand-lime bg-brand-lime text-background",
                          state === "active" && "border-brand-lime bg-background",
                          state === "upcoming" && "border-border bg-background"
                        )}
                      >
                        {state === "done" ? <Check className="size-3" strokeWidth={3} /> : null}
                        {state === "active" ? (
                          <span className="size-2 rounded-full bg-brand-lime" />
                        ) : null}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-bold tracking-wide uppercase",
                          state === "upcoming" ? "text-muted-foreground" : "text-foreground"
                        )}
                      >
                        {s.label}
                      </span>
                    </li>
                  );
                })}
              </ol>

              <p className="mt-auto pt-8 text-xs text-muted-foreground">
                Need help?{" "}
                <Link href="/contact" className="text-brand-lime underline underline-offset-2">
                  Contact Support
                </Link>
              </p>
            </div>

            {/* Mobile progress bar */}
            <div className="shrink-0 border-b border-border p-6 lg:hidden">
              <p className="text-xs font-bold text-muted-foreground">
                Step {step} of {TOTAL_STEPS} — {STEPS[step - 1].label}
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="bg-brand-lime h-full rounded-full"
                />
              </div>
            </div>

            {/* Step content */}
            <div className="flex flex-1 min-h-0 flex-col">
              <div
                ref={scrollBodyRef}
                className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-6 sm:p-10"
              >
                <div className="sm:min-h-[360px]">
                  <AnimatePresence mode="wait" custom={direction} initial={false}>
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {step === 1 ? (
                        <StepWhoFor
                          value={values.bookingFor}
                          onChange={(v) => set("bookingFor", v)}
                        />
                      ) : null}
                      {step === 2 ? (
                        <StepExperience
                          experienceLevel={values.experienceLevel}
                          ageGroup={values.ageGroup}
                          onExperienceChange={(v) => set("experienceLevel", v)}
                          onAgeChange={(v) => set("ageGroup", v)}
                        />
                      ) : null}
                      {step === 3 ? (
                        <StepInterest
                          value={values.interest}
                          onChange={(v) => set("interest", v)}
                          services={services}
                        />
                      ) : null}
                      {step === 4 ? (
                        <StepSchedule
                          date={values.date}
                          timeSlot={values.timeSlot}
                          interest={values.interest}
                          services={services}
                          onDateChange={(v) => set("date", v)}
                          onTimeSlotChange={(v) => set("timeSlot", v)}
                          error={errors.date?.message}
                        />
                      ) : null}
                      {step === 5 ? <StepDetails register={register} errors={errors} /> : null}
                      {step === 6 ? (
                        <StepConfirm values={values} onEdit={goTo} services={services} />
                      ) : null}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {submitError ? (
                  <p className="mt-4 text-sm font-medium text-destructive">{submitError}</p>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border p-6 pt-4 sm:px-10">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => goTo(step - 1)}
                    className="rounded-full"
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                ) : (
                  <span />
                )}
                <Button
                  type="button"
                  onClick={handleContinue}
                  disabled={!canContinue || isSubmitting}
                  className="h-12 gap-2 rounded-full px-8 font-bold disabled:opacity-40"
                >
                  {step === TOTAL_STEPS
                    ? isSubmitting
                      ? "Booking..."
                      : "Confirm Booking"
                    : `Continue to Step ${step + 1}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
