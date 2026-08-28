"use client";

import { cn } from "@/lib/utils";

// Hides the native scrollbar (all browsers) without touching global CSS.
const noScrollbar =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

function FilterGroup({ label, options, active, onChange, className }) {
  return (
    <div
      className={cn(
        "glass flex max-w-full shrink-0 items-center gap-1 rounded-full py-2 pr-3 pl-4",
        className
      )}
    >
      {/* Label stays put — only the chip list below scrolls. */}
      <span className="eyebrow shrink-0 pr-2 text-[11px]">{label}:</span>
      <div className={cn("flex min-w-0 items-center gap-1 overflow-x-auto", noScrollbar)}>
        {(options ?? []).map((option) => {
          const isActive = active === option.key;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(option.key)}
              aria-pressed={isActive}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                isActive
                  ? "bg-brand-lime font-bold text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Filter controls (age + style) for the classes listing page — selection is
// lifted to the parent <ClassesGrid>. Both pills always sit on one line;
// Style is capped to a fixed width (it has far more options than Age) and
// scrolls its own chips sideways instead of growing to fit them all.
export default function ClassFilters({
  age,
  style,
  onAgeChange,
  onStyleChange,
  ageOptions,
  styleOptions,
}) {
  return (
    <div className="flex w-full justify-center px-4">
      <div className="flex max-w-full items-center gap-4 overflow-x-auto">
        <FilterGroup label="Age" options={ageOptions} active={age} onChange={onAgeChange} />
        <FilterGroup
          label="Style"
          options={styleOptions}
          active={style}
          onChange={onStyleChange}
          className="sm:w-[520px]"
        />
      </div>
    </div>
  );
}
