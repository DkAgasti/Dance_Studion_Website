"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import ClassFormDialog from "@/components/admin/ClassFormDialog";

const GRADIENTS = [
  "from-brand-start/25 via-surface to-brand-mid/20",
  "from-brand-mid/25 via-surface to-brand-start/20",
  "from-brand-end/25 via-surface to-brand-lime/15",
  "from-brand-lime/25 via-surface to-brand-end/15",
];

export default function AdminClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/classes")
      .then((res) => res.json())
      .then((body) => {
        if (!cancelled) setClasses(body.classes ?? []);
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

  function openEdit(danceClass) {
    setEditing(danceClass);
    setDialogOpen(true);
  }

  async function handleDelete(id) {
    const previous = classes;
    setClasses((prev) => prev.filter((c) => c.id !== id));
    try {
      const res = await fetch(`/api/classes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete class.");
    } catch (err) {
      setClasses(previous);
      setError(err.message);
    }
  }

  async function handleSubmit(values) {
    try {
      const res = await fetch(editing ? `/api/classes/${editing.id}` : "/api/classes", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const resBody = await res.json().catch(() => null);
        throw new Error(resBody?.error || "Failed to save class.");
      }
      const { danceClass } = await res.json();
      setClasses((prev) =>
        editing ? prev.map((c) => (c.id === danceClass.id ? danceClass : c)) : [...prev, danceClass]
      );
      setDialogOpen(false);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Classes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the styles shown on the public /classes page — Age and Style filters
            are generated from these.
          </p>
        </div>
        <Button
          className="w-fit gap-2 rounded-full bg-brand-end text-background hover:bg-brand-end/90"
          onClick={openAdd}
        >
          <Plus className="size-4" />
          Add Class
        </Button>
      </div>

      {error ? (
        <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading classes...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((c, i) => (
            <div key={c.id} className="group glass-tile overflow-hidden rounded-2xl">
              <div className="relative aspect-4/3">
                <ImageWithFallback
                  src={c.imageUrl}
                  gradient={GRADIENTS[i % GRADIENTS.length]}
                  className="absolute inset-0"
                />
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => openEdit(c)}
                    aria-label={`Edit ${c.name}`}
                    className="flex size-7 items-center justify-center rounded-full bg-black/40 text-white hover:bg-white/20"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
                    aria-label={`Delete ${c.name}`}
                    className="flex size-7 items-center justify-center rounded-full bg-black/40 text-white hover:bg-brand-start/40"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="font-medium">{c.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {[c.level, c.ageGroup].filter(Boolean).join(" • ") || "—"}
                </p>
                {c.description ? (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {c.description}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      <ClassFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        danceClass={editing}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
