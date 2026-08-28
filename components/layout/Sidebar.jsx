"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserPlus,
  CalendarCheck,
  Users,
  Receipt,
  GraduationCap,
  LayoutGrid,
  FileText,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Admissions", href: "/admin/admissions", icon: UserPlus },
  { label: "Trial Bookings", href: "/admin/trial-bookings", icon: CalendarCheck },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Fees", href: "/admin/fees", icon: Receipt },
  { label: "Classes", href: "/admin/classes", icon: GraduationCap },
  { label: "Batches", href: "/admin/batches", icon: LayoutGrid },
  { label: "Content", href: "/admin/content", icon: FileText },
];

// Admin dashboard sidebar navigation — fixed on desktop, a slide-in drawer
// on mobile (controlled by the parent shell).
export default function Sidebar({ mobileOpen, onClose }) {
  const pathname = usePathname();

  function isActive(href) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  return (
    <>
      {mobileOpen ? (
        <div
          aria-hidden
          onClick={onClose}
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface/80 backdrop-blur-md transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="bg-gradient-brand flex size-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold text-white">
              A
            </span>
            <span className="leading-tight">
              <span className="block font-display text-sm font-bold text-gradient-brand">
                ASM
              </span>
              <span className="block text-[10px] text-muted-foreground">
                Achieve Show Makers
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-white/10 hover:text-foreground lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-lime text-background"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <Link
            href="/admin/settings"
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              isActive("/admin/settings")
                ? "bg-brand-lime text-background"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <Settings className="size-4 shrink-0" />
            Settings
          </Link>
        </div>
      </aside>
    </>
  );
}
