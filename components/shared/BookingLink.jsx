"use client";

import Link from "next/link";

// Thin wrapper around next/link used across booking CTAs so /book-trial and
// /admissions open as standalone, shareable pages.
export default function BookingLink({ href, onClick, children, ...props }) {
  return (
    <Link href={href} onClick={onClick} {...props}>
      {children}
    </Link>
  );
}
