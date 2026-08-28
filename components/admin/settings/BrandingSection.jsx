"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import SegmentedToggle from "@/components/admin/SegmentedToggle";
import { cn } from "@/lib/utils";

const ACCENTS = [
  { key: "brand-start", label: "Rose", hex: "#ff2d55" },
  { key: "brand-mid", label: "Violet", hex: "#7c5cff" },
  { key: "brand-end", label: "Cyan", hex: "#22d3ee" },
  { key: "brand-lime", label: "Lime", hex: "#c6ff3a" },
];

// "Branding" settings section — accent color + default theme. Visual only:
// the public site's brand gradient already uses all four accents together,
// this just records a preference for future single-accent surfaces.
export default function BrandingSection() {
  const [accent, setAccent] = useState("brand-lime");
  const [themeMode, setThemeMode] = useState("dark");

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
                {isActive ? (
                  <Check
                    className="size-5"
                    style={{ color: a.key === "brand-lime" ? "#0b0b0f" : "#fff" }}
                  />
                ) : null}
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
          ASM Dance Studio currently ships dark-only — this sets the default for
          when light mode support is added.
        </p>
      </div>
    </div>
  );
}
