"use client";

import { MotionConfig } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";

// Public site layout — wraps marketing pages with navbar, footer, and WhatsApp FAB.
export default function PublicLayout({ children }) {
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFab />
    </MotionConfig>
  );
}
