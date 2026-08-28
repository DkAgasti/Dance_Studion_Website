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
import { classOptions, planOptions } from "@/components/admin/studentsData";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  className: "",
  batch: "",
  plan: "",
  guardianName: "",
  guardianPhone: "",
  guardianRelation: "",
};

function studentToForm(student) {
  if (!student) return EMPTY_FORM;
  return {
    name: student.name,
    email: student.email ?? "",
    phone: student.phone,
    className: student.className ?? "",
    batch: student.batchLabel ?? "",
    plan: student.planLabel ?? "",
    guardianName: student.guardian ?? "",
    guardianPhone: student.guardianPhone ?? "",
    guardianRelation: student.guardianRelation ?? "",
  };
}

// The actual form body — mounted fresh (via `key` on the caller) each time
// the dialog opens, so its state is seeded once from `student` with no
// effect needed to re-sync it.
function StudentForm({ student, onSubmit }) {
  const [form, setForm] = useState(() => studentToForm(student));

  function set(key) {
    return (value) => setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{student ? "Edit Student" : "Add Student"}</DialogTitle>
        <DialogDescription>
          {student
            ? "Update this student's details."
            : "Enter the student and guardian details to add a new record."}
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex flex-col gap-4">
        <p className="eyebrow !text-[10px]">Student</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="s-name">Full Name</Label>
            <Input
              id="s-name"
              required
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="s-email">Email</Label>
            <Input
              id="s-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => set("email")(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="s-phone">Phone</Label>
            <Input
              id="s-phone"
              required
              value={form.phone}
              onChange={(e) => set("phone")(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Class</Label>
            <Select value={form.className} onValueChange={set("className")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classOptions.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="s-batch">Batch</Label>
            <Input
              id="s-batch"
              placeholder="e.g. Mon/Wed/Fri (6 PM)"
              required
              value={form.batch}
              onChange={(e) => set("batch")(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Plan</Label>
            <Select value={form.plan} onValueChange={set("plan")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {planOptions.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="eyebrow mt-2 !text-[10px]">Guardian</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="g-name">Guardian Name</Label>
            <Input
              id="g-name"
              value={form.guardianName}
              onChange={(e) => set("guardianName")(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="g-phone">Guardian Phone</Label>
            <Input
              id="g-phone"
              value={form.guardianPhone}
              onChange={(e) => set("guardianPhone")(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="g-relation">Relation</Label>
            <Input
              id="g-relation"
              placeholder="e.g. Mother, Father, Guardian"
              value={form.guardianRelation}
              onChange={(e) => set("guardianRelation")(e.target.value)}
            />
          </div>
        </div>
      </div>

      <DialogFooter className="mt-2">
        <Button type="submit" className="rounded-full bg-brand-end text-background hover:bg-brand-end/90">
          {student ? "Save Changes" : "Add Student"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// Add/Edit student dialog — visual only for now (no backend), calls
// onSubmit with the form values so the caller can update local state.
export default function StudentFormDialog({ open, onOpenChange, student, onSubmit }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-lg">
        {open ? (
          <StudentForm key={student?.id ?? "new"} student={student} onSubmit={onSubmit} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
