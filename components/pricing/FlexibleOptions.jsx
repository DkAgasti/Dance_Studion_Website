"use client";

import { motion } from "framer-motion";
import { Zap, Users, Camera } from "lucide-react";

const OPTIONS = [
  {
    name: "Drop-in Class",
    description: "Just want one session?",
    price: 500,
    unit: "class",
    icon: Zap,
  },
  {
    name: "1-on-1 Session",
    description: "Personal focus on technique.",
    price: 1500,
    unit: "hour",
    icon: Users,
  },
  {
    name: "Studio Rental",
    description: "Rent our floor for practice.",
    price: 800,
    unit: "hour",
    icon: Camera,
  },
];

// "Flexible Options" add-ons row.
export default function FlexibleOptions() {
  return (
    <section className="container-page pb-20 md:pb-28">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "120px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="h2-display text-center uppercase"
      >
        Flexible <span className="text-brand-end">Options</span>
      </motion.h2>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {OPTIONS.map((option, i) => (
          <motion.div
            key={option.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "90px" }}
            transition={{ duration: 0.35, delay: i * 0.08, ease: "easeOut" }}
            className="glass-tile rounded-2xl p-6 text-center transition-transform hover:-translate-y-1"
          >
            <div className="glass mx-auto flex size-12 items-center justify-center rounded-full">
              <option.icon className="size-5 text-brand-mid" />
            </div>
            <h3 className="mt-4 font-medium">{option.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {option.description}
            </p>
            <p className="mt-4 font-display text-2xl font-bold">
              ₹{option.price}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / {option.unit}
              </span>
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
