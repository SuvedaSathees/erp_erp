import { type ReactNode, useState, useMemo, useCallback } from "react";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  FileText,
  ChevronDown,
  X,
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/* =========================================================================
   Column type — backwards compatible, new optional fields for sorting,
   filtering, and custom sort extraction.
   ========================================================================= */

export type Column<T> = {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
  /** Enable click-to-sort on this column header */
  sortable?: boolean;
  /** Custom sort key extractor. When omitted, `row[column.key]` is used. */
  sortKey?: string | ((row: T) => string | number);
  /** When provided, a dropdown filter appears for this column */
  filterOptions?: { label: string; value: string }[];
};

/* =========================================================================
   Sort state
   ========================================================================= */

type SortDirection = "asc" | "desc";
type SortState = { key: string; direction: SortDirection } | null;

/* =========================================================================
   Internal helpers
   ========================================================================= */

/** Extract a plain-text representation of a ReactNode for searching. */
function nodeToText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join(" ");
  if (typeof node === "object" && "props" in node) {
    const { children } = (node as { props: { children?: ReactNode } }).props;
    return nodeToText(children);
  }
  return "";
}

/** Extract a sortable value from a row for a given column. */
function extractSortValue<T extends Record<string, unknown>>(
  row: T,
  column: Column<T>,
): string | number {
  if (typeof column.sortKey === "function") return column.sortKey(row);
  const fieldKey = typeof column.sortKey === "string" ? column.sortKey : column.key;
  const val = row[fieldKey];
  if (val == null) return "";
  if (typeof val === "number") return val;
  return String(val);
}

/** Compare two sort values. */
function compareSortValues(a: string | number, b: string | number): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

/** Download a Blob as a file. */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* =========================================================================
   CSV Export
   ========================================================================= */

function exportToCsv<T extends Record<string, unknown>>(
  columns: Column<T>[],
  data: T[],
  filename: string,
) {
  const escape = (v: string) => {
    if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
    return v;
  };

  const headerRow = columns.map((c) => escape(nodeToText(c.header))).join(",");
  const bodyRows = data.map((row) =>
    columns.map((c) => escape(nodeToText(c.cell(row)))).join(","),
  );

  const csv = [headerRow, ...bodyRows].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${filename}.csv`);
}

/* =========================================================================
   PDF Export
   ========================================================================= */

function exportToPdf<T extends Record<string, unknown>>(
  columns: Column<T>[],
  data: T[],
  filename: string,
) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  // Title
  doc.setFontSize(14);
  doc.setTextColor(10, 60, 117); // #0A3C75
  doc.text(filename, 14, 16);

  // Timestamp
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

  const head = [columns.map((c) => nodeToText(c.header))];
  const body = data.map((row) => columns.map((c) => nodeToText(c.cell(row))));

  autoTable(doc, {
    startY: 26,
    head,
    body,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      font: "helvetica",
    },
    headStyles: {
      fillColor: [10, 60, 117], // #0A3C75
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 243, 237], // close to beige muted
    },
  });

  doc.save(`${filename}.pdf`);
}

/* =========================================================================
   ColumnFilterDropdown — a controlled select dropdown per column
   ========================================================================= */

function ColumnFilterDropdown({
  column,
  value,
  onChange,
}: {
  column: { key: string; header: ReactNode; filterOptions: { label: string; value: string }[] };
  value: string;
  onChange: (key: string, value: string) => void;
}) {
  const label = nodeToText(column.header);

  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(column.key, e.target.value)}
        className="appearance-none rounded-lg border border-border bg-card py-1.5 pl-3 pr-8 text-sm text-foreground transition-colors hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label={`Filter by ${label}`}
      >
        <option value="">All {label}</option>
        {column.filterOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-muted-foreground" />
    </div>
  );
}

/* =========================================================================
   DataTable — upgraded with sorting, search, filtering, export
   ========================================================================= */

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  mobileCard,
  empty,
  onRowClick,
  searchable,
  exportFilename,
}: {
  columns: Column<T>[];
  data: T[];
  mobileCard: (row: T) => ReactNode;
  empty?: ReactNode;
  onRowClick?: (row: T) => void;
  /** When true, renders a search bar above the table */
  searchable?: boolean;
  /** When provided, renders CSV and PDF export buttons */
  exportFilename?: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortState>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  // Columns that have filter options
  const filterableColumns = useMemo(
    () => columns.filter((c) => c.filterOptions && c.filterOptions.length > 0),
    [columns],
  );

  // Whether to show the toolbar at all
  const showToolbar = searchable || filterableColumns.length > 0 || !!exportFilename;

  // Active filter count for clear button
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    for (const v of Object.values(columnFilters)) {
      if (v) count++;
    }
    return count;
  }, [searchQuery, columnFilters]);

  // Handle column filter changes
  const handleFilterChange = useCallback((key: string, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Clear all filters and search
  const handleClearAll = useCallback(() => {
    setSearchQuery("");
    setColumnFilters({});
  }, []);

  // Toggle sort on a column
  const handleSort = useCallback(
    (key: string) => {
      setSort((prev) => {
        if (prev?.key === key) {
          if (prev.direction === "asc") return { key, direction: "desc" };
          // If already desc, clear sort
          return null;
        }
        return { key, direction: "asc" };
      });
    },
    [],
  );

  // Processed data: filter -> search -> sort
  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Column filters
    for (const col of columns) {
      const filterValue = columnFilters[col.key];
      if (!filterValue) continue;
      result = result.filter((row) => {
        const cellText = nodeToText(col.cell(row));
        return cellText.includes(filterValue);
      });
    }

    // 2. Search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => nodeToText(col.cell(row)).toLowerCase().includes(q)),
      );
    }

    // 3. Sort
    if (sort) {
      const sortColumn = columns.find((c) => c.key === sort.key);
      if (sortColumn) {
        const dir = sort.direction === "asc" ? 1 : -1;
        result.sort((a, b) => {
          const va = extractSortValue(a, sortColumn);
          const vb = extractSortValue(b, sortColumn);
          return dir * compareSortValues(va, vb);
        });
      }
    }

    return result;
  }, [data, columns, searchQuery, columnFilters, sort]);

  // Sort indicator icon
  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sort?.key !== columnKey) {
      return <ArrowUpDown className="ml-1 inline-block h-3.5 w-3.5 text-muted-foreground/50" />;
    }
    return sort.direction === "asc" ? (
      <ArrowUp className="ml-1 inline-block h-3.5 w-3.5 text-primary" />
    ) : (
      <ArrowDown className="ml-1 inline-block h-3.5 w-3.5 text-primary" />
    );
  };

  // Empty state after filtering
  if (data.length === 0 && !showToolbar) return <>{empty}</>;

  return (
    <>
      {/* Toolbar: search + filters + export */}
      {showToolbar && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {/* Search input */}
          {searchable && (
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Column filter dropdowns */}
          {filterableColumns.map((col) => (
            <ColumnFilterDropdown
              key={col.key}
              column={col as typeof col & { filterOptions: { label: string; value: string }[] }}
              value={columnFilters[col.key] ?? ""}
              onChange={handleFilterChange}
            />
          ))}

          {/* Clear all filters */}
          {activeFilterCount > 1 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3 w-3" />
              Clear all
            </button>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Export buttons */}
          {exportFilename && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => exportToCsv(columns, processedData, exportFilename)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-secondary/60"
                title="Export to CSV"
              >
                <Download className="h-3.5 w-3.5" />
                CSV
              </button>
              <button
                type="button"
                onClick={() => exportToPdf(columns, processedData, exportFilename)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-secondary/60"
                title="Export to PDF"
              >
                <FileText className="h-3.5 w-3.5" />
                PDF
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty state — after applying filters/search */}
      {processedData.length === 0 ? (
        data.length === 0 ? (
          <>{empty}</>
        ) : (
          <div className="card-soft flex flex-col items-center justify-center px-6 py-12 text-center">
            <Search className="h-10 w-10 text-muted-foreground/40" />
            <h3 className="mt-3 font-display text-base font-semibold text-foreground">
              No matching results
            </h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
            <button
              type="button"
              onClick={handleClearAll}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          </div>
        )
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block card-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/40">
                    {columns.map((c) => {
                      const isSortable = c.sortable === true;
                      return (
                        <th
                          key={c.key}
                          className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${
                            c.align === "right"
                              ? "text-right"
                              : c.align === "center"
                                ? "text-center"
                                : "text-left"
                          } ${isSortable ? "cursor-pointer select-none hover:text-foreground transition-colors" : ""} ${c.className ?? ""}`}
                          onClick={isSortable ? () => handleSort(c.key) : undefined}
                          aria-sort={
                            sort?.key === c.key
                              ? sort.direction === "asc"
                                ? "ascending"
                                : "descending"
                              : undefined
                          }
                        >
                          <span className="inline-flex items-center gap-0.5">
                            {c.header}
                            {isSortable && <SortIcon columnKey={c.key} />}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {processedData.map((row, i) => (
                    <tr
                      key={(row.id as string | number | undefined) ?? i}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                      className={`border-b border-border last:border-0 hover:bg-secondary/30 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                    >
                      {columns.map((c) => (
                        <td
                          key={c.key}
                          className={`px-4 py-3.5 align-middle text-foreground ${
                            c.align === "right"
                              ? "text-right tabular-nums"
                              : c.align === "center"
                                ? "text-center"
                                : "text-left"
                          } ${c.className ?? ""}`}
                        >
                          {c.cell(row)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-3 md:hidden">
            {processedData.map((row, i) => (
              <div
                key={(row.id as string | number | undefined) ?? i}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`card-soft p-4 ${onRowClick ? "cursor-pointer" : ""}`}
              >
                {mobileCard(row)}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

/* =========================================================================
   EmptyState — unchanged, kept at the bottom
   ========================================================================= */

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="card-soft flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-primary">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          className="h-7 w-7"
        >
          <path d="M3 7h18M3 12h18M3 17h12" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
