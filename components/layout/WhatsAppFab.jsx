"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

// Floating WhatsApp contact button shown on all public pages.
export default function WhatsAppFab() {
  return (
    <motion.a
      href={`https://wa.me/${siteConfig.whatsapp}`}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat on WhatsApp"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed right-6 bottom-6 z-40 flex size-16 items-center justify-center rounded-full bg-whatsapp text-white shadow-2xl sm:right-10 sm:bottom-10"
    >
      <MessageCircle className="size-8" fill="currentColor" strokeWidth={0} />
    </motion.a>
  );
}
