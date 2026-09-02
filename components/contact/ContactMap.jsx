"use client";

import { motion } from "framer-motion";
import { useStudioSettings } from "@/lib/useStudioSettings";

// Full-width embedded map for the studio location (no API key needed) —
// uses the admin's custom embed URL (Admin > Settings > Social & Map) if
// one is set, otherwise falls back to a plain address-based embed built
// from the admin's Full Address. Renders nothing until at least one of
// those is actually set — no static siteConfig placeholder.
export default function ContactMap() {
  const settings = useStudioSettings();
  const mapSrc =
    settings?.mapEmbed ||
    (settings?.address
      ? `https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`
      : null);

  if (!mapSrc) return null;

  return (
    <section className="container-page pb-20 md:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="overflow-hidden rounded-3xl border border-border"
      >
        <iframe
          title="ASM Dance Studio location"
          src={mapSrc}
          className="h-[380px] w-full grayscale-[15%] sm:h-[420px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </motion.div>
    </section>
  );
}
