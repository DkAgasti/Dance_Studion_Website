"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Milestone as MilestoneIcon, Pencil, Trash2, Loader2 } from "lucide-react";
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
import MediaUploader from "@/components/admin/MediaUploader";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { uploadFile } from "@/lib/uploadClient";

const GRADIENTS = [
  "from-[#3a2a1f] via-surface to-[#7a5320]",
  "from-[#1c1140] via-surface to-[#3a1f6b]",
  "from-[#2a2a0f] via-surface to-[#5a5a1a]",
];

const EMPTY = { year: "", title: "", body: "", url: "" };

function milestoneToForm(m) {
  if (!m) return EMPTY;
  return {
    year: m.category ?? "",
    title: m.caption ?? "",
    body: m.body ?? "",
    url: m.url ?? "",
  };
}

function MilestoneForm({ milestone, onSubmit }) {
  const [form, setForm] = useState(() => milestoneToForm(milestone));
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file) {
    setUploading(true);
    try {
      const { url } = await uploadFile(file, "milestones");
      setForm((f) => ({ ...f, url }));
    } catch {
      // upload failed — the milestone can still be saved without an image
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
        <DialogTitle>{milestone ? "Edit Milestone" : "Add Milestone"}</DialogTitle>
        <DialogDescription>Timeline events shown on the About page.</DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex flex-col gap-4">
        <MediaUploader
          accept="image/*"
          icon={MilestoneIcon}
          label={uploading ? "Uploading..." : form.url ? "Photo uploaded" : "Upload Photo"}
          hint="JPG or PNG"
          onFile={handleUpload}
          onUrl={(url) => setForm((f) => ({ ...f, url }))}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="m-year">Year</Label>
            <Input
              id="m-year"
              placeholder="e.g. 2016"
              required
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="m-title">Title</Label>
            <Input
              id="m-title"
              placeholder="e.g. The Foundation"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="m-body">Description</Label>
          <Textarea
            id="m-body"
            rows={3}
            required
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          />
        </div>
      </div>

      <DialogFooter className="mt-2">
        <Button type="submit" className="rounded-full bg-brand-end text-background hover:bg-brand-end/90">
          {milestone ? "Save Changes" : "Add Milestone"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// "Milestones" content tab — timeline events shown on the About page.
// Exposes `openAdd` via ref so the page's shared "Add New" button can
// trigger it. Backed by Media rows with type=MILESTONE (category=year,
// caption=title, body=description, url=photo).
const MilestonesTab = forwardRef(function MilestonesTab(_props, ref) {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/media?type=MILESTONE")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load milestones.");
        return res.json();
      })
      .then((body) => {
        if (!cancelled) setMilestones(body.media);
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

  function openEdit(m) {
    setEditing(m);
    setDialogOpen(true);
  }

  async function handleDelete(id) {
    const previous = milestones;
    setMilestones((prev) => prev.filter((m) => m.id !== id));
    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete milestone.");
    } catch (err) {
      setMilestones(previous);
      setError(err.message);
    }
  }

  async function handleSubmit(values) {
    const payload = {
      type: "MILESTONE",
      category: values.year,
      caption: values.title,
      body: values.body,
      url: values.url,
    };
    try {
      const res = await fetch(editing ? `/api/media/${editing.id}` : "/api/media", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save milestone.");
      const { media } = await res.json();
      setMilestones((prev) =>
        editing ? prev.map((m) => (m.id === media.id ? media : m)) : [...prev, media]
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
        Loading milestones...
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
        {milestones.map((m, i) => (
          <div key={m.id} className="group glass-tile overflow-hidden rounded-2xl">
            <div className="relative aspect-video">
              <ImageWithFallback
                src={m.url}
                gradient={GRADIENTS[i % GRADIENTS.length]}
                icon={MilestoneIcon}
                className="absolute inset-0"
              />
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => openEdit(m)}
                  aria-label={`Edit ${m.caption}`}
                  className="flex size-7 items-center justify-center rounded-full bg-black/40 text-white hover:bg-white/20"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(m.id)}
                  aria-label={`Delete ${m.caption}`}
                  className="flex size-7 items-center justify-center rounded-full bg-black/40 text-white hover:bg-brand-start/40"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs font-bold text-brand-lime">{m.category}</p>
              <p className="mt-1 font-medium">{m.caption}</p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{m.body}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          {dialogOpen ? (
            <MilestoneForm key={editing?.id ?? "new"} milestone={editing} onSubmit={handleSubmit} />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default MilestonesTab;
