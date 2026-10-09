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
  await exportPageReport(title, format);
}

export type PageExportFormat = ExportFormat | "json" | "txt";

/** Map a format label used in the UI ("PDF", "Excel", "XLSX", "CSV", "JSON") to an export format. */
export function formatFrom(label: string | null | undefined): PageExportFormat {
  const l = (label ?? "").toLowerCase();
  if (l.includes("csv")) return "csv";
  if (l.includes("xls") || l.includes("excel") || l.includes("sheet")) return "xlsx";
  if (l.includes("json")) return "json";
  if (l.includes("txt") || l.includes("text")) return "txt";
  return "pdf";
}

const clean = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const fileStem = (title: string) => title.replace(/[^A-Za-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "") || "Export";
const stamp = () => new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

/** Save text or binary content as a file. */
export function downloadFile(filename: string, content: BlobPart | Blob, mime = "application/octet-stream") {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadJson(title: string, data: unknown) {
  downloadFile(`${fileStem(title)}_${stamp()}.json`, JSON.stringify(data, null, 2), "application/json");
  toast.success(`${title} downloaded (JSON).`);
}

function isVisible(el: Element) {
  const r = (el as HTMLElement).getBoundingClientRect?.();
  return !!r && (r.width > 0 || r.height > 0);
}

/** The open dialog / side sheet if there is one (e.g. a report preview), otherwise the page body. */
function exportRoot(): HTMLElement {
  const dialogs = [...document.querySelectorAll<HTMLElement>('[role="dialog"], [role="alertdialog"]')].filter(isVisible);
  return dialogs.pop() ?? document.querySelector("main") ?? document.body;
}

function pageHeading(root: HTMLElement) {
  const h = [...root.querySelectorAll("h1, h2, [role=heading]")].find((x) => clean(x.textContent));
  return clean(h?.textContent) || clean(document.querySelector("main h1")?.textContent) || clean(document.title) || "Report";
}

function tableRows(root: HTMLElement): Row[] {
  const tables = [...root.querySelectorAll("table")].filter(isVisible);
  const rows: Row[] = [];
  for (const table of tables) {
    const heads = [...table.querySelectorAll("thead th")].map((th) => clean(th.textContent));
    const section = nearestHeading(table);
    for (const tr of table.querySelectorAll("tbody tr")) {
      const cells = [...tr.querySelectorAll("td")].map((td) => clean(td.textContent));
      if (!cells.some(Boolean)) continue;
      const row: Row = tables.length > 1 && section ? { Section: section } : {};
      cells.forEach((c, i) => {
        row[heads[i] && heads[i] !== "#" ? heads[i] : `Column ${i + 1}`] = c;
      });
      rows.push(row);
    }
  }
  return rows;
}

/** Visible text of a page/dialog without tables, grouped under its headings (buttons and menus left out). */
function textRows(root: HTMLElement): Row[] {
  const rows: Row[] = [];
  let section = "";
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let last = "";
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const parent = n.parentElement;
    if (!parent || parent.closest("button, [role=button], [role=menu], [role=tablist], nav, script, style, table, svg, [aria-hidden=true]")) continue;
    const text = clean(n.textContent);
    if (!text || text === last || !isVisible(parent)) continue;
    last = text;
    if (parent.closest("h1, h2, h3, h4, h5, [role=heading]")) {
      section = text;
      continue;
    }
    rows.push({ section, detail: text });
  }
  return rows;
}

/**
 * Download what the user is looking at: the open report dialog if there is one, otherwise the page.
 * Tables are exported row by row; pages without tables export their visible details by section.
 */
export async function exportPageReport(
  title?: string,
  format: PageExportFormat = "pdf",
  scope: "auto" | "page" = "auto",
) {
  // Read the DOM now, before the click handler closes any dialog. "page" skips an open dialog
  // (e.g. an export picker) and exports the page behind it.
  const root = scope === "page" ? (document.querySelector("main") ?? document.body) : exportRoot();
  const name = title?.trim() || `${pageHeading(root)} Report`;
  let rows = tableRows(root);
  if (!rows.length) rows = textRows(root);
  if (!rows.length) {
    toast.info("There is nothing on this page to export yet.");
    return;
  }
  if (format === "json") return downloadJson(name, rows);
  if (format === "txt") {
    const text = [name, `Generated ${new Date().toLocaleString("en-IN")}`, "", ...rows.map((r) => Object.values(r).filter(Boolean).join(" — "))].join("\r\n");
    downloadFile(`${fileStem(name)}_${stamp()}.txt`, text, "text/plain;charset=utf-8");
    toast.success(`${name} downloaded (TXT).`);
    return;
  }
  await exportRecords(name, rows, format);
}

type Attachment = Record<string, unknown>;

/**
 * Download an attachment. Files people uploaded in the app are saved as-is; documents that only
 * exist as a record (no stored file) download their record sheet instead, and the message says so.
 */
export async function downloadAttachment(attachment: unknown, linkedTo?: string) {
  const att: Attachment =
    typeof attachment === "string" ? { name: attachment } : ((attachment ?? {}) as Attachment);
  const name = String(att.name ?? att.filename ?? att.fileName ?? att.file ?? att.title ?? att.id ?? "Document");
  const stored = [att.blob, att.file, att.url, att.dataUrl, att.href, att.src].find(
    (v) => v instanceof Blob || (typeof v === "string" && /^(blob:|data:)/.test(v)),
  );
  if (stored instanceof Blob) {
    downloadFile(name, stored);
    toast.success(`Downloaded ${name}`);
    return;
  }
  if (typeof stored === "string") {
    const a = document.createElement("a");
    a.href = stored;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.success(`Downloaded ${name}`);
    return;
  }
  const details = Object.fromEntries(Object.entries(att).filter(([, v]) => v == null || typeof v !== "object"));
  await exportRecords(`${name.replace(/\.[A-Za-z0-9]{2,5}$/, "")} - Document Record`, recordToRows({ document: name, ...details, ...(linkedTo ? { linkedTo } : {}) }), "pdf", {
    silent: true,
  });
  toast.info(`"${name}" isn't stored as a file in the ERP yet, so its document record was downloaded (PDF).`);
}

/**
 * Download any list of records as Excel, PDF or CSV. Columns come from the records' plain
 * (text/number/yes-no) fields; the export libraries are loaded only when someone exports.
 */
export async function exportRecords(
  title: string,
  records: readonly object[],
  format: ExportFormat = "xlsx",
  opts: { silent?: boolean } = {},
) {
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
  if (!opts.silent) toast.success(`${title} downloaded (${format.toUpperCase()}).`);
}
