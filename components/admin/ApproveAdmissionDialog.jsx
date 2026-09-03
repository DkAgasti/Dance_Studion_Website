"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function batchLabel(batch) {
  return `${batch.name} — ${batch.days} • ${batch.time} (${batch.capacity - batch.enrolled} seats left)`;
}

// Mounted fresh (via `key` on the caller) each time the dialog opens, so its
// state is seeded once with no effect needed to reset it between opens.
function ApproveForm({ applicant, onConfirm }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [batchId, setBatchId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/batches")
      .then((res) => (res.ok ? res.json() : { batches: [] }))
      .then((body) => {
        if (!cancelled) setBatches(body.batches ?? []);
      })
      .catch(() => {
        // network hiccup — leave batches empty rather than crash
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleConfirm() {
    if (!batchId) return;
    setSubmitting(true);
    try {
      await onConfirm(batchId);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Approve & Enroll</DialogTitle>
        <DialogDescription>
          Pick the batch {applicant?.studentName ?? "this applicant"} will join. This creates
          their Student record and counts them against that batch&apos;s capacity.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-2 flex flex-col gap-1.5">
        <Label>Batch</Label>
        <Select value={batchId} onValueChange={setBatchId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={loading ? "Loading batches..." : "Select a batch"} />
          </SelectTrigger>
          <SelectContent>
            {batches.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {batchLabel(b)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!loading && !batches.length ? (
          <p className="text-xs text-muted-foreground">
            No batches yet — create one under Admin → Batches first.
          </p>
        ) : null}
      </div>

      <DialogFooter className="mt-4">
        <Button
          onClick={handleConfirm}
          disabled={!batchId || submitting}
          className="rounded-full bg-brand-end text-white hover:bg-brand-end/90"
        >
          {submitting ? "Approving..." : "Approve & Enroll"}
        </Button>
      </DialogFooter>
    </>
  );
}

// Shown when approving an admission — picks the real Batch to enroll the
// applicant into, so the new Student is properly counted against that
// batch's capacity. Confirming both approves the admission and creates
// the Student in one step (see PATCH /api/admissions/[id]).
export default function ApproveAdmissionDialog({ open, onOpenChange, applicant, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {open ? <ApproveForm key={applicant?.id ?? "none"} applicant={applicant} onConfirm={onConfirm} /> : null}
      </DialogContent>
    </Dialog>
  );
}
