"use client";

import { cn } from "@/lib/utils";

// Hides the native scrollbar (all browsers) without touching global CSS.
const noScrollbar =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

function FilterGroup({ label, options, active, onChange, className }) {
  return (
    <div
      className={cn(
        "flex max-w-full w-full shrink-0 items-center gap-2 md:glass md:w-auto md:gap-1 md:rounded-full md:py-2 md:pr-3 md:pl-4",
        className
      )}
    >
      {/* Label stays put — only the chip list below scrolls. */}
      <span className="eyebrow shrink-0 pr-1 text-[11px] md:pr-2">
        {label}:
      </span>
      <div className={cn("flex min-w-0 items-center gap-2 overflow-x-auto md:gap-1", noScrollbar)}>
        {(options ?? []).map((option) => {
          const isActive = active === option.key;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(option.key)}
              aria-pressed={isActive}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors md:border-0",
                isActive
                  ? "border-transparent bg-primary font-bold text-white"
                  : "border-border text-muted-foreground hover:text-foreground"
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
      <div className="flex w-full max-w-full flex-col items-stretch gap-3 md:w-auto md:flex-row md:items-center md:gap-4 md:overflow-x-auto">
        <FilterGroup label="Age" options={ageOptions} active={age} onChange={onAgeChange} />
        <FilterGroup
          label="Style"
          options={styleOptions}
          active={style}
          onChange={onStyleChange}
          className="md:w-[520px]"
        />
      </div>
    </div>
  );
}
