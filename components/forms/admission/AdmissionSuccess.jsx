"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { classCatalog, fitnessClasses } from "@/config/classes";
import { pricingPlans } from "@/config/pricing";
import { siteConfig } from "@/config/site";

function lookupName(list, slug) {
  return list.find((item) => item.slug === slug)?.name ?? slug;
}

// Confirmation screen shown after the enrollment form is submitted.
export default function AdmissionSuccess({ values }) {
  const className = lookupName([...classCatalog, ...fitnessClasses], values.classInterest);
  const planName = lookupName(pricingPlans, values.plan);

  const message = `Hi ASM! I just completed the enrollment form for ${values.firstName} ${values.lastName} — ${className}, ${planName} plan. Looking forward to getting started!`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto flex max-w-lg flex-col items-center py-10 text-center"
    >
      <CheckCircle2 className="size-16 text-brand-lime" strokeWidth={1.5} />
      <h2 className="h2-display mt-6 text-balance">Welcome to ASM!</h2>
      <p className="mt-3 text-muted-foreground">
        {values.firstName}&apos;s enrollment is in. Our team will reach out on{" "}
        <span className="font-medium text-foreground">{values.phone}</span> to
        finish setting up the batch and fees.
      </p>

      <div className="glass mt-8 w-full rounded-2xl p-6 text-left text-sm">
        <p className="flex justify-between py-1.5">
          <span className="text-muted-foreground">Student</span>
          <span className="font-medium">
            {values.firstName} {values.lastName}
          </span>
        </p>
        <p className="flex justify-between py-1.5">
          <span className="text-muted-foreground">Class</span>
          <span className="font-medium">{className}</span>
        </p>
        <p className="flex justify-between py-1.5">
          <span className="text-muted-foreground">Plan</span>
          <span className="font-medium">{planName}</span>
        </p>
      </div>

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
        <Button
          asChild
          className="h-12 flex-1 gap-2 rounded-full bg-whatsapp font-bold text-white hover:bg-whatsapp/90"
        >
          <a
            href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noreferrer noopener"
          >
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
