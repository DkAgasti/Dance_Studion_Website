"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingLink from "@/components/shared/BookingLink";
import { useStudioSettings } from "@/lib/useStudioSettings";

// "About This Class" + "What You'll Learn" (main column) alongside a sticky
// "Book Your Spot" card — the section right under the class hero.
export default function AboutClass({ classItem, batches }) {
  const settings = useStudioSettings();
  const whatsapp = settings?.whatsapp;
  const description = classItem.longDescription || classItem.description;
  const learn = classItem.whatYoullLearn ?? [];
  const startingPrice = batches.length ? Math.min(...batches.map((b) => b.price)) : null;

  if (!description && !learn.length) return null;

  return (
    <section className="container-page pb-20 md:pb-28">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "120px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="lg:col-span-2"
        >
          {description ? (
            <>
              <h2 className="h2-display">
                About This <span className="text-brand-lime-ink">Class</span>
              </h2>
              <div className="mt-6 max-w-2xl space-y-4 whitespace-pre-line text-muted-foreground">
                {description}
              </div>
            </>
          ) : null}

          {learn.length ? (
            <div className={description ? "mt-12" : ""}>
              <h3 className="h3-display">
                What You&apos;ll <span className="text-brand-mid">Learn</span>
              </h3>
              <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {learn.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-foreground/90">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-lime-tint text-brand-lime-ink">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "120px" }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="glass flex flex-col rounded-3xl p-8"
        >
          <h3 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
            Book Your Spot
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Join the next batch. Your first class is completely free.
          </p>

          {startingPrice ? (
            <p className="mt-6">
              <span className="text-xs text-muted-foreground">Starting from</span>
              <br />
              <span className="text-3xl font-bold text-foreground">
                ₹{startingPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-muted-foreground">/mo</span>
            </p>
          ) : null}

          <div className="mt-auto flex flex-col gap-3 pt-10">
            <Button
              asChild
              size="lg"
              className="bg-gradient-brand h-[52px] w-full rounded-full text-base font-bold text-white shadow-xl hover:brightness-110"
            >
              <BookingLink href="/book-trial">Book Free Trial</BookingLink>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-[52px] w-full rounded-full border-border text-base font-bold"
            >
              <BookingLink href="/admissions">Admissions</BookingLink>
            </Button>

            {whatsapp ? (
              <Link
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-1 block text-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Questions? Chat with us
              </Link>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
