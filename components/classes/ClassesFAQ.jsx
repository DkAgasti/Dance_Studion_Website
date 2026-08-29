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
    question: "What is the minimum age to join?",
    answer:
      "Our Kids program welcomes dancers from age 5. Teen and adult classes are open to anyone 13 and up — there's no upper age limit.",
  },
  {
    question: "Do I need prior dance experience?",
    answer:
      "Not at all. Most of our classes have a Beginner or Open level, and our trainers tailor pace and combinations to whoever's in the room that day.",
  },
  {
    question: "What should I wear for the first class?",
    answer:
      "Comfortable, stretchy clothing and clean indoor shoes or bare feet (style-dependent) are perfect. We'll let you know if a specific class needs anything extra.",
  },
  {
    question: "What are the fees for different plans?",
    answer:
      "Pricing depends on how many classes a week you want and which styles you're mixing. Book a free trial and our team will walk you through the plan that fits best.",
  },
];

// "Common Questions" FAQ accordion.
export default function ClassesFAQ() {
  return (
    <section className="container-page pb-20 md:pb-28">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h2-display text-2xl text-center uppercase md:text-3xl"
      >
        Common Questions
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="mx-auto mt-12 max-w-2xl"
      >
        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {FAQS.map((faq) => (
            <AccordionItem
              key={faq.question}
              value={faq.question}
              className="glass rounded-2xl border-none px-6"
            >
              <AccordionTrigger className="py-5 text-xs font-bold tracking-wide uppercase hover:no-underline [&_svg]:text-brand-lime">
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
