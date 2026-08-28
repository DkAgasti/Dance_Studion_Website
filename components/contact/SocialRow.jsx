"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

// lucide-react dropped brand/logo marks, so socials render as short labels
// inside the glass badge rather than invented icon glyphs (same treatment
// as the site footer).
const SOCIALS = [
  { key: "instagram", label: "IG", name: "Instagram", href: siteConfig.socials.instagram },
  { key: "facebook", label: "FB", name: "Facebook", href: siteConfig.socials.facebook },
  { key: "youtube", label: "YT", name: "YouTube", href: siteConfig.socials.youtube },
  { key: "twitter", label: "X", name: "Twitter", href: siteConfig.socials.twitter },
];

// "Follow Our Moves" social icons row.
export default function SocialRow() {
  return (
    <section className="container-page pb-20 text-center md:pb-28">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h3-display uppercase"
      >
        Follow Our Moves
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="mt-8 flex items-center justify-center gap-6"
      >
        {SOCIALS.map((social) => (
          <a
            key={social.key}
            href={social.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={social.name}
            className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="glass flex size-12 items-center justify-center rounded-full text-sm font-bold">
              {social.label}
            </span>
            <span className="text-[10px] font-bold tracking-wide uppercase">
              {social.name}
            </span>
          </a>
        ))}
      </motion.div>
    </section>
  );
}
