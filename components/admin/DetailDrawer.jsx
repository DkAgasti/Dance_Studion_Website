"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Slide-in drawer for admin list pages (Admissions, Trial Bookings) — shows
// the selected row's detail panel sliding in from the right edge, over the
// table, instead of pushing it down the page below the fold on mobile.
// Same treatment on mobile and desktop.
export default function DetailDrawer({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

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
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="pointer-events-none fixed inset-y-0 right-0 z-[71] w-full max-w-sm p-4 sm:max-w-md sm:p-6"
          >
            {children}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
