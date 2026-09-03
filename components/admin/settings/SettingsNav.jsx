"use client";

import { Store, Share2, Tag, Bell, Users, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

export const SETTINGS_SECTIONS = [
  { key: "profile", label: "Studio Profile", icon: Store },
  { key: "social", label: "Social & Map", icon: Share2 },
  { key: "plans", label: "Plans & Pricing", icon: Tag },
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
                ? "border-primary bg-primary/10 text-primary"
                : "border-transparent text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
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
