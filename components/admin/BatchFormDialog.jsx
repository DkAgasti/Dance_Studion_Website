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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trainerOptions, studioOptions } from "@/components/admin/batchesData";

const LEVEL_OPTIONS = ["Beginner Level", "Intermediate Level", "Advanced Level", "Open Level", "All Ages"];

const EMPTY_FORM = {
  classId: "",
  level: "",
  studio: "",
  days: "",
  time: "",
  capacity: "",
  trainer: "",
  price: "",
};

function batchToForm(batch) {
  if (!batch) return EMPTY_FORM;
  return {
    classId: batch.classId,
    level: batch.level,
    studio: batch.studio,
    days: batch.days,
    time: batch.time,
    capacity: String(batch.capacity),
    trainer: batch.trainer,
    price: String(batch.price),
  };
}

function BatchForm({ batch, onSubmit }) {
  const [form, setForm] = useState(() => batchToForm(batch));
  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/classes")
      .then((res) => (res.ok ? res.json() : { classes: [] }))
      .then((body) => {
        if (!cancelled) setClasses(body.classes ?? []);
      })
      .catch(() => {
        // network hiccup — leave classes empty rather than crash
      })
      .finally(() => {
        if (!cancelled) setClassesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function set(key) {
    return (value) => setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ ...form, capacity: Number(form.capacity), price: Number(form.price) });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full min-w-0">
      <DialogHeader>
        <DialogTitle>{batch ? "Edit Batch" : "Add New Batch"}</DialogTitle>
        <DialogDescription>
          {batch
            ? "Update this batch's schedule and details."
            : "Set up a new dance/fitness batch schedule."}
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-1.5 sm:col-span-2">
          <Label>Class</Label>
          <Select value={form.classId} onValueChange={set("classId")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={classesLoading ? "Loading classes..." : "Select a class"} />
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!classesLoading && !classes.length ? (
            <p className="text-xs text-muted-foreground">
              No classes yet — create one under Admin → Classes first.
            </p>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <Label>Level</Label>
          <Select value={form.level} onValueChange={set("level")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a level" />
            </SelectTrigger>
            <SelectContent>
              {LEVEL_OPTIONS.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <Label>Studio</Label>
          <Select value={form.studio} onValueChange={set("studio")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a studio" />
            </SelectTrigger>
            <SelectContent>
              {studioOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="b-days">Days</Label>
          <Input
            id="b-days"
            placeholder="e.g. Mon, Wed, Fri"
            required
            value={form.days}
            onChange={(e) => set("days")(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="b-time">Time</Label>
          <Input
            id="b-time"
            placeholder="e.g. 6:00 PM"
            required
            value={form.time}
            onChange={(e) => set("time")(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="b-capacity">Capacity</Label>
          <Input
            id="b-capacity"
            type="number"
            min="1"
            required
            value={form.capacity}
            onChange={(e) => set("capacity")(e.target.value)}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <Label>Trainer</Label>
          <Select value={form.trainer} onValueChange={set("trainer")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a trainer" />
            </SelectTrigger>
            <SelectContent>
              {trainerOptions.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="b-price">Price (₹/month)</Label>
          <Input
            id="b-price"
            type="number"
            min="0"
            required
            value={form.price}
            onChange={(e) => set("price")(e.target.value)}
          />
        </div>
      </div>

      <DialogFooter className="mt-2">
        <Button
          type="submit"
          className="rounded-full bg-brand-end text-white hover:bg-brand-end/90"
        >
          {batch ? "Save Changes" : "Add Batch"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// Add/Edit batch dialog — visual only for now (no backend).
export default function BatchFormDialog({ open, onOpenChange, batch, onSubmit }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-lg">
        {open ? <BatchForm key={batch?.id ?? "new"} batch={batch} onSubmit={onSubmit} /> : null}
      </DialogContent>
    </Dialog>
  );
}
