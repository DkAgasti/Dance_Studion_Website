"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Building2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { corporateSessionSchema } from "@/lib/validations/corporateSession";

const fieldClassName =
  "h-12 rounded-xl border-border bg-white/[0.04] px-4 focus-visible:ring-ring/40";

// "Request a Corporate Session" form — validated client-side, success state
// shown on submit (no backend yet).
export default function CorporateForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(corporateSessionSchema),
    defaultValues: { name: "", company: "", phone: "", email: "", message: "" },
  });

  async function onSubmit(data) {
    setSubmitError(null);
    try {
      const res = await fetch("/api/corporate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Something went wrong. Please try again.");
      }
      setSubmitted(true);
      reset();
    } catch (err) {
      setSubmitError(err.message);
    }
  }

  return (
    <section id="corporate-request" className="container-page section-y scroll-mt-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-strong mx-auto max-w-2xl rounded-3xl p-8 sm:p-12"
      >
        <div className="text-center">
          <p className="eyebrow text-brand-lime">Corporate Wellness</p>
          <h2 className="h2-display mt-4 text-balance">
            Request a Corporate <span className="text-brand-lime">Session</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Bring the energy of ASM to your workplace. Fill out the details
            and our wellness coordinator will reach out to design your
            custom program.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground sm:flex-row sm:gap-8">
            <span className="flex items-center gap-2">
              <Building2 className="size-4 text-brand-lime" />
              Tailored for 10-500+ employees
            </span>
            <span className="flex items-center gap-2">
              <Clock className="size-4 text-brand-lime" />
              Flexible scheduling (Weekday/Weekend)
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mt-10 flex flex-col items-center gap-4 py-6 text-center"
            >
              <CheckCircle2 className="size-14 text-brand-lime" strokeWidth={1.5} />
              <h3 className="h4-display">Request sent!</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Thanks for reaching out — our team will get back to you
                within one business day to plan your session.
              </p>
              <Button
                variant="outline"
                className="mt-2 rounded-full border-border"
                onClick={() => setSubmitted(false)}
              >
                Send another request
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="mt-10 flex flex-col gap-5"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    className={fieldClassName}
                    aria-invalid={!!errors.name}
                    {...register("name")}
                  />
                  {errors.name ? (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Acme Corp"
                    className={fieldClassName}
                    aria-invalid={!!errors.company}
                    {...register("company")}
                  />
                  {errors.company ? (
                    <p className="text-xs text-destructive">{errors.company.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@acmecorp.com"
                    className={fieldClassName}
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                  {errors.email ? (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  placeholder="Team size, preferred days, on-site or in-studio..."
                  className={fieldClassName + " h-auto min-h-32"}
                  aria-invalid={!!errors.message}
                  {...register("message")}
                />
                {errors.message ? (
                  <p className="text-xs text-destructive">{errors.message.message}</p>
                ) : null}
              </div>

              {submitError ? (
                <p className="text-sm font-medium text-destructive">{submitError}</p>
              ) : null}

              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="bg-gradient-brand mt-2 h-14 gap-2 rounded-full text-base font-bold text-white hover:brightness-110"
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                {isSubmitting ? "Sending..." : "Send Request"}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
