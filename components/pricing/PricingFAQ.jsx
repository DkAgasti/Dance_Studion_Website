"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "Are there any family discounts?",
    answer:
      "Yes — enroll a second sibling and get 15% off their plan for as long as both stay enrolled. Just mention it at the front desk when signing up.",
  },
  {
    question: "Can I get a refund if I miss classes?",
    answer:
      "We don't refund missed classes, but you can freeze your plan for up to 2 weeks a term or make up a missed session in another open batch.",
  },
  {
    question: "Is there a registration fee?",
    answer:
      "There's a one-time ₹500 registration fee for new students, covering your student profile and first uniform kit. Renewals have no registration fee.",
  },
];

// "Pricing FAQs" accordion.
export default function PricingFAQ() {
  return (
    <section className="container-page pb-20 md:pb-28">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "120px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="h2-display text-2xl text-center uppercase md:text-3xl"
      >
        Pricing <span className="text-brand-lime-ink">FAQs</span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "120px" }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="mx-auto mt-12 max-w-2xl"
      >
        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {FAQS.map((faq) => (
            <AccordionItem
              key={faq.question}
              value={faq.question}
              className="glass rounded-2xl border-none px-6"
            >
              <AccordionTrigger className="py-5 text-xs font-bold tracking-wide uppercase hover:no-underline [&_svg]:text-brand-lime-ink">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}
