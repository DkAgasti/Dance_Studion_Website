"use client";

import { useState } from "react";
import { X, Download, Check, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { cn } from "@/lib/utils";

// Roster / attendance side panel — shown when a batch card is selected.
// Attendance toggling is local-state only (no backend yet).
export default function BatchRosterPanel({ batch, onClose }) {
  const [students, setStudents] = useState(batch.students);

  function toggleAttendance(id) {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, present: !s.present } : s))
    );
  }

  const presentCount = students.filter((s) => s.present).length;

  return (
    <div className="glass-tile flex h-fit w-full flex-col rounded-2xl p-6 lg:w-96 lg:shrink-0">
      <div className="flex items-start justify-between gap-3">
        <h3 className="h4-display">{batch.name}</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-white/10 hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-brand-end/15 px-3 py-1 text-xs font-bold text-brand-end">
          {batch.enrolled} Students
        </span>
        <Button variant="outline" size="sm" className="gap-1.5 rounded-full border-border">
          <Download className="size-3.5" />
          Export Attendance
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5 text-sm">
        <div>
          <p className="eyebrow !text-[10px]">Timing</p>
          <p className="mt-1.5">
            {batch.days} ({batch.time})
          </p>
        </div>
        <div>
          <p className="eyebrow !text-[10px]">Trainer</p>
          <p className="mt-1.5">{batch.trainer}</p>
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <div className="flex items-center justify-between">
          <p className="eyebrow !text-[10px]">Enrolled Students</p>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-ok" />
            {presentCount} Present
          </span>
        </div>

        <ul className="mt-4 flex flex-col gap-2">
          {students.map((student) => (
            <li
              key={student.id}
              className="flex items-center gap-3 rounded-xl bg-white/[0.02] p-3"
            >
              <ImageWithFallback
                gradient="from-brand-mid/25 via-surface to-brand-start/15"
                className="size-10 shrink-0 rounded-full"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{student.name}</p>
                <p className="text-xs text-muted-foreground">
                  Join date: {student.joinDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleAttendance(student.id)}
                aria-pressed={student.present}
                aria-label={`Mark ${student.name} ${student.present ? "absent" : "present"}`}
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-md border transition-colors",
                  student.present
                    ? "border-ok bg-ok/15 text-ok"
                    : "border-border text-transparent hover:border-white/30"
                )}
              >
                <Check className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Button className="mt-6 h-12 w-full gap-2 rounded-full bg-brand-end font-bold text-white hover:bg-brand-end/90">
        <UserPlus className="size-4" />
        Enroll New Student
      </Button>
    </div>
  );
}
