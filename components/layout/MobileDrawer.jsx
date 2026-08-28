"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

// Mobile navigation drawer for the public site, toggled from <Navbar>.
export default function MobileDrawer({ open, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="glass fixed inset-y-0 right-0 z-50 flex w-[80%] max-w-sm flex-col gap-8 border-l border-white/10 bg-background/95 p-6 lg:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-bold text-gradient-brand">
                ASM
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex size-10 items-center justify-center rounded-full text-foreground"
              >
                <X className="size-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {siteConfig.navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="rounded-lg px-3 py-3 text-lg font-medium text-foreground/90 transition-colors hover:bg-white/5"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Button
              asChild
              className="mt-auto h-12 rounded-full bg-brand-lime font-bold text-background hover:bg-brand-lime/90"
            >
              <Link href="/book-trial" onClick={onClose}>
                Book Free Trial
              </Link>
            </Button>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
