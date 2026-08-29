"use client";

import { useEffect, useState } from "react";
import { Trash2, GripVertical, Image as ImageIcon, Loader2 } from "lucide-react";
import MediaUploader from "@/components/admin/MediaUploader";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/lib/uploadClient";

const CATEGORY_GRADIENTS = [
  "from-[#0f2a3a] via-surface to-[#1d7a8c]",
  "from-[#3a0f1f] via-surface to-[#b0203f]",
  "from-[#0f3a34] via-surface to-[#3ecf8e]",
  "from-[#5a1f0f] via-surface to-[#e0752a]",
];

// "Photos" content tab — image grid with drag-to-reorder (native HTML5 DnD,
// since the grid wraps to multiple rows and Framer Motion's <Reorder> only
// supports a single-axis list) + upload dropzone.
export default function PhotosTab() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [overId, setOverId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/media?type=PHOTO")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load photos.");
        return res.json();
      })
      .then((body) => {
        if (!cancelled) setPhotos(body.media);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function savePhoto(url) {
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "PHOTO", url, category: "Studio" }),
      });
      if (!res.ok) throw new Error("Failed to save photo.");
      const { media } = await res.json();
      setPhotos((prev) => [media, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpload(file) {
    setUploading(true);
    try {
      const { url } = await uploadFile(file, "photos");
      await savePhoto(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id) {
    const previous = photos;
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete photo.");
    } catch (err) {
      setPhotos(previous);
      setError(err.message);
    }
  }

  function handleDrop(targetId) {
    if (draggedId == null || draggedId === targetId) {
      setDraggedId(null);
      setOverId(null);
      return;
    }
    setPhotos((prev) => {
      const next = [...prev];
      const fromIndex = next.findIndex((p) => p.id === draggedId);
      const toIndex = next.findIndex((p) => p.id === targetId);
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);

      next.forEach((photo, order) => {
        fetch(`/api/media/${photo.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order }),
        }).catch(() => {});
      });

      return next;
    });
    setDraggedId(null);
    setOverId(null);
  }

  return (
    <div>
      <p className="mb-4 text-xs text-muted-foreground">
        Drag photos to reorder how they appear in the public gallery.
      </p>
      {error ? (
        <p className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading photos...
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <MediaUploader
            accept="image/*"
            icon={ImageIcon}
            label={uploading ? "Uploading..." : "Upload Photo"}
            hint="JPG or PNG, max 10MB"
            className="aspect-square"
            onFile={handleUpload}
            onUrl={savePhoto}
          />

          {photos.map((photo, i) => (
            <div
              key={photo.id}
              draggable
              onDragStart={() => setDraggedId(photo.id)}
              onDragOver={(e) => {
                e.preventDefault();
                setOverId(photo.id);
              }}
              onDragLeave={() => setOverId((id) => (id === photo.id ? null : id))}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(photo.id);
              }}
              onDragEnd={() => {
                setDraggedId(null);
                setOverId(null);
              }}
              className={cn(
                "group relative aspect-square cursor-grab overflow-hidden rounded-2xl border transition-opacity active:cursor-grabbing",
                draggedId === photo.id ? "opacity-40" : "opacity-100",
                overId === photo.id && draggedId !== photo.id
                  ? "border-brand-end"
                  : "border-border"
              )}
            >
              <ImageWithFallback
                src={photo.url}
                gradient={CATEGORY_GRADIENTS[i % CATEGORY_GRADIENTS.length]}
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

              <span className="glass absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold text-foreground/80 uppercase">
                {photo.category}
              </span>

              <div className="absolute top-3 right-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="flex size-7 items-center justify-center rounded-full bg-black/40 text-white">
                  <GripVertical className="size-3.5" />
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(photo.id)}
                  aria-label="Delete photo"
                  className="flex size-7 items-center justify-center rounded-full bg-black/40 text-white hover:bg-brand-start/40"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
