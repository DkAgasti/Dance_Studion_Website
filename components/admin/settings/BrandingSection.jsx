"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import SegmentedToggle from "@/components/admin/SegmentedToggle";
import { cn } from "@/lib/utils";

const ACCENTS = [
  { key: "brand-start", label: "Rose", hex: "#c8102e" },
  { key: "brand-mid", label: "Violet", hex: "#5b21b6" },
  { key: "brand-end", label: "Teal", hex: "#0e7490" },
];

// "Branding" settings section — accent color + default theme. Visual only:
// the public site's brand gradient already uses these accents together,
// this just records a preference for future single-accent surfaces.
export default function BrandingSection() {
  const [accent, setAccent] = useState("brand-start");
  const [themeMode, setThemeMode] = useState("light");

  return (
    <div className="glass-tile rounded-2xl p-6 sm:p-8">
      <h2 className="h4-display">Branding</h2>

      <div className="mt-6">
        <p className="eyebrow !text-[10px]">Accent Color</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {ACCENTS.map((a) => {
            const isActive = accent === a.key;
            return (
              <button
                key={a.key}
                type="button"
                onClick={() => setAccent(a.key)}
                aria-label={a.label}
                aria-pressed={isActive}
                className={cn(
                  "flex size-12 items-center justify-center rounded-full border-2 transition-colors",
                  isActive ? "border-foreground" : "border-transparent"
                )}
                style={{ backgroundColor: a.hex }}
              >
                {isActive ? <Check className="size-5 text-white" /> : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <p className="eyebrow !text-[10px]">Default Theme</p>
        <div className="mt-3">
          <SegmentedToggle
            options={[
              { key: "light", label: "Light" },
              { key: "dark", label: "Dark" },
              { key: "system", label: "System" },
            ]}
            active={themeMode}
            onChange={setThemeMode}
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          ASM Dance Studio ships light-only today — this sets the default for
          when dark mode support is added.
        </p>
      </div>
    </div>
  );
}
