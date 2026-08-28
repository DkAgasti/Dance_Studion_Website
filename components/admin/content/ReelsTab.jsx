"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Trash2, Play, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MediaUploader from "@/components/admin/MediaUploader";
import VideoSourceInput from "@/components/admin/content/VideoSourceInput";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { uploadFile } from "@/lib/uploadClient";

function detectVideoSource(url) {
  if (/youtube\.com|youtu\.be/.test(url)) return "YOUTUBE";
  if (/instagram\.com/.test(url)) return "INSTAGRAM";
  return null;
}

function mediaToReel(m) {
  return {
    id: m.id,
    caption: m.caption ?? "",
    category: m.category ?? "Hip-Hop",
    featured: m.featured ?? false,
    url: m.url,
    videoSource: m.videoSource,
    imageUrl: m.imageUrl ?? null,
  };
}

const CATEGORIES = ["Hip-Hop", "Contemporary", "Classical", "Kids", "Fitness", "Event"];
const GRADIENTS = [
  "from-[#1c1140] via-surface to-[#6d3bd1]",
  "from-[#2a2a0f] via-surface to-[#5a5a1a]",
  "from-[#0f3a34] via-surface to-[#3ecf8e]",
  "from-[#5a1f0f] via-surface to-[#e0752a]",
];
const ACCENT_HEX = {
  "brand-start": "#ff2d55",
  "brand-mid": "#7c5cff",
  "brand-end": "#22d3ee",
  "brand-lime": "#c6ff3a",
};

const EMPTY = {
  caption: "",
  category: "Hip-Hop",
  source: { type: "upload", url: null, fileName: null, previewUrl: null, file: null },
  featured: false,
  imageUrl: "",
};

function reelToForm(reel) {
  if (!reel) return EMPTY;
  return {
    caption: reel.caption,
    category: reel.category,
    source:
      reel.videoSource === "UPLOAD"
        ? { type: "upload", url: reel.url, fileName: null, previewUrl: reel.url, file: null }
        : { type: "embed", url: reel.url, fileName: null, previewUrl: null, file: null },
    featured: reel.featured,
    imageUrl: reel.imageUrl ?? "",
  };
}

function ReelForm({ reel, onSubmit }) {
  const [form, setForm] = useState(() => reelToForm(reel));
  const [saving, setSaving] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);

  async function handleThumbnail(file) {
    setUploadingThumb(true);
    try {
      const { url } = await uploadFile(file, "reels-thumbnails", "image");
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch {
      // upload failed — the reel can still be saved without a thumbnail
    } finally {
      setUploadingThumb(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      let url = form.source.url;
      let videoSource = form.source.type === "embed" ? detectVideoSource(url) : "UPLOAD";
      if (form.source.type === "upload" && form.source.file) {
        const uploaded = await uploadFile(form.source.file, "reels", "video");
        url = uploaded.url;
      }
      await onSubmit({
        caption: form.caption,
        category: form.category,
        featured: form.featured,
        url,
        videoSource,
        imageUrl: form.imageUrl || undefined,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{reel ? "Edit Reel" : "Upload Reel"}</DialogTitle>
        <DialogDescription>
          {reel ? "Update this reel's details." : "Add a new reel to the homepage carousel."}
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex flex-col gap-4">
        <VideoSourceInput
          value={form.source}
          onChange={(source) => setForm((f) => ({ ...f, source }))}
        />

        <MediaUploader
          accept="image/*"
          label={
            uploadingThumb
              ? "Uploading..."
              : form.imageUrl
                ? "Thumbnail uploaded"
                : "Upload Thumbnail"
          }
          hint="Shown as the reel's cover photo on the homepage"
          onFile={handleThumbnail}
        />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="r-caption">Caption</Label>
          <Input
            id="r-caption"
            required
            value={form.caption}
            onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Category</Label>
          <Select
            value={form.category}
            onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white/[0.02] p-3">
          <Label htmlFor="r-featured" className="cursor-pointer">
            Featured on homepage
          </Label>
          <Switch
            id="r-featured"
            checked={form.featured}
            onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
          />
        </div>
      </div>

      <DialogFooter className="mt-2">
        <Button
          type="submit"
          disabled={saving}
          className="rounded-full bg-brand-end text-background hover:bg-brand-end/90 disabled:opacity-60"
        >
          {saving ? "Saving..." : reel ? "Save Changes" : "Add Reel"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function ReelCard({ reel, gradient, color, onEdit, onDelete, onToggleFeatured }) {
  return (
    <div
      onClick={() => onEdit(reel)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onEdit(reel)}
      className="group relative aspect-9/16 cursor-pointer overflow-hidden rounded-2xl border border-border"
    >
      <ImageWithFallback
        src={reel.imageUrl}
        gradient={gradient}
        icon={Play}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />

      <span
        style={{
          backgroundColor: `${ACCENT_HEX[color]}33`,
          color: ACCENT_HEX[color],
        }}
        className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase"
      >
        {reel.category}
      </span>

      <div className="absolute top-3 right-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(reel);
          }}
          aria-label={`Delete ${reel.caption}`}
          className="flex size-7 items-center justify-center rounded-full bg-black/40 text-white hover:bg-brand-start/40"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-sm font-bold text-white">{reel.caption}</p>
        <div
          className="mt-3 flex items-center justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-xs text-white/70">Featured</span>
          <Switch checked={reel.featured} onCheckedChange={() => onToggleFeatured(reel.id)} />
        </div>
      </div>
    </div>
  );
}

// "Reels" content tab — vertical video grid + upload dropzone. Exposes
// `openAdd` via ref so the page's shared "Add New" button can trigger it.
const ReelsTab = forwardRef(function ReelsTab(_props, ref) {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReel, setEditingReel] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/media?type=REEL")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load reels.");
        return res.json();
      })
      .then((body) => {
        if (!cancelled) setReels(body.media.map(mediaToReel));
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

  function openAdd() {
    setEditingReel(null);
    setDialogOpen(true);
  }

  useImperativeHandle(ref, () => ({ openAdd }));

  function openEdit(reel) {
    setEditingReel(reel);
    setDialogOpen(true);
  }

  async function handleDelete(reel) {
    const previous = reels;
    setReels((prev) => prev.filter((r) => r.id !== reel.id));
    try {
      const res = await fetch(`/api/media/${reel.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete reel.");
    } catch (err) {
      setReels(previous);
      setError(err.message);
    }
  }

  async function handleToggleFeatured(id) {
    const reel = reels.find((r) => r.id === id);
    const previous = reels;
    setReels((prev) => prev.map((r) => (r.id === id ? { ...r, featured: !r.featured } : r)));
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !reel.featured }),
      });
      if (!res.ok) throw new Error("Failed to update reel.");
    } catch (err) {
      setReels(previous);
      setError(err.message);
    }
  }

  async function handleSubmit(values) {
    const payload = { type: "REEL", ...values };
    try {
      const res = await fetch(
        editingReel ? `/api/media/${editingReel.id}` : "/api/media",
        {
          method: editingReel ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Failed to save reel.");
      const { media } = await res.json();
      const reel = mediaToReel(media);
      setReels((prev) =>
        editingReel ? prev.map((r) => (r.id === reel.id ? reel : r)) : [...prev, reel]
      );
      setDialogOpen(false);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading reels...
      </div>
    );
  }

  return (
    <div>
      {error ? (
        <p className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <MediaUploader
          accept="video/*"
          icon={Play}
          label="Upload Reel"
          hint="MP4 or MOV, max 50MB"
          className="aspect-9/16"
          onFile={openAdd}
        />
        {reels.map((reel, i) => (
          <ReelCard
            key={reel.id}
            reel={reel}
            gradient={GRADIENTS[i % GRADIENTS.length]}
            color={["brand-end", "brand-lime", "brand-mid", "brand-start"][i % 4]}
            onEdit={openEdit}
            onDelete={handleDelete}
            onToggleFeatured={handleToggleFeatured}
          />
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg sm:max-w-lg">
          {dialogOpen ? (
            <ReelForm key={editingReel?.id ?? "new"} reel={editingReel} onSubmit={handleSubmit} />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default ReelsTab;
