"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
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
  "from-brand-start/25 via-surface to-brand-mid/20",
  "from-brand-mid/25 via-surface to-brand-start/20",
  "from-brand-end/25 via-surface to-brand-lime/15",
  "from-brand-lime/25 via-surface to-brand-end/15",
];

const EMPTY = { name: "", specialty: "", bio: "", photoUrl: "" };

function TrainerForm({ trainer, onSubmit }) {
  const [form, setForm] = useState(() =>
    trainer
      ? {
          name: trainer.name,
          specialty: trainer.specialty ?? "",
          bio: trainer.bio ?? "",
          photoUrl: trainer.photoUrl ?? "",
        }
      : EMPTY
  );
  const [uploading, setUploading] = useState(false);

  async function handlePhoto(file) {
    setUploading(true);
    try {
      const { url } = await uploadFile(file, "trainers");
      setForm((f) => ({ ...f, photoUrl: url }));
    } catch {
      // upload failed — the trainer can still be saved without a photo
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
        <DialogTitle>{trainer ? "Edit Trainer" : "Add Trainer"}</DialogTitle>
        <DialogDescription>Trainer profiles shown on the About page.</DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex flex-col gap-4">
        <MediaUploader
          accept="image/*"
          label={uploading ? "Uploading..." : form.photoUrl ? "Photo uploaded" : "Upload Photo"}
          hint="JPG or PNG"
          onFile={handlePhoto}
        />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tr-name">Name</Label>
          <Input
            id="tr-name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tr-specialty">Specialty</Label>
          <Input
            id="tr-specialty"
            placeholder="e.g. Hip-Hop / Street"
            required
            value={form.specialty}
            onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tr-bio">Bio</Label>
          <Textarea
            id="tr-bio"
            rows={3}
            required
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          />
        </div>
      </div>

      <DialogFooter className="mt-2">
        <Button type="submit" className="rounded-full bg-brand-end text-background hover:bg-brand-end/90">
          {trainer ? "Save Changes" : "Add Trainer"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// "Trainers" content tab — trainer profile cards. Exposes `openAdd` via ref
// so the page's shared "Add New" button can trigger it.
const TrainersTab = forwardRef(function TrainersTab(_props, ref) {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/trainers")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load trainers.");
        return res.json();
      })
      .then((body) => {
        if (!cancelled) setTrainers(body.trainers);
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

  function openEdit(trainer) {
    setEditing(trainer);
    setDialogOpen(true);
  }

  async function handleDelete(id) {
    const previous = trainers;
    setTrainers((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(`/api/trainers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete trainer.");
    } catch (err) {
      setTrainers(previous);
      setError(err.message);
    }
  }

  async function handleSubmit(values) {
    try {
      const res = await fetch(editing ? `/api/trainers/${editing.id}` : "/api/trainers", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to save trainer.");
      const { trainer } = await res.json();
      setTrainers((prev) =>
        editing ? prev.map((t) => (t.id === trainer.id ? trainer : t)) : [...prev, trainer]
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
        Loading trainers...
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trainers.map((trainer, i) => (
          <div key={trainer.id} className="group glass-tile rounded-2xl p-6 text-center">
            <div className="relative mx-auto w-fit">
              <ImageWithFallback
                src={trainer.photoUrl}
                gradient={GRADIENTS[i % GRADIENTS.length]}
                className="size-20 rounded-full border border-border"
              />
              <div className="absolute -top-1 -right-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => openEdit(trainer)}
                  aria-label={`Edit ${trainer.name}`}
                  className="flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-white/20"
                >
                  <Pencil className="size-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(trainer.id)}
                  aria-label={`Delete ${trainer.name}`}
                  className="flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-brand-start/60"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            </div>
            <p className="mt-4 font-medium">{trainer.name}</p>
            <p className="mt-1 text-xs font-bold text-brand-mid uppercase">{trainer.specialty}</p>
            <p className="mt-3 text-sm text-muted-foreground">{trainer.bio}</p>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          {dialogOpen ? (
            <TrainerForm key={editing?.id ?? "new"} trainer={editing} onSubmit={handleSubmit} />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default TrainersTab;
