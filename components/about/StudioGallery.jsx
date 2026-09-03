"use client";

import { motion } from "framer-motion";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import SectionHeading from "@/components/shared/SectionHeading";

const ROWS = [
  [
    { alt: "Main studio hall with mirrors and neon lighting", src: "https://res.cloudinary.com/fexwwils/image/upload/v1787985258/ultra_modern_dance_studio_main_hall_mirrors_bright_neon_lighting_high_ceilings.png", gradient: "from-brand-mid/20 via-surface to-brand-end/15", wide: true },
    { alt: "Changing room interior", src: "https://res.cloudinary.com/fexwwils/image/upload/v1787985245/dance_studio_changing_room_lockers_aesthetic_interior.png", gradient: "from-brand-start/15 via-surface to-brand-mid/10", wide: false },
  ],
  [
    { alt: "Reception area with ASM logo on the wall", src: "https://res.cloudinary.com/fexwwils/image/upload/v1787985227/reception_area_of_dance_studio_modern_desk_ASM_logo_on_wall.png", gradient: "from-brand-lime/15 via-surface to-brand-end/10", wide: false },
    { alt: "Practice floor with focused lighting", src: "https://res.cloudinary.com/fexwwils/image/upload/v1787985210/smaller_practice_dance_floor_focused_lighting_intimate_setting.png", gradient: "from-brand-mid/15 via-surface to-brand-start/15", wide: true },
  ],
];
// 👆 har photo ke "src" mein apna image URL daalo

// "Our Space" — studio photo gallery grid.
export default function StudioGallery() {
  return (
    <section className="container-page section-y">
      <SectionHeading align="center" title="Our" gradientWord="Space" className="mx-auto" />

      <div className="mt-16 flex flex-col gap-6">
        {ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-col gap-6 md:flex-row">
            {row.map((photo, i) => (
              <motion.div
                key={photo.alt}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "90px" }}
                transition={{ duration: 0.35, delay: i * 0.1, ease: "easeOut" }}
                className={photo.wide ? "md:flex-[2]" : "md:flex-1"}
              >
                <ImageWithFallback
                  src={photo.src}
                  alt={photo.alt}
                  gradient={photo.gradient}
                  className={
                    photo.wide
                      ? "aspect-[813/457] w-full rounded-xl border border-border"
                      : "aspect-[394/457] w-full rounded-xl border border-border"
                  }
                />
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
