"use client";

import { createContext, useContext, useEffect, useState } from "react";
import TrialWizard from "@/components/forms/TrialWizard";
import AdmissionForm from "@/components/forms/AdmissionForm";

const BookingModalContext = createContext(null);

// Read by BookingLink (and anything else) to open the trial/admission form
// as an instant on-page popup — no navigation, no URL change.
export function useBookingModal() {
  const ctx = useContext(BookingModalContext);
  if (!ctx) {
    throw new Error("useBookingModal must be used within BookingModalProvider");
  }
  return ctx;
}

// Mounted once in the public layout. Renders the trial/admission wizard in a
// fixed overlay on top of whatever page is currently showing, instead of the
// old approach of navigating to /book-trial or /admissions.
export default function BookingModalProvider({ children }) {
  const [open, setOpen] = useState(null); // null | "trial" | "admission"

  function close() {
    setOpen(null);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const value = {
    isOpen: !!open,
    openTrial: () => setOpen("trial"),
    openAdmission: () => setOpen("admission"),
    close,
  };

  return (
    <BookingModalContext.Provider value={value}>
      {children}
      {open ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-black/60 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          {open === "trial" ? <TrialWizard onClose={close} /> : <AdmissionForm onClose={close} />}
        </div>
      ) : null}
    </BookingModalContext.Provider>
  );
}
