"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BatchCard from "@/components/admin/BatchCard";
import BatchRosterPanel from "@/components/admin/BatchRosterPanel";
import BatchFormDialog from "@/components/admin/BatchFormDialog";

const ICON_BY_STYLE = { hip: "music", con: "feather", zum: "zap", cla: "sparkles" };

function guessIcon(name) {
  const key = name.toLowerCase().slice(0, 3);
  return ICON_BY_STYLE[key] ?? "sparkles";
}

const ACCENTS = ["brand-end", "brand-mid", "brand-lime", "brand-start"];

function withDisplay(batch, i) {
  return { ...batch, iconName: guessIcon(batch.name), accent: ACCENTS[i % ACCENTS.length] };
}

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/batches");
        if (!res.ok) throw new Error("Failed to load batches.");
        const body = await res.json();
        if (!cancelled) setBatches(body.batches);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayBatches = batches.map(withDisplay);
  const selected = displayBatches.find((b) => b.id === selectedId) ?? null;

  function openAddDialog() {
    setEditingBatch(null);
    setDialogOpen(true);
  }

  function openEditDialog(batch) {
    setEditingBatch(batch);
    setDialogOpen(true);
  }

  async function handleDelete(batch) {
    const previous = batches;
    setBatches((prev) => prev.filter((b) => b.id !== batch.id));
    if (selectedId === batch.id) setSelectedId(null);

    try {
      const res = await fetch(`/api/batches/${batch.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete batch.");
    } catch (err) {
      setBatches(previous);
      setError(err.message);
    }
  }

  async function handleSubmit(values) {
    try {
      const res = await fetch(
        editingBatch ? `/api/batches/${editingBatch.id}` : "/api/batches",
        {
          method: editingBatch ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      if (!res.ok) {
        const resBody = await res.json().catch(() => null);
        throw new Error(resBody?.error || "Failed to save batch.");
      }
      const { batch } = await res.json();
      setBatches((prev) =>
        editingBatch ? prev.map((b) => (b.id === batch.id ? batch : b)) : [batch, ...prev]
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
          <h1 className="font-display text-2xl font-bold">Batches</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organize and monitor dance style schedules.
          </p>
        </div>
        <Button
          className="w-fit gap-2 rounded-full bg-brand-end text-background hover:bg-brand-end/90"
          onClick={openAddDialog}
        >
          <Plus className="size-4" />
          Add New Batch
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
          Loading batches...
        </div>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {displayBatches.map((batch) => (
              <BatchCard
                key={batch.id}
                batch={batch}
                onSelect={(b) => setSelectedId(b.id)}
                onEdit={openEditDialog}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {selected ? (
            <BatchRosterPanel batch={selected} onClose={() => setSelectedId(null)} />
          ) : null}
        </div>
      )}

      <BatchFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        batch={editingBatch}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
