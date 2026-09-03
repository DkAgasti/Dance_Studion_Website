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
import { interestName } from "@/config/classes";

function batchLabel(batch) {
  return `${batch.days} • ${batch.time} — ₹${batch.price}/mo (${batch.capacity - batch.enrolled} seats left)`;
}

// Mounted fresh (via `key` on the caller) each time the dialog opens, so its
// state is seeded once with no effect needed to reset it between opens.
function ConvertForm({ booking, onConfirm }) {
  const [classes, setClasses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classId, setClassId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/classes").then((res) => (res.ok ? res.json() : { classes: [] })),
      fetch("/api/batches").then((res) => (res.ok ? res.json() : { batches: [] })),
    ])
      .then(([classesBody, batchesBody]) => {
        if (cancelled) return;
        const fetchedClasses = classesBody.classes ?? [];
        setClasses(fetchedClasses);
        setBatches(batchesBody.batches ?? []);

        // Best-effort convenience: preselect the class matching what they
        // said they were interested in on the trial form.
        const interested = (interestName(booking?.interests?.[0]) || "").trim().toLowerCase();
        const match = fetchedClasses.find((c) => c.name.trim().toLowerCase() === interested);
        if (match) setClassId(match.id);
      })
      .catch(() => {
        // network hiccup — leave selects empty rather than crash
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [booking]);

  const batchOptions = batches.filter((b) => b.classId === classId);

  function handleClassChange(value) {
    setClassId(value);
    setBatchId("");
  }

  async function handleConfirm() {
    if (!classId) return;
    setSubmitting(true);
    try {
      await onConfirm(classId, batchId || null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Convert to Admission</DialogTitle>
        <DialogDescription>
          Creates a pending Admission for {booking?.name ?? "this applicant"} using their trial
          booking details — approve it from Admissions once it&apos;s ready.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-2 flex flex-col gap-3">
        <div className="glass-tile rounded-xl p-3 text-sm">
          <p className="font-medium">{booking?.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {[booking?.phone, booking?.email].filter(Boolean).join(" • ")}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Class</Label>
          <Select value={classId} onValueChange={handleClassChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={loading ? "Loading classes..." : "Select a class"} />
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!loading && !classes.length ? (
            <p className="text-xs text-muted-foreground">
              No classes yet — create one under Admin → Classes first.
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Batch (optional)</Label>
          <Select value={batchId} onValueChange={setBatchId} disabled={!classId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={!classId ? "Pick a class first" : "Select a batch"} />
            </SelectTrigger>
            <SelectContent>
              {batchOptions.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {batchLabel(b)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {classId && !batchOptions.length ? (
            <p className="text-xs text-muted-foreground">
              No batches for this class yet — plan will be set once one&apos;s added.
            </p>
          ) : null}
        </div>
      </div>

      <DialogFooter className="mt-4">
        <Button
          onClick={handleConfirm}
          disabled={!classId || submitting}
          className="rounded-full bg-primary text-white hover:bg-primary/90"
        >
          {submitting ? "Creating..." : "Create Admission"}
        </Button>
      </DialogFooter>
    </>
  );
}

// Shown when marking a trial booking "Converted" — picks the real class/
// batch to create the applicant's Admission in the same step (see PATCH
// /api/trial-bookings/[id]), instead of the admin re-entering their contact
// details separately under Admissions.
export default function ConvertToAdmissionDialog({ open, onOpenChange, booking, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {open ? (
          <ConvertForm key={booking?.id ?? "none"} booking={booking} onConfirm={onConfirm} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
