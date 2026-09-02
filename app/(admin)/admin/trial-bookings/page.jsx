"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Search, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/admin/DataTable";
import StatusFilters from "@/components/admin/StatusFilters";
import TrialDetailPanel from "@/components/admin/TrialDetailPanel";
import DetailDrawer from "@/components/admin/DetailDrawer";
import ConvertToAdmissionDialog from "@/components/admin/ConvertToAdmissionDialog";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { trialStatusMeta, statusToKey } from "@/components/admin/trialBookingsData";
import { interestName } from "@/config/classes";

const PAGE_SIZE = 5;

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "attended", label: "Attended" },
  { key: "converted", label: "Converted" },
  { key: "no-show", label: "No-show" },
];

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", { dateStyle: "medium" });
}

function formatTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString("en-IN", { timeStyle: "short" });
}

function downloadCsv(rows) {
  const header = ["Name", "Email", "Interest", "Age Group", "Preferred", "Status", "Created"];
  const lines = rows.map((r) =>
    [
      r.name,
      r.email ?? "",
      r.interests?.map(interestName).join("; ") ?? "",
      r.ageGroup ?? "",
      `${formatDate(r.preferredDateTime)} ${formatTime(r.preferredDateTime)}`,
      r.status,
      formatDate(r.createdAt),
    ].join(",")
  );
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "trial-bookings.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminTrialBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/trial-bookings");
        if (!res.ok) throw new Error("Failed to load trial bookings.");
        const body = await res.json();
        if (!cancelled) setBookings(body.trialBookings);
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
      all: bookings.length,
      new: bookings.filter((b) => statusToKey[b.status] === "new").length,
      attended: bookings.filter((b) => statusToKey[b.status] === "attended").length,
      converted: bookings.filter((b) => statusToKey[b.status] === "converted").length,
      "no-show": bookings.filter((b) => statusToKey[b.status] === "no-show").length,
    }),
    [bookings]
  );

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchesFilter = filter === "all" || statusToKey[b.status] === filter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        (b.email ?? "").toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [bookings, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const selected = bookings.find((b) => b.id === selectedId) ?? null;

  async function updateStatus(id, status) {
    const previous = bookings;
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));

    try {
      const res = await fetch(`/api/trial-bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status.");
    } catch (err) {
      setBookings(previous);
      setError(err.message);
    }
  }

  async function handleConvertConfirm(classId, batchId) {
    if (!selected) return;
    try {
      const res = await fetch(`/api/trial-bookings/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CONVERTED", classId, batchId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Failed to create admission.");
      }
      setBookings((prev) =>
        prev.map((b) => (b.id === selected.id ? { ...b, status: "CONVERTED" } : b))
      );
      setConvertDialogOpen(false);
    } catch (err) {
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
      label: "Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <ImageWithFallback
            gradient="from-brand-end/20 via-surface to-brand-lime/10"
            className="size-9 shrink-0 rounded-full"
          />
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "interest",
      label: "Interest",
      render: (row) => <span>{row.interests?.map(interestName).join(", ")}</span>,
    },
    { key: "ageGroup", label: "Age Group" },
    {
      key: "preferred",
      label: "Preferred Date & Time",
      render: (row) => (
        <span>
          {formatDate(row.preferredDateTime)} • {formatTime(row.preferredDateTime)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const meta = trialStatusMeta[statusToKey[row.status]];
        return (
          <span className={`flex items-center gap-1.5 text-xs font-bold ${meta.text}`}>
            <span className={`size-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
        );
      },
    },
    {
      key: "createdDate",
      label: "Created",
      render: (row) => <span>{formatDate(row.createdAt)}</span>,
    },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelectedId(row.id)}
          aria-label={`View ${row.name}`}
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
          <h1 className="font-display text-2xl font-bold">Trial Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review trial requests and track follow-up outcomes.
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 rounded-full border-border"
          onClick={() => downloadCsv(filtered)}
          disabled={!filtered.length}
        >
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <StatusFilters tabs={FILTER_TABS} active={filter} onChange={handleFilterChange} counts={counts} />
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search trial bookings..."
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
              Loading trial bookings...
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
                  bookings
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
                        n === currentPage ? "bg-brand-end text-background" : "hover:bg-white/10"
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
          <TrialDetailPanel
            booking={selected}
            onClose={() => setSelectedId(null)}
            onMarkAttended={() => updateStatus(selected.id, "ATTENDED")}
            onMarkConverted={() => setConvertDialogOpen(true)}
            onMarkNoShow={() => updateStatus(selected.id, "NO_SHOW")}
          />
        ) : null}
      </DetailDrawer>

      <ConvertToAdmissionDialog
        open={convertDialogOpen}
        onOpenChange={setConvertDialogOpen}
        booking={selected}
        onConfirm={handleConvertConfirm}
      />
    </div>
  );
}
