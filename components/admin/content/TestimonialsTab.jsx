"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Star, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import MediaUploader from "@/components/admin/MediaUploader";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { uploadFile } from "@/lib/uploadClient";

const EMPTY = { name: "", role: "", rating: 5, text: "", featured: false, imageUrl: "" };

function testimonialToForm(t) {
  if (!t) return EMPTY;
  return {
    name: t.authorName ?? "",
    role: t.category ?? "",
    rating: t.rating ?? 5,
    text: t.caption ?? "",
    featured: t.featured ?? false,
    imageUrl: t.imageUrl ?? "",
  };
}

function TestimonialForm({ testimonial, onSubmit }) {
  const [form, setForm] = useState(() => testimonialToForm(testimonial));
  const [uploading, setUploading] = useState(false);

  async function handlePhoto(file) {
    setUploading(true);
    try {
      const { url } = await uploadFile(file, "testimonials", "image");
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch {
      // upload failed — the testimonial can still be saved without a photo
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{testimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
        <DialogDescription>Reviews shown on the homepage and gallery.</DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex flex-col gap-4">
        <MediaUploader
          accept="image/*"
          label={uploading ? "Uploading..." : form.imageUrl ? "Photo uploaded" : "Upload Photo"}
          hint="Reviewer's photo shown next to their name"
          onFile={handlePhoto}
          onUrl={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="t-name">Name</Label>
            <Input
              id="t-name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="t-role">Role</Label>
            <Input
              id="t-role"
              placeholder="e.g. Parent, Student"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Rating</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setForm((f) => ({ ...f, rating: n }))}
                aria-label={`${n} stars`}
              >
                <Star
                  className={
                    n <= form.rating
                      ? "size-6 fill-brand-lime text-brand-lime"
                      : "size-6 text-muted-foreground"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="t-text">Review Text</Label>
          <Textarea
            id="t-text"
            rows={3}
            required
            value={form.text}
            onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
          />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white/[0.02] p-3">
          <Label htmlFor="t-featured" className="cursor-pointer">
            Feature this review
          </Label>
          <Switch
            id="t-featured"
            checked={form.featured}
            onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
          />
        </div>
      </div>

      <DialogFooter className="mt-2">
        <Button type="submit" className="rounded-full bg-brand-end text-background hover:bg-brand-end/90">
          {testimonial ? "Save Changes" : "Add Testimonial"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// "Testimonials" content tab — review cards with a feature toggle. Exposes
// `openAdd` via ref so the page's shared "Add New" button can trigger it.
const TestimonialsTab = forwardRef(function TestimonialsTab(_props, ref) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/media?type=REVIEW")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load testimonials.");
        return res.json();
      })
      .then((body) => {
        if (!cancelled) setTestimonials(body.media);
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
    setEditing(null);
    setDialogOpen(true);
  }

  useImperativeHandle(ref, () => ({ openAdd }));

  function openEdit(t) {
    setEditing(t);
    setDialogOpen(true);
  }

  async function patchTestimonial(id, data) {
    const previous = testimonials;
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update testimonial.");
    } catch (err) {
      setTestimonials(previous);
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    const previous = testimonials;
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete testimonial.");
    } catch (err) {
      setTestimonials(previous);
      setError(err.message);
    }
  }

  function handleToggleFeatured(id) {
    const t = testimonials.find((x) => x.id === id);
    patchTestimonial(id, { featured: !t.featured });
  }

  async function handleSubmit(values) {
    const payload = {
      type: "REVIEW",
      authorName: values.name,
      category: values.role,
      rating: values.rating,
      caption: values.text,
      featured: values.featured,
      imageUrl: values.imageUrl || undefined,
    };
    try {
      const res = await fetch(editing ? `/api/media/${editing.id}` : "/api/media", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save testimonial.");
      const { media } = await res.json();
      setTestimonials((prev) =>
        editing ? prev.map((t) => (t.id === media.id ? media : t)) : [...prev, media]
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
        Loading testimonials...
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.id} className="glass-tile flex flex-col rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-0.5 text-brand-lime">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" strokeWidth={0} />
                ))}
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(t)}
                  aria-label={`Edit ${t.authorName}`}
                  className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-white/10 hover:text-foreground"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id)}
                  aria-label={`Delete ${t.authorName}`}
                  className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-brand-start/20 hover:text-brand-start"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>

            <p className="mt-4 flex-1 text-sm text-foreground/90">&ldquo;{t.caption}&rdquo;</p>

            <div className="mt-6 flex items-center gap-3">
              <ImageWithFallback
                src={t.imageUrl}
                gradient="from-brand-mid/25 via-surface to-brand-start/15"
                className="size-10 shrink-0 rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{t.authorName}</p>
                <p className="text-xs text-muted-foreground">{t.category}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
              Featured on homepage
              <Switch checked={t.featured} onCheckedChange={() => handleToggleFeatured(t.id)} />
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          {dialogOpen ? (
            <TestimonialForm key={editing?.id ?? "new"} testimonial={editing} onSubmit={handleSubmit} />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default TestimonialsTab;
