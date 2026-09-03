"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contactSchema } from "@/lib/validations/contact";

const fieldClassName =
  "h-12 rounded-xl border-border bg-foreground/[0.04] px-4 focus-visible:ring-ring/40";

// Contact page form — validated client-side, success state shown on submit
// (no backend yet).
export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", phone: "", email: "", message: "" },
  });

  async function onSubmit(data) {
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "120px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass rounded-3xl p-8 sm:p-10"
    >
      <h2 className="h3-display">
        Drop Us a <span className="text-brand-lime-ink">Line</span>
      </h2>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center gap-4 py-10 text-center"
          >
            <CheckCircle2 className="size-14 text-brand-lime-ink" strokeWidth={1.5} />
            <h3 className="h4-display">Message sent!</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Thanks for reaching out — our team will get back to you within
              one business day.
            </p>
            <Button
              variant="outline"
              className="mt-2 rounded-full border-border"
              onClick={() => setSubmitted(false)}
            >
              Send another message
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
            className="mt-8 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-name">Full Name</Label>
              <Input
                id="contact-name"
                placeholder="John Doe"
                className={fieldClassName}
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-phone">Phone</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="+91 00000 00000"
                  className={fieldClassName}
                  aria-invalid={!!errors.phone}
                  {...register("phone")}
                />
                {errors.phone ? (
                  <p className="text-xs text-destructive">{errors.phone.message}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="hello@example.com"
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
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                rows={4}
                placeholder="How can we help you?"
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
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
