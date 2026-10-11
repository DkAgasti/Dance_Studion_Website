"use client";

import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Class / Batch / Fee-status filter dropdowns for the students table.
export default function StudentFilters({
  classOptions,
  batchOptions,
  classFilter,
  batchFilter,
  feeFilter,
  onClassChange,
  onBatchChange,
  onFeeChange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <Filter className="size-4 shrink-0 text-muted-foreground" />

      <Select value={classFilter} onValueChange={onClassChange}>
        <SelectTrigger className="h-9 rounded-full border-border bg-white/[0.03] px-4">
          <SelectValue placeholder="All Classes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Classes</SelectItem>
          {classOptions.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="h-5 w-px bg-border" />

      <Select value={batchFilter} onValueChange={onBatchChange}>
        <SelectTrigger className="h-9 rounded-full border-border bg-white/[0.03] px-4">
          <SelectValue placeholder="All Batches" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Batches</SelectItem>
          {batchOptions.map((b) => (
            <SelectItem key={b} value={b}>
              {b}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="h-5 w-px bg-border" />

      <Select value={feeFilter} onValueChange={onFeeChange}>
        <SelectTrigger className="h-9 rounded-full border-border bg-white/[0.03] px-4">
          <SelectValue placeholder="All Fee Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Fee Statuses</SelectItem>
          <SelectItem value="no-fee">No Fee Set</SelectItem>
          <SelectItem value="due-soon">Due soon</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
