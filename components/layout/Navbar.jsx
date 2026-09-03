"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileDrawer from "@/components/layout/MobileDrawer";
import AnnouncementBanner from "@/components/layout/AnnouncementBanner";
import StudioBadgeLogo from "@/components/shared/StudioBadgeLogo";
import BookingLink from "@/components/shared/BookingLink";
import { useBookingModal } from "@/components/shared/BookingModalProvider";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

// The promo banner would clash with these full-screen booking flows — the
// trial/admission form is the entire point of the page (or popup), so it
// shouldn't compete with an unrelated offer strip.
const HIDE_BANNER_ROUTES = ["/book-trial", "/admissions"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isOpen: bookingModalOpen } = useBookingModal();
  const headerRef = useRef(null);
  const hideBanner = bookingModalOpen || HIDE_BANNER_ROUTES.includes(pathname);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Exposes this header's real rendered height (announcement banner + nav
  // pill, if any) as a CSS var so mobile hero sections can reserve exactly
  // that much space instead of guessing — otherwise an active banner makes
  // the fixed header taller than the hero's hardcoded top padding expects,
  // and the nav ends up overlapping the hero content.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    function updateHeight() {
      document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
    }
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 flex flex-col">
        {hideBanner ? null : <AnnouncementBanner />}
        <motion.div
          animate={{ maxWidth: scrolled ? 1280 : 1520 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className={cn(
            "mx-auto mt-4 flex h-[72px] w-[calc(100%-2rem)] items-center justify-between rounded-full border-2 border-transparent px-4 transition-colors duration-300 sm:mt-6 sm:w-[calc(100%-3rem)] sm:px-6 lg:w-[calc(100%-5rem)]",
            scrolled
              ? "bg-card/80 shadow-2xl backdrop-blur-md"
              : "bg-transparent shadow-none backdrop-blur-none"
          )}
        >
          <Link href="/">
            <StudioBadgeLogo className="size-11" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {siteConfig.navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 -z-10 rounded-full border border-border bg-card/80 shadow-lg backdrop-blur-xl"
                    />
                  ) : null}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button
              asChild
              variant="outline"
              className="h-9 rounded-full border-border px-4 text-sm font-bold"
            >
              <BookingLink href="/admissions">Admissions</BookingLink>
            </Button>
            <Button
              asChild
              className="h-9 rounded-full bg-primary px-4 text-sm font-bold text-white hover:bg-primary/90"
            >
              <BookingLink href="/book-trial">Book Free Trial</BookingLink>
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex size-10 items-center justify-center rounded-full text-foreground lg:hidden"
          >
            <Menu className="size-6" />
          </button>
        </motion.div>
      </header>

      <MobileDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
