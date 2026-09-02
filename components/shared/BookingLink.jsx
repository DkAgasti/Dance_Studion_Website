"use client";

import Link from "next/link";
import { useBookingModal } from "@/components/shared/BookingModalProvider";

// Drop-in replacement for next/link: when href points at "/book-trial" or
// "/admissions" (query string and all) it opens that form as an instant
// popup (no navigation, no URL change) instead of following the link; any
// other href behaves exactly like a normal next/link. A passed-in onClick
// (e.g. to also close a mobile menu) still runs alongside the popup open.
export default function BookingLink({ href, onClick, children, ...props }) {
  const { openTrial, openAdmission } = useBookingModal();

  const isTrial = href === "/book-trial" || href?.startsWith("/book-trial?");
  const isAdmission = href === "/admissions" || href?.startsWith("/admissions?");

  if (isTrial || isAdmission) {
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          if (isTrial) openTrial();
          else openAdmission();
          onClick?.(e);
        }}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} {...props}>
      {children}
    </Link>
  );
}
