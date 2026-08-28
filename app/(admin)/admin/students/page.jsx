"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/admin/DataTable";
import SegmentedToggle from "@/components/admin/SegmentedToggle";
import StudentFilters from "@/components/admin/StudentFilters";
import StudentFormDialog from "@/components/admin/StudentFormDialog";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { feeStatusMeta, classOptions } from "@/components/admin/studentsData";

const PAGE_SIZE = 10;

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", { dateStyle: "medium" });
}

export default function AdminStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("active");
  const [classFilter, setClassFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [feeFilter, setFeeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/students");
        if (!res.ok) throw new Error("Failed to load students.");
        const body = await res.json();
        if (!cancelled) setStudents(body.students);
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

  const batchOptions = useMemo(
    () => Array.from(new Set(students.map((s) => s.batchLabel).filter(Boolean))),
    [students]
  );

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesActive = activeTab === "active" ? s.active : !s.active;
      const matchesClass = classFilter === "all" || s.className === classFilter;
      const matchesBatch = batchFilter === "all" || s.batchLabel === batchFilter;
      const matchesFee = feeFilter === "all" || s.feeStatus === feeFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.className ?? "").toLowerCase().includes(q) ||
        (s.batchLabel ?? "").toLowerCase().includes(q);
      return matchesActive && matchesClass && matchesBatch && matchesFee && matchesSearch;
    });
  }, [students, activeTab, classFilter, batchFilter, feeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function resetPage() {
    setPage(1);
  }

  async function handleAddStudent(values) {
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const resBody = await res.json().catch(() => null);
        throw new Error(resBody?.error || "Failed to add student.");
      }
      const { student } = await res.json();
      setStudents((prev) => [student, ...prev]);
      setDialogOpen(false);
    } catch (err) {
      setError(err.message);
    }
  }

  const columns = [
    {
      key: "name",
      label: "Student Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <ImageWithFallback
            gradient="from-brand-mid/25 via-surface to-brand-start/15"
            className="size-9 shrink-0 rounded-full"
          />
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">#{row.code}</p>
          </div>
        </div>
      ),
    },
    { key: "className", label: "Class" },
    { key: "batchLabel", label: "Batch" },
    { key: "planLabel", label: "Plan" },
    {
      key: "feeStatus",
      label: "Fee Status",
      render: (row) => {
        const meta = feeStatusMeta[row.feeStatus];
        return (
          <span className={`flex items-center gap-1.5 text-xs font-bold ${meta.text}`}>
            <span className={`size-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
        );
      },
    },
    {
      key: "joinDate",
      label: "Join Date",
      render: (row) => <span>{formatDate(row.joinDate)}</span>,
    },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <button
          type="button"
          onClick={() => router.push(`/admin/students/${row.id}`)}
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
          <h1 className="font-display text-2xl font-bold">Students</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Directory of all active and inactive students.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SegmentedToggle
            options={[
              { key: "active", label: "Active" },
              { key: "inactive", label: "Inactive" },
            ]}
            active={activeTab}
            onChange={(v) => {
              setActiveTab(v);
              resetPage();
            }}
          />
          <Button
            className="gap-2 rounded-full bg-brand-end text-background hover:bg-brand-end/90"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="size-4" />
            Add Student
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <StudentFilters
          classOptions={classOptions}
          batchOptions={batchOptions}
          classFilter={classFilter}
          batchFilter={batchFilter}
          feeFilter={feeFilter}
          onClassChange={(v) => {
            setClassFilter(v);
            resetPage();
          }}
          onBatchChange={(v) => {
            setBatchFilter(v);
            resetPage();
          }}
          onFeeChange={(v) => {
            setFeeFilter(v);
            resetPage();
          }}
        />
        <p className="text-sm text-muted-foreground">
          Total Students: <span className="font-bold text-foreground">{filtered.length}</span>
        </p>
      </div>

      {error ? (
        <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="glass-tile rounded-2xl p-6">
        <div className="mb-4 flex justify-end">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              placeholder="Search students by name, class or batch..."
              className="h-10 w-full rounded-full border border-border bg-white/[0.04] pr-4 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/50 focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading students...
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              rows={paged}
              onRowClick={(row) => router.push(`/admin/students/${row.id}`)}
            />

            <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground sm:flex-row">
              <p>
                Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to{" "}
                {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} entries
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

      <StudentFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleAddStudent} />
    </div>
  );
}
