"use client";

import { motion } from "framer-motion";

// Table of batch timings for a given class — day / time / trainer / seats / price.
export default function BatchTable({ batches }) {
  if (!batches?.length) return null;

  return (
    <section className="container-page pb-20 md:pb-28">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h2-display"
      >
        Batch <span className="text-brand-lime">Timings</span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="glass mt-10 overflow-x-auto rounded-2xl"
      >
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
              <th className="px-6 py-4">Day</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Trainer</th>
              <th className="px-6 py-4">Seats</th>
              <th className="px-6 py-4 text-right">Price/mo</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch, i) => (
              <tr
                key={`${batch.day}-${batch.time}`}
                className={i !== batches.length - 1 ? "border-b border-border" : ""}
              >
                <td className="px-6 py-4 text-sm font-medium">{batch.day}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{batch.time}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{batch.trainer}</td>
                <td className="px-6 py-4 text-sm font-bold text-brand-lime">
                  {batch.seats} Left
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  ₹{batch.price.toLocaleString("en-IN")}/mo
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </section>
  );
}
