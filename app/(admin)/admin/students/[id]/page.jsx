"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Pencil, Mail, Phone, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import StudentFormDialog from "@/components/admin/StudentFormDialog";
import FeeHistoryTimeline from "@/components/admin/FeeHistoryTimeline";
import { feeStatusMeta } from "@/components/admin/studentsData";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", { dateStyle: "medium" });
}

// Single student profile page — contact/guardian/class info, fee history,
// and an edit dialog. Data comes from GET/PATCH /api/students/[id].
export default function AdminStudentDetailPage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/students/${id}`);
        if (!res.ok) throw new Error("Failed to load student.");
        const body = await res.json();
        if (!cancelled) setStudent(body.student);
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
  }, [id]);

  async function handleSave(values) {
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to save changes.");
      const body = await res.json();
      setStudent(body.student);
      setEditOpen(false);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading student...
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-muted-foreground">{error || "Student not found."}</p>
        <Link href="/admin/students" className="text-sm font-bold text-brand-end hover:underline">
          Back to Students
        </Link>
      </div>
    );
  }

  const meta = feeStatusMeta[student.feeStatus];
  const feeHistory = student.fees.map((f) => ({
    date: formatDate(f.paidAt ?? f.dueDate),
    amount: f.amount,
    status: f.status === "OVERDUE" ? "overdue" : f.status === "PAID" ? "paid" : "due-soon",
    method: "—",
  }));

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/students"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Students
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <ImageWithFallback
            gradient="from-brand-mid/30 via-surface to-brand-start/20"
            className="size-16 shrink-0 rounded-full border border-border"
          />
          <div>
            <h1 className="font-display text-2xl font-bold">{student.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>#{student.code}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  student.active ? "bg-brand-lime/15 text-brand-lime" : "bg-white/10 text-muted-foreground"
                }`}
              >
                {student.active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-fit gap-2 rounded-full border-border"
          onClick={() => setEditOpen(true)}
        >
          <Pencil className="size-4" />
          Edit Student
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass-tile rounded-2xl p-6">
          <h3 className="flex items-center gap-2 font-medium">
            <Mail className="size-4 text-brand-mid" />
            Contact
          </h3>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <p className="text-muted-foreground">{student.email}</p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="size-3.5" />
              {student.phone}
            </p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-6">
          <h3 className="flex items-center gap-2 font-medium">
            <Users className="size-4 text-brand-end" />
            Guardian
          </h3>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <p>{student.guardian || "—"}</p>
            <p className="text-muted-foreground">{student.guardianRelation}</p>
            <p className="text-muted-foreground">{student.guardianPhone}</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-6">
          <h3 className="font-medium">Class &amp; Plan</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <p>
              <span className="text-muted-foreground">Class: </span>
              {student.className}
            </p>
            <p>
              <span className="text-muted-foreground">Batch: </span>
              {student.batchLabel}
            </p>
            <p>
              <span className="text-muted-foreground">Plan: </span>
              {student.planLabel}
            </p>
            <span
              className={`flex w-fit items-center gap-1.5 text-xs font-bold ${meta.text}`}
            >
              <span className={`size-1.5 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>
          </div>
        </div>
      </div>

      <div className="glass-tile rounded-2xl p-6">
        <h3 className="font-medium">Fee History</h3>
        <div className="mt-6">
          <FeeHistoryTimeline history={feeHistory} />
        </div>
      </div>

      <StudentFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        student={student}
        onSubmit={handleSave}
      />
    </div>
  );
}
