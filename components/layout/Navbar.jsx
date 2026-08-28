"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileDrawer from "@/components/layout/MobileDrawer";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-4 z-50 px-4 sm:top-6 sm:px-6 lg:px-10">
        <div className="glass-strong container-page flex h-[72px] items-center justify-between rounded-full !px-4 sm:!px-6">
          <Link
            href="/"
            className="font-display text-2xl font-bold text-gradient-brand"
          >
            ASM
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
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
        </div>
      </header>

      <MobileDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
