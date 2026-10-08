import { toast } from "sonner";
import type { CellValue, ColumnDef } from "@/components/erp/reports/types";

export type ExportFormat = "xlsx" | "pdf" | "csv";
type Row = Record<string, unknown>;

const isScalar = (v: unknown): v is string | number | boolean =>
  typeof v === "string" || typeof v === "number" || typeof v === "boolean";

const humanize = (k: string) =>
  k
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

/** Flatten a record (e.g. a master record shown as a details panel) into Field / Value rows. */
export function recordToRows(record: object, prefix = ""): Row[] {
  const rows: Row[] = [];
  for (const [k, v] of Object.entries(record)) {
    const field = prefix + humanize(k);
    if (v == null || typeof v === "function") continue;
    if (Array.isArray(v)) {
      if (v.every((x) => isScalar(x))) rows.push({ field, value: v.join(", ") });
      else rows.push({ field, value: `${v.length} item${v.length === 1 ? "" : "s"}` });
    } else if (typeof v === "object") {
      rows.push(...recordToRows(v, `${field} › `));
    } else {
      rows.push({ field, value: typeof v === "boolean" ? (v ? "Yes" : "No") : v });
    }
  }
  return rows;
}

function nearestHeading(el: Element): string {
  let node: Element | null = el;
  while (node && node !== document.body) {
    let sib = node.previousElementSibling;
    while (sib) {
      const h = sib.matches("h1,h2,h3,h4") ? sib : sib.querySelector("h1,h2,h3,h4");
      if (h?.textContent?.trim()) return h.textContent.trim();
      sib = sib.previousElementSibling;
    }
    node = node.parentElement;
  }
  return "";
}

/** Export the tables currently shown on the page (what the user sees) as Excel, PDF or CSV. */
export async function exportVisibleTables(title: string, format: ExportFormat = "xlsx") {
  const root = document.querySelector("main") ?? document.body;
  const tables = [...root.querySelectorAll("table")];
  const rows: Row[] = [];
  for (const table of tables) {
    const heads = [...table.querySelectorAll("thead th")].map((th) => th.textContent?.replace(/\s+/g, " ").trim() ?? "");
    const section = nearestHeading(table);
    for (const tr of table.querySelectorAll("tbody tr")) {
      const cells = [...tr.querySelectorAll("td")].map((td) => td.textContent?.replace(/\s+/g, " ").trim() ?? "");
      if (!cells.some(Boolean)) continue;
      const row: Row = tables.length > 1 && section ? { Section: section } : {};
      cells.forEach((c, i) => {
        const h = heads[i] && heads[i] !== "#" ? heads[i] : `Column ${i + 1}`;
        row[h] = c;
      });
      rows.push(row);
    }
  }
  if (!rows.length) {
    toast.info("This page has no table to export.");
    return;
  }
  await exportRecords(title, rows, format);
}

/**
 * Download any list of records as Excel, PDF or CSV. Columns come from the records' plain
 * (text/number/yes-no) fields; the export libraries are loaded only when someone exports.
 */
export async function exportRecords(title: string, records: readonly object[], format: ExportFormat = "xlsx") {
  const rows = records as Row[];
  if (!rows.length) {
    toast.info("There is nothing to export yet.");
    return;
  }
  const keys = [...new Set(rows.flatMap((r) => Object.keys(r)))].filter(
    (k) => k !== "id" && rows.some((r) => isScalar(r[k])),
  );
  const columns: ColumnDef[] = keys.map((k) => ({
    key: k,
    header: humanize(k),
    align: rows.every((r) => r[k] == null || typeof r[k] === "number") ? "right" : "left",
  }));
  const data = rows.map((r) =>
    Object.fromEntries(
      keys.map((k) => {
        const v = r[k];
        const cell: CellValue =
          typeof v === "boolean" ? (v ? "Yes" : "No") : typeof v === "string" || typeof v === "number" ? v : "";
        return [k, cell];
      }),
    ),
  );
  const meta = {
    title,
    captionLines: [`Magnertia ERP · ${rows.length} record${rows.length === 1 ? "" : "s"}`],
    generatedAt: new Date().toLocaleString("en-IN"),
  };
  const { exportXlsx, exportPdf, exportCsv } = await import("@/components/erp/reports/exporters");
  if (format === "pdf") exportPdf(columns, data, meta);
  else if (format === "csv") exportCsv(columns, data, meta);
  else exportXlsx(columns, data, meta);
  toast.success(`${title} downloaded (${format.toUpperCase()}).`);
}
