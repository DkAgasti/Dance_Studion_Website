"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, Plus, Search, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/admin/DataTable";
import AdmissionFilters from "@/components/admin/AdmissionFilters";
import AdmissionDetailPanel from "@/components/admin/AdmissionDetailPanel";
import DetailDrawer from "@/components/admin/DetailDrawer";
import ApproveAdmissionDialog from "@/components/admin/ApproveAdmissionDialog";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { statusMeta, statusToKey } from "@/components/admin/admissionsData";

const PAGE_SIZE = 5;

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", { dateStyle: "medium" });
}

function downloadCsv(rows) {
  const header = ["Name", "Email", "Class", "Submitted", "Status"];
  const lines = rows.map((r) =>
    [r.studentName, r.email ?? "", r.classInterest ?? "", formatDate(r.createdAt), r.status].join(
      ","
    )
  );
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "admissions.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminAdmissionsPage() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admissions");
        if (!res.ok) throw new Error("Failed to load admissions.");
        const body = await res.json();
        if (!cancelled) setAdmissions(body.admissions);
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

  const counts = useMemo(
    () => ({
      all: admissions.length,
      pending: admissions.filter((a) => statusToKey[a.status] === "pending").length,
      approved: admissions.filter((a) => statusToKey[a.status] === "approved").length,
      rejected: admissions.filter((a) => statusToKey[a.status] === "rejected").length,
    }),
    [admissions]
  );

  const filtered = useMemo(() => {
    return admissions.filter((a) => {
      const matchesFilter = filter === "all" || statusToKey[a.status] === filter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        a.studentName.toLowerCase().includes(q) ||
        (a.email ?? "").toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [admissions, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const selected = admissions.find((a) => a.id === selectedId) ?? null;

  async function updateStatus(id, status, batchId) {
    const previous = admissions;
    setAdmissions((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

    try {
      const res = await fetch(`/api/admissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, batchId }),
      });
      if (!res.ok) {
        const resBody = await res.json().catch(() => null);
        throw new Error(resBody?.error || "Failed to update status.");
      }
      return true;
    } catch (err) {
      setAdmissions(previous);
      setError(err.message);
      return false;
    }
  }

  async function handleApproveConfirm(batchId) {
    const ok = await updateStatus(selectedId, "APPROVED", batchId);
    if (ok) setApproveDialogOpen(false);
  }

  // The applicant already picked a specific batch on the admission form —
  // approve straight into it instead of asking the admin to pick again. Only
  // fall back to the picker dialog when no batch was captured (e.g. the
  // class had none scheduled yet at submission time).
  function handleApproveClick() {
    if (selected?.batchId) {
      updateStatus(selected.id, "APPROVED", selected.batchId);
    } else {
      setApproveDialogOpen(true);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete ${selected.studentName}'s admission? This can't be undone.`)) {
      return;
    }
    const previous = admissions;
    setAdmissions((prev) => prev.filter((a) => a.id !== selected.id));
    setSelectedId(null);

    try {
      const res = await fetch(`/api/admissions/${selected.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete admission.");
    } catch (err) {
      setAdmissions(previous);
      setError(err.message);
    }
  }

  function handleFilterChange(next) {
    setFilter(next);
    setPage(1);
  }

  const columns = [
    {
      key: "name",
      label: "Student",
      render: (row) => (
        <div className="flex items-center gap-3">
          <ImageWithFallback
            src={row.photoUrl}
            label={row.studentName}
            gradient="from-brand-mid/25 via-surface to-brand-start/15"
            className="size-9 shrink-0 rounded-full"
          />
          <div>
            <p className="font-medium">{row.studentName}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: "classInterest", label: "Class Selection" },
    {
      key: "submittedDate",
      label: "Submitted Date",
      render: (row) => <span>{formatDate(row.createdAt)}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const meta = statusMeta[statusToKey[row.status]];
        return meta.bg ? (
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ${meta.bg} ${meta.text}`}>
            {meta.label}
          </span>
        ) : (
          <span className={`flex items-center gap-1.5 text-xs font-bold ${meta.text}`}>
            <span className={`size-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
        );
      },
    },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelectedId(row.id)}
          aria-label={`View ${row.studentName}`}
          className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-white/10 hover:text-foreground"
        >
          <ChevronRight className="size-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Admissions Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review and process new student applications.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2 rounded-full border-border"
            onClick={() => downloadCsv(filtered)}
            disabled={!filtered.length}
          >
            <Download className="size-4" />
            Export CSV
          </Button>
          <Button asChild className="gap-2 rounded-full bg-brand-end text-white hover:bg-brand-end/90">
            <Link href="/admissions">
              <Plus className="size-4" />
              New Entry
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <AdmissionFilters active={filter} onChange={handleFilterChange} counts={counts} />
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search admissions..."
            className="h-10 w-full rounded-full border border-border bg-white/[0.04] pr-4 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/50 focus:outline-none"
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-6">
        <div className="glass-tile min-w-0 flex-1 rounded-2xl p-6">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading admissions...
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                rows={paged}
                onRowClick={(row) => setSelectedId(row.id)}
                selectedId={selectedId}
              />

              <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground sm:flex-row">
                <p>
                  Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to{" "}
                  {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
                  admissions
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="flex size-7 items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-30"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPage(n)}
                      className={`flex size-7 items-center justify-center rounded-full font-bold ${
                        n === currentPage
                          ? "bg-brand-end text-white"
                          : "hover:bg-white/10"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className="flex size-7 items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-30"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

      <DetailDrawer open={!!selected} onClose={() => setSelectedId(null)}>
        {selected ? (
          <AdmissionDetailPanel
            applicant={selected}
            onClose={() => setSelectedId(null)}
            onApprove={handleApproveClick}
            onReject={() => updateStatus(selected.id, "REJECTED")}
            onDelete={handleDelete}
          />
        ) : null}
      </DetailDrawer>

      <ApproveAdmissionDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        applicant={selected}
        onConfirm={handleApproveConfirm}
      />
    </div>
  );
}
