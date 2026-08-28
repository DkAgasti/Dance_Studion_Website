"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, User, Users, IdCard, GraduationCap, CreditCard, ShieldPlus, CheckCircle2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  admissionSchema,
  admissionStepFields,
  admissionDefaultValues,
} from "@/lib/validations/admission";
import StepStudentDetails from "@/components/forms/admission/StepStudentDetails";
import StepGuardianInfo from "@/components/forms/admission/StepGuardianInfo";
import StepContactDetails from "@/components/forms/admission/StepContactDetails";
import StepClassSelection from "@/components/forms/admission/StepClassSelection";
import StepPlanSelection from "@/components/forms/admission/StepPlanSelection";
import StepMedicalConsent from "@/components/forms/admission/StepMedicalConsent";
import AdmissionSuccess from "@/components/forms/admission/AdmissionSuccess";
import { uploadFile } from "@/lib/uploadClient";

const STEPS = [
  { key: 1, label: "Student Details", icon: User },
  { key: 2, label: "Guardian Info", icon: Users },
  { key: 3, label: "Contact Details", icon: IdCard },
  { key: 4, label: "Class Selection", icon: GraduationCap },
  { key: 5, label: "Plan Selection", icon: CreditCard },
  { key: 6, label: "Medical Consent", icon: ShieldPlus },
  { key: 7, label: "Success", icon: CheckCircle2 },
];

const TOTAL_STEPS = 6;
const STORAGE_KEY = "asm-admission-progress";

const variants = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction > 0 ? -24 : 24 }),
};

// Multi-step enrollment/admission form.
export default function AdmissionForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [success, setSuccess] = useState(false);
  const [submittedValues, setSubmittedValues] = useState(null);
  const [saveLabel, setSaveLabel] = useState("Save Progress");
  const [photoFile, setPhotoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    control,
    setValue,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(admissionSchema),
    mode: "onChange",
    defaultValues: admissionDefaultValues,
  });

  const values = useWatch({ control });

  // Preselect a plan passed in from the pricing page (?plan=standard), and
  // restore any progress saved locally.
  useEffect(() => {
    const planFromQuery = searchParams.get("plan");
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        reset(JSON.parse(saved));
        return;
      } catch {
        // ignore corrupt saved state
      }
    }
    if (planFromQuery) {
      setValue("plan", planFromQuery, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function set(field, value) {
    setValue(field, value, { shouldValidate: true });
  }

  function goTo(nextStep) {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
  }

  function saveProgress() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(getValues()));
    setSaveLabel("Saved!");
    setTimeout(() => setSaveLabel("Save Progress"), 1800);
  }

  async function handleContinue() {
    if (step === TOTAL_STEPS) {
      const valid = await trigger();
      if (!valid) return;

      const formValues = getValues();
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        let photoUrl;
        if (photoFile) {
          const uploaded = await uploadFile(photoFile, "admissions");
          photoUrl = uploaded.url;
        }

        const res = await fetch("/api/admissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formValues, photoUrl }),
        });

        if (!res.ok) {
          const resBody = await res.json().catch(() => null);
          throw new Error(resBody?.error || "Something went wrong. Please try again.");
        }

        window.localStorage.removeItem(STORAGE_KEY);
        setSubmittedValues(formValues);
        setSuccess(true);
      } catch (err) {
        setSubmitError(err.message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    const valid = await trigger(admissionStepFields[step]);
    if (valid) goTo(step + 1);
  }

  if (success) {
    return (
      <div className="container-page pt-40 pb-20 md:pt-52">
        <AdmissionSuccess values={submittedValues} />
      </div>
    );
  }

  return (
    <div className="container-page pt-32 pb-20 md:pt-44">
      <div className="relative mx-auto max-w-4xl">
        <div
          aria-hidden
          className="bg-gradient-brand absolute -inset-16 -z-10 rounded-full opacity-[0.12] blur-[100px]"
        />

        <div className="glass-strong relative overflow-hidden rounded-3xl">
          <Link
            href="/"
            aria-label="Close"
            className="absolute top-6 right-6 z-10 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <X className="size-5" />
          </Link>

          <div className="flex flex-col lg:flex-row">
            {/* Sidebar stepper — desktop only */}
            <div className="hidden w-64 shrink-0 flex-col border-r border-border p-8 lg:flex">
              <p className="font-display text-lg font-bold">Admission Form</p>
              <p className="text-xs text-muted-foreground">Enrollment Portal 2024</p>

              <ol className="mt-8 flex flex-col gap-2">
                {STEPS.map((s) => {
                  const state =
                    s.key < step ? "done" : s.key === step ? "active" : "upcoming";
                  return (
                    <li key={s.key}>
                      <span
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold tracking-wide uppercase",
                          state === "active" && "bg-brand-lime/10 text-brand-lime",
                          state === "done" && "text-foreground",
                          state === "upcoming" && "text-muted-foreground"
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-6 shrink-0 items-center justify-center rounded-full",
                            state === "active" && "bg-brand-lime text-background",
                            state === "done" && "bg-white/10 text-foreground",
                            state === "upcoming" && "bg-white/5 text-muted-foreground"
                          )}
                        >
                          {state === "done" ? (
                            <Check className="size-3.5" strokeWidth={3} />
                          ) : (
                            <s.icon className="size-3.5" />
                          )}
                        </span>
                        {s.label}
                      </span>
                    </li>
                  );
                })}
              </ol>

              <Button
                type="button"
                variant="outline"
                onClick={saveProgress}
                className="mt-auto gap-2 rounded-full border-border"
              >
                <Save className="size-3.5" />
                {saveLabel}
              </Button>
            </div>

            {/* Mobile progress bar */}
            <div className="border-b border-border p-6 lg:hidden">
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
            <div className="flex flex-1 flex-col p-6 sm:p-10">
              <div className="min-h-[400px] overflow-hidden">
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
                      <StepStudentDetails
                        register={register}
                        errors={errors}
                        photoName={values.photoName}
                        onPhotoChange={(name, file) => {
                          set("photoName", name);
                          setPhotoFile(file);
                        }}
                      />
                    ) : null}
                    {step === 2 ? (
                      <StepGuardianInfo register={register} errors={errors} />
                    ) : null}
                    {step === 3 ? (
                      <StepContactDetails register={register} errors={errors} />
                    ) : null}
                    {step === 4 ? (
                      <StepClassSelection
                        value={values.classInterest}
                        onChange={(v) => set("classInterest", v)}
                        register={register}
                      />
                    ) : null}
                    {step === 5 ? (
                      <StepPlanSelection value={values.plan} onChange={(v) => set("plan", v)} />
                    ) : null}
                    {step === 6 ? (
                      <StepMedicalConsent
                        register={register}
                        errors={errors}
                        consent={values.medicalConsent}
                        onConsentChange={(v) => set("medicalConsent", v)}
                      />
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </div>

              {submitError ? (
                <p className="mt-4 text-sm font-medium text-destructive">{submitError}</p>
              ) : null}

              <div className="mt-8 flex items-center justify-between gap-4">
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
                  disabled={isSubmitting}
                  className="h-12 gap-2 rounded-full px-8 font-bold disabled:opacity-40"
                >
                  {step === TOTAL_STEPS
                    ? isSubmitting
                      ? "Submitting..."
                      : "Complete Enrollment"
                    : "Next Step"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
