"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/admin/StatCard";
import StatusFilters from "@/components/admin/StatusFilters";
import DataTable from "@/components/admin/DataTable";
import CreateFeeScheduleDialog from "@/components/admin/CreateFeeScheduleDialog";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { feeStatusMeta, statusToKey } from "@/components/admin/feesData";

const TABS = [
  { key: "due", label: "Due" },
  { key: "overdue", label: "Overdue" },
  { key: "paid", label: "Paid" },
];

function formatMoney(n) {
  return `₹${n.toLocaleString("en-IN")}.00`;
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", { dateStyle: "medium" });
}

function isThisMonth(value) {
  if (!value) return false;
  const d = new Date(value);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

export default function AdminFeesPage() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("due");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [feesRes, studentsRes] = await Promise.all([
          fetch("/api/fees"),
          fetch("/api/students"),
        ]);
        if (!feesRes.ok) throw new Error("Failed to load fees.");
        if (!studentsRes.ok) throw new Error("Failed to load students.");
        const feesBody = await feesRes.json();
        const studentsBody = await studentsRes.json();
        if (!cancelled) {
          setFees(feesBody.fees);
          setStudents(studentsBody.students);
        }
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

  const totals = useMemo(() => {
    return fees.reduce(
      (acc, f) => {
        if (f.status === "PAID" && isThisMonth(f.paidAt)) acc.collected += f.amount;
        if (f.status === "PENDING") acc.pending += f.amount;
        if (f.status === "OVERDUE") acc.overdue += f.amount;
        return acc;
      },
      { collected: 0, pending: 0, overdue: 0 }
    );
  }, [fees]);

  const counts = useMemo(
    () => ({
      due: fees.filter((f) => statusToKey[f.status] === "due").length,
      overdue: fees.filter((f) => statusToKey[f.status] === "overdue").length,
      paid: fees.filter((f) => statusToKey[f.status] === "paid").length,
    }),
    [fees]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return fees.filter((f) => {
      const matchesTab = statusToKey[f.status] === tab;
      const matchesSearch =
        !q ||
        f.student.name.toLowerCase().includes(q) ||
        (f.student.className ?? "").toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [fees, tab, search]);

  async function markPaid(id) {
    const fee = fees.find((f) => f.id === id);
    const previous = fees;
    setFees((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "PAID", paidAt: new Date().toISOString() } : f))
    );

    try {
      const res = await fetch(`/api/fees/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to mark fee as paid.");
      const { fee: updated } = await res.json();
      setFees((prev) => prev.map((f) => (f.id === id ? updated : f)));
      toast.success(`Marked ${fee?.student.name}'s fee as paid`);
    } catch (err) {
      setFees(previous);
      setError(err.message);
    }
  }

  function sendReminder(name) {
    toast(`Reminder sent to ${name}`, {
      description: "Email reminders will be wired up later.",
      icon: <Bell className="size-4" />,
    });
  }

  async function handleCreateSchedule(values) {
    try {
      const res = await fetch("/api/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const resBody = await res.json().catch(() => null);
        throw new Error(resBody?.error || "Failed to create fee schedule.");
      }
      const { fee } = await res.json();
      setFees((prev) => [fee, ...prev]);
      setDialogOpen(false);
      toast.success(`Fee schedule created for ${fee.student.name}`);
    } catch (err) {
      setError(err.message);
    }
  }

  const columns = [
    {
      key: "studentName",
      label: "Student",
      render: (row) => (
        <div className="flex items-center gap-3">
          <ImageWithFallback
            gradient="from-brand-mid/25 via-surface to-brand-start/15"
            className="size-9 shrink-0 rounded-full"
          />
          <div>
            <p className="font-medium">{row.student.name}</p>
            <p className="text-xs text-muted-foreground">{row.student.className}</p>
          </div>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (row) => formatMoney(row.amount),
    },
    {
      key: "dueDate",
      label: "Due Date",
      render: (row) => (
        <span className={row.status === "OVERDUE" ? "text-brand-start" : undefined}>
          {formatDate(row.dueDate)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const meta = feeStatusMeta[statusToKey[row.status]];
        return (
          <span className={`flex items-center gap-1.5 text-xs font-bold ${meta.text}`}>
            <span className={`size-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          {row.status !== "PAID" ? (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-border"
              onClick={() => sendReminder(row.student.name)}
            >
              Send reminder
            </Button>
          ) : null}
          <Button
            size="sm"
            disabled={row.status === "PAID"}
            onClick={() => markPaid(row.id)}
            className="rounded-full bg-brand-end text-background hover:bg-brand-end/90 disabled:bg-white/5 disabled:text-muted-foreground"
          >
            Mark paid
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Fees Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage revenue, dues, and payment schedules.
          </p>
        </div>
        <Button
          className="w-fit gap-2 rounded-full bg-brand-end text-background hover:bg-brand-end/90"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="size-4" />
          Create Fee Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Collected This Month" value={formatMoney(totals.collected)} trend={null} />
        <StatCard label="Pending" value={formatMoney(totals.pending)} trend={null} />
        <StatCard label="Overdue" value={formatMoney(totals.overdue)} trend={null} />
      </div>

      {error ? (
        <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="glass-tile rounded-2xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <StatusFilters tabs={TABS} active={tab} onChange={setTab} counts={counts} />
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fee records..."
              className="h-10 w-full rounded-full border border-border bg-white/[0.04] pr-4 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading fees...
            </div>
          ) : (
            <DataTable columns={columns} rows={filtered} />
          )}
        </div>
      </div>

      <CreateFeeScheduleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        students={students}
        onSubmit={handleCreateSchedule}
      />
    </div>
  );
}
