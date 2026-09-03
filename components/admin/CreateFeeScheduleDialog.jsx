"use client";

import { useState } from "react";
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

const EMPTY_FORM = { studentId: "", amount: "", dueDate: "", note: "" };

function ScheduleForm({ students, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);

  function set(key) {
    return (value) => setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      studentId: form.studentId,
      amount: Number(form.amount),
      dueDate: form.dueDate,
      note: form.note,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Create Fee Schedule</DialogTitle>
        <DialogDescription>
          Add a new fee due for a student. This is visual only for now — no payment is
          collected here.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Student</Label>
          <Select value={form.studentId} onValueChange={set("studentId")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {students.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name} — {s.className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              required
              value={form.amount}
              onChange={(e) => set("amount")(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="due-date">Due Date</Label>
            <Input
              id="due-date"
              type="date"
              required
              value={form.dueDate}
              onChange={(e) => set("dueDate")(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="note">Note (optional)</Label>
          <Input
            id="note"
            placeholder="e.g. Quarterly renewal"
            value={form.note}
            onChange={(e) => set("note")(e.target.value)}
          />
        </div>
      </div>

      <DialogFooter className="mt-2">
        <Button
          type="submit"
          className="rounded-full bg-brand-end text-white hover:bg-brand-end/90"
        >
          Create Schedule
        </Button>
      </DialogFooter>
    </form>
  );
}

// "Create Fee Schedule" dialog — POSTs a new fee due for a student.
export default function CreateFeeScheduleDialog({ open, onOpenChange, students, onSubmit }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {open ? <ScheduleForm students={students} onSubmit={onSubmit} /> : null}
      </DialogContent>
    </Dialog>
  );
}
