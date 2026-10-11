import { cn, cldOptimize } from "@/lib/utils";

// The studio's dancer mark on a circular brand-gradient badge, matching the
// reference icon supplied for the navbar/footer — reuses the real logo
// silhouette (recolored white via filter) rather than a redrawn shape.
const LOGO_MARK_URL =
  "https://res.cloudinary.com/fexwwils/image/upload/v1788164253/studio/ygwgc9lzitevpwjhqgwu.png";

export default function StudioBadgeLogo({ className = "size-12" }) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full ring-8 ring-brand-mid/10",
        className
      )}
      style={{
        background: "linear-gradient(135deg, #7c5cff 0%, #e0469e 50%, #ff8a3d 100%)",
      }}
    >
      <img
        src={cldOptimize(LOGO_MARK_URL)}
        alt="ASM Dance Studio"
        className="h-[58%] w-[58%] object-contain"
        style={{ filter: "brightness(0) invert(1)" }}
      />
    </span>
  );
}
