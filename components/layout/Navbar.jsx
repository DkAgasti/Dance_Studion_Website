"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileDrawer from "@/components/layout/MobileDrawer";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-4 z-50 px-4 sm:top-6 sm:px-6 lg:px-10">
        <motion.div
          animate={{ maxWidth: scrolled ? 1280 : 1520 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className={cn(
            "mx-auto flex h-[72px] w-full items-center justify-between rounded-full px-4 transition-colors duration-300 sm:px-6",
            scrolled
              ? "border-2 border-border-strong bg-white/[0.06] shadow-2xl backdrop-blur-md"
              : "border-2 border-transparent bg-transparent shadow-none backdrop-blur-none"
          )}
        >
          <Link
            href="/"
            className="font-display text-2xl font-bold text-gradient-brand"
          >
            ASM
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
                      className="absolute inset-0 -z-10 rounded-full border border-white/15 bg-transparent shadow-lg backdrop-blur-xl"
                    />
                  ) : null}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button
              asChild
              className="h-10 rounded-full bg-brand-lime px-6 font-bold text-background hover:bg-brand-lime/90"
            >
              <Link href="/book-trial">Book Free Trial</Link>
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
