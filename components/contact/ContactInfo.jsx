"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

const ROWS = [
  {
    icon: MapPin,
    label: "Our Address",
    lines: [siteConfig.address.full],
  },
  {
    icon: Phone,
    label: "Call Us",
    lines: [siteConfig.phone],
  },
  {
    icon: Mail,
    label: "Email Us",
    lines: [siteConfig.email],
  },
  {
    icon: Clock,
    label: "Opening Hours",
    lines: [siteConfig.hours.weekdays, siteConfig.hours.weekend],
  },
];

// Studio details panel + WhatsApp CTA.
export default function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      className="flex h-full flex-col"
    >
      <p className="eyebrow">Studio Details</p>

      <div className="mt-8 flex flex-col gap-6">
        {ROWS.map((row) => (
          <div key={row.label} className="flex gap-4">
            <span className="glass flex size-11 shrink-0 items-center justify-center rounded-full text-brand-mid">
              <row.icon className="size-5" />
            </span>
            <div>
              <p className="font-medium">{row.label}</p>
              {row.lines.map((line) => (
                <p key={line} className="mt-1 text-sm text-muted-foreground">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <a
        href={`https://wa.me/${siteConfig.whatsapp}`}
        target="_blank"
        rel="noreferrer noopener"
        className="mt-10 flex h-14 items-center justify-center gap-2 rounded-full bg-whatsapp px-8 font-bold text-white transition-colors hover:bg-whatsapp/90"
      >
        <MessageCircle className="size-4" />
        Chat on WhatsApp
      </a>
    </motion.div>
  );
}
