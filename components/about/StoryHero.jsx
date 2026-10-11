"use client";

import { motion } from "framer-motion";

export default function StoryHero() {
  return (
    <section className="relative flex h-[70vh] min-h-[520px] w-full items-end overflow-hidden pb-2">
      <video
        src="https://res.cloudinary.com/fexwwils/video/upload/v1787983921/From_Klickpin.com-_Try_this_guide_to_cozy_glowy_skin_ideas_perfect_for_saving_sharing_and_recreating_later_with_smart_steps_cute_details_and_cozy.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="container-page relative text-center"
      >
        <p className="eyebrow text-white/70">Our Story</p>
        <h1 className="h1-display mx-auto mt-4 max-w-3xl text-balance text-white">
          More Than <span className="text-gradient-brand">A Studio</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/70 md:text-xl">
          From a single studio in Patia to Bhubaneswar&apos;s home of dance
          and fitness
        </p>
      </motion.div>
    </section>
  );
}
