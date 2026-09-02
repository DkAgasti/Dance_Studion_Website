"use client";

import { MotionConfig } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import BookingModalProvider from "@/components/shared/BookingModalProvider";

// Public site layout — wraps marketing pages with navbar, footer, and
// WhatsApp FAB. BookingModalProvider makes the trial/admission forms open as
// an instant on-page popup (no navigation, no URL change) from anywhere
// underneath — see components/shared/BookingLink.
export default function PublicLayout({ children }) {
  return (
    <MotionConfig reducedMotion="user">
      <BookingModalProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFab />
      </BookingModalProvider>
    </MotionConfig>
  );
}
