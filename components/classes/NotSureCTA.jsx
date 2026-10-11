"use client";

import Link from "next/link";
import BookingLink from "@/components/shared/BookingLink";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudioSettings } from "@/lib/useStudioSettings";

// "Not sure which class?" gradient promo card.
export default function NotSureCTA() {
  const settings = useStudioSettings();
  const whatsapp = settings?.whatsapp;

  return (
    <section className="container-page pb-20 md:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "120px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-gradient-brand flex flex-col items-start gap-8 rounded-3xl p-8 sm:p-10 md:flex-row md:items-center md:justify-between md:rounded-4xl md:p-12"
      >
        <div>
          <h2 className="h2-display text-2xl text-white uppercase md:text-3xl">
            Not Sure Which Class?
          </h2>
          <p className="mt-3 max-w-md text-white/85">
            Join our 3-day orientation workshop or book a single free trial
            class to find your perfect rhythm.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row md:flex-col">
          <Button
            asChild
            className="h-12 rounded-full bg-white px-8 font-bold text-foreground hover:bg-white/90"
          >
            <BookingLink href="/book-trial">Book Free Trial</BookingLink>
          </Button>
          {whatsapp ? (
            <Button
              asChild
              variant="outline"
              className="h-12 gap-2 rounded-full border-2 border-white bg-transparent px-8 font-bold text-white hover:bg-white hover:text-foreground"
            >
              <Link href={`https://wa.me/${whatsapp}`}>
                <MessageCircle className="size-4" />
                Chat with Us
              </Link>
            </Button>
          ) : null}
        </div>
      </motion.div>
    </section>
  );
}
