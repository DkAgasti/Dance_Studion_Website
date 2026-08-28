"use client";

import { Store, Share2, Tag, BellRing, Bell, Users, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

export const SETTINGS_SECTIONS = [
  { key: "profile", label: "Studio Profile", icon: Store },
  { key: "social", label: "Social & Map", icon: Share2 },
  { key: "plans", label: "Plans & Pricing", icon: Tag },
  { key: "reminders", label: "Fee Reminders", icon: BellRing },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "team", label: "Team & Roles", icon: Users },
  { key: "branding", label: "Branding", icon: Palette },
];

// Left vertical sub-nav for the admin Settings page.
export default function SettingsNav({ active, onChange }) {
  return (
    <nav className="flex shrink-0 flex-col gap-1 lg:w-64">
      {SETTINGS_SECTIONS.map((section) => {
        const isActive = active === section.key;
        return (
          <button
            key={section.key}
            type="button"
            onClick={() => onChange(section.key)}
            className={cn(
              "flex items-center gap-3 rounded-xl border-l-2 px-3 py-2.5 text-left text-sm font-medium transition-colors",
              isActive
                ? "border-brand-end bg-white/[0.04] text-brand-end"
                : "border-transparent text-muted-foreground hover:bg-white/[0.02] hover:text-foreground"
            )}
          >
            <section.icon className="size-4 shrink-0" />
            {section.label}
          </button>
        );
      })}
    </nav>
  );
}
