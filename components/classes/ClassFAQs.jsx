"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// "Class FAQs" — per-class accordion, from DanceClass.faqs.
export default function ClassFAQs({ faqs = [] }) {
  if (!faqs.length) return null;

  return (
    <section className="container-page pb-20 md:pb-28">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h2-display text-center"
      >
        Class <span className="text-brand-lime">FAQs</span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="mx-auto mt-12 max-w-2xl"
      >
        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.q}
              value={faq.q}
              className="glass rounded-2xl border-none px-6"
            >
              <AccordionTrigger className="py-5 text-xs font-bold tracking-wide uppercase hover:no-underline [&_svg]:text-brand-lime">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}
