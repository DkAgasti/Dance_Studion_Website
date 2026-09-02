"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import ImageWithFallback from "@/components/media/ImageWithFallback";

const VIDEO_EXTENSION = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;

function isVideoUrl(url) {
  return VIDEO_EXTENSION.test(url) || url.includes("/video/upload/");
}

function GalleryTile({ src }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  if (!isVideoUrl(src)) {
    return (
      <ImageWithFallback
        src={src}
        className="absolute inset-0"
        imgClassName="transition-transform duration-700 ease-out group-hover:scale-110"
      />
    );
  }

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
    } else {
      video.play();
    }
    setPlaying(!playing);
  }

  return (
    <button
      type="button"
      onClick={togglePlay}
      aria-label={playing ? "Pause clip" : "Play clip"}
      className="absolute inset-0"
    >
      <video
        ref={videoRef}
        src={src}
        loop
        playsInline
        className="absolute inset-0 size-full object-cover"
        onEnded={() => setPlaying(false)}
      />
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity ${
          playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
        }`}
      >
        <span className="glass-strong flex size-12 items-center justify-center rounded-full">
          {playing ? (
            <Pause className="size-5 fill-white text-white" />
          ) : (
            <Play className="ml-0.5 size-5 fill-white text-white" />
          )}
        </span>
      </div>
    </button>
  );
}

// "Class Energy" — photo/video grid for a specific class, from
// DanceClass.galleryImages. Video URLs (student dance clips) play inline
// on click; everything else renders as a photo.
export default function ClassGallery({ images = [] }) {
  if (!images.length) return null;

  return (
    <section className="container-page pb-20 md:pb-28">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h2-display"
      >
        Class <span className="text-brand-lime">Energy</span>
      </motion.h2>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {images.map((src, i) => (
          <motion.div
            key={`${src}-${i}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.08, ease: "easeOut" }}
            className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-border"
          >
            <GalleryTile src={src} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
