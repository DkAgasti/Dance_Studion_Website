"use client";

import { cn } from "@/lib/utils";

// Reusable data table for admin list pages (students, fees, admissions, batches).
// `columns`: [{ key, label, render?(row) }]. `rows`: array of plain objects.
// `onRowClick`/`selectedId` are optional — pass them to make rows clickable
// and highlight the active one (used by the admissions detail view).
export default function DataTable({ columns, rows, onRowClick, selectedId }) {
  if (!rows?.length) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Nothing here yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border text-xs font-bold tracking-wide text-muted-foreground uppercase">
            {columns.map((col) => (
              <th key={col.key} className="px-2 py-3 whitespace-nowrap first:pl-0 last:pr-0">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id ?? i}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                i !== rows.length - 1 && "border-b border-border/60",
                onRowClick && "cursor-pointer hover:bg-white/[0.03]",
                selectedId != null && row.id === selectedId && "bg-white/[0.05]"
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-2 py-3.5 text-sm whitespace-nowrap first:pl-0 last:pr-0">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
