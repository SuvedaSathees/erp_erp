import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { QuickField } from "@/components/erp/QuickCreateDialog";
import { appendModuleDatasetItemFn, saveModuleDatasetFieldFn } from "@/lib/moduleDatasetFns.server";
import { captureFields, readFieldsNear, readLabeledFields, type SavedField } from "@/lib/formCapture";
import { exportPageReport } from "@/lib/recordExport";

/*
 * Page-level actions shared by every module: open a full-size view of a section, record a request
 * or action in the page's activity log, upload files to the page, show the activity log, and a
 * "more actions" menu. The log and files are saved in the "page:<path>" module dataset, so they
 * survive reloads and every user sees them. <PageActionsHost> (mounted in the root layout) renders
 * the dialogs.
 */

export type ActivityEntry = {
  id: string;
  code: string;
  at: string;
  action: string;
  kind: "request" | "action" | "upload";
  details?: Record<string, string>;
};

export type PageFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  dataUrl: string;
  rows?: number;
};

export type PageActionEvent =
  | { kind: "viewer"; title: string; html: string }
  | { kind: "form"; title: string; fields?: QuickField[]; submitLabel?: string }
  | { kind: "files"; title: string }
  | { kind: "history"; title: string }
  | { kind: "menu"; x: number; y: number };

const listeners = new Set<(e: PageActionEvent) => void>();
let queryClient: QueryClient | null = null;

export function onPageAction(fn: (e: PageActionEvent) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
export function registerPageQueryClient(qc: QueryClient) {
  queryClient = qc;
}
const emit = (e: PageActionEvent) => listeners.forEach((l) => l(e));

/** Dataset key for the current page's activity log and files. */
export function pageKey() {
  const path = typeof window === "undefined" ? "/" : window.location.pathname.replace(/\/+$/, "") || "/";
  return `page:${path}`;
}
export function pageTitle() {
  if (typeof document === "undefined") return "Page";
  return document.querySelector("main h1")?.textContent?.trim() || document.title || "Page";
}
export const pageDatasetQueryKey = () => ["module-dataset", pageKey()] as const;

export const nextCode = (prefix: string, count: number) =>
  `${prefix}-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;

/** Clean a toast-style label ("Opening PM Compliance Report...") into a dialog title. */
export function labelToTitle(label: string) {
  const t = label
    .replace(/^(Opening|Viewing|Displaying|Showing|Launching|Switching to)\s+/i, "")
    .replace(/\s+(opened|launched|active|initiated|preview|drawer|dialog)(\s+\w+)?$/i, (m) =>
      /preview/i.test(m) ? " Preview" : "",
    )
    .replace(/(\.\.\.|…)$/g, "")
    .trim();
  return t ? t[0].toUpperCase() + t.slice(1) : label;
}

/** The card/section a button belongs to: the nearest bordered container of a useful size. */
function sectionOf(el: Element | null): HTMLElement | null {
  let node = el instanceof HTMLElement ? el : null;
  while (node && node.tagName !== "MAIN" && node !== document.body) {
    const r = node.getBoundingClientRect();
    const cls = typeof node.className === "string" ? node.className : "";
    if (r.height >= 160 && r.width >= 280 && (node.dataset.slot === "card" || /\bborder\b/.test(cls) || /\brounded/.test(cls)))
      return node;
    node = node.parentElement;
  }
  return document.querySelector("main");
}

/** Static copy of a section for the viewer: controls removed, typed values kept as text. */
function snapshot(section: HTMLElement) {
  const copy = section.cloneNode(true) as HTMLElement;
  const live = section.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea");
  copy.querySelectorAll<HTMLElement>("input, select, textarea").forEach((el, i) => {
    const src = live[i];
    const span = document.createElement("span");
    span.textContent = src && "value" in src ? src.value : "";
    span.className = "font-medium";
    el.replaceWith(span);
  });
  copy.querySelectorAll("button, [role=button], [role=menu], [data-radix-popper-content-wrapper], script").forEach((el) => el.remove());
  copy.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  copy.style.maxHeight = "none";
  copy.style.height = "auto";
  copy.querySelectorAll<HTMLElement>("[class*='max-h-'], [class*='overflow-']").forEach((el) => {
    el.style.maxHeight = "none";
    el.style.overflow = "visible";
  });
  return copy.outerHTML;
}

/** Open a full-size, printable view of the section that contains the clicked control. */
export function openPageViewer(label: string, from?: EventTarget | null) {
  const section = sectionOf(from instanceof Element ? from : null);
  emit({ kind: "viewer", title: labelToTitle(label), html: section ? snapshot(section) : "" });
}

/** Open a form; the submission is saved to this page's activity log. */
export function openPageForm(label: string, fields?: QuickField[] | keyof typeof PAGE_FORMS, submitLabel?: string) {
  emit({ kind: "form", title: labelToTitle(label), fields: typeof fields === "string" ? PAGE_FORMS[fields] : fields, submitLabel });
}

export function openPageHistory(label = "Activity Log") {
  emit({ kind: "history", title: labelToTitle(label) });
}

export function openQuickActions(e: { clientX?: number; clientY?: number; currentTarget?: EventTarget | null }) {
  const el = e.currentTarget instanceof Element ? e.currentTarget.getBoundingClientRect() : null;
  emit({ kind: "menu", x: el ? el.left : (e.clientX ?? 0), y: el ? el.bottom + 4 : (e.clientY ?? 0) });
}

async function append(field: "activity" | "files", item: unknown) {
  const res = await appendModuleDatasetItemFn({
    data: { key: pageKey(), title: pageTitle(), field, json: JSON.stringify(item), limit: field === "files" ? 50 : 500 },
  });
  void queryClient?.invalidateQueries({ queryKey: pageDatasetQueryKey() });
  return JSON.parse(res) as unknown[];
}

let activityCount = 0;
/** Record an action or request in this page's activity log (saved to the database). */
export async function logPageAction(
  action: string,
  opts: { details?: Record<string, string>; kind?: ActivityEntry["kind"]; message?: string } = {},
) {
  const entry: ActivityEntry = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    code: nextCode(opts.kind === "request" ? "REQ" : "ACT", activityCount),
    at: new Date().toISOString(),
    action,
    kind: opts.kind ?? "action",
    details: opts.details,
  };
  try {
    const list = await append("activity", entry);
    activityCount = list.length;
    toast.success(opts.message ?? `${action} — recorded in the activity log.`, {
      action: { label: "View log", onClick: () => openPageHistory() },
    });
  } catch {
    toast.error(`Couldn't save "${action}". Please try again.`);
  }
}

const MAX_FILE = 2 * 1024 * 1024;
const readAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });

async function countRows(file: File): Promise<number | undefined> {
  if (/\.csv$/i.test(file.name)) return Math.max(0, (await file.text()).split(/\r?\n/).filter((l) => l.trim()).length - 1);
  if (/\.xlsx?$/i.test(file.name)) {
    const XLSX = await import("xlsx");
    const book = XLSX.read(await file.arrayBuffer());
    const sheet = book.Sheets[book.SheetNames[0]];
    return sheet ? Math.max(0, XLSX.utils.sheet_to_json(sheet).length) : undefined;
  }
  return undefined;
}

/** Upload files the user picks to this page (saved to the database), then show the page's files. */
export async function uploadPageFiles(files: FileList | File[], purpose?: string) {
  for (const file of Array.from(files)) {
    if (file.size > MAX_FILE) {
      toast.error(`${file.name} is larger than 2 MB, so it wasn't uploaded.`);
      continue;
    }
    try {
      const rows = await countRows(file).catch(() => undefined);
      const item: PageFile = {
        id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        uploadedAt: new Date().toISOString(),
        dataUrl: await readAsDataUrl(file),
        rows,
      };
      await append("files", item);
      await append("activity", {
        id: `${item.id}a`,
        code: "UPL",
        at: item.uploadedAt,
        action: `${purpose ? `${purpose}: ` : ""}uploaded ${file.name}`,
        kind: "upload",
        details: { File: file.name, Size: `${(file.size / 1024).toFixed(1)} KB`, ...(rows != null ? { Rows: String(rows) } : {}) },
      } satisfies ActivityEntry);
      toast.success(`Uploaded ${file.name}${rows != null ? ` (${rows} rows)` : ""}. It's saved in this page's files.`);
    } catch {
      toast.error(`Couldn't upload ${file.name}. Please try again.`);
    }
  }
}

/**
 * Open the file picker straight away (it must happen inside the click), upload what the user picks
 * and then show the page's files.
 */
export function openPageFiles(label = "Page Files", accept?: string) {
  if (typeof document === "undefined") return;
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = true;
  if (accept) input.accept = accept;
  input.onchange = async () => {
    if (input.files?.length) {
      await uploadPageFiles(input.files, labelToTitle(label));
      emit({ kind: "files", title: "Page Files" });
    }
  };
  input.click();
}

export function showPageFiles() {
  emit({ kind: "files", title: "Page Files" });
}

/** Reload every query on the page from the server. */
export async function refreshPageData(label?: string) {
  if (!queryClient) return;
  await queryClient.invalidateQueries();
  toast.success(label ? `${label} refreshed.` : "Data refreshed.");
}

let navigateTo: ((to: string) => void) | null = null;
export function registerPageNavigate(fn: (to: string) => void) {
  navigateTo = fn;
}
/** Go to another module page (client-side navigation). */
export function goToPage(to: string) {
  if (navigateTo) navigateTo(to);
  else window.location.assign(to);
}

/** Save what's typed in the form around the clicked button to the page's activity log. */
export function savePageForm(action: string, from?: EventTarget | null, message?: string) {
  const details = readFieldsNear(from ?? null);
  const filled = Object.fromEntries(Object.entries(details).filter(([, v]) => v));
  void logPageAction(action, { kind: "request", details: filled, message });
}

/** Discard unsaved edits by reloading the page after the user confirms. */
export function discardPageChanges() {
  if (window.confirm("Discard your unsaved changes on this page?")) window.location.reload();
}

/** Show the app in full screen (or leave full screen). */
export function toggleFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen?.().catch(() => toast.error("Full screen isn't available in this browser."));
}

export const PAGE_INDEX_KEY = "page-index";
export const pageIndexQueryKey = ["module-dataset", PAGE_INDEX_KEY] as const;
export type SavedForm = { at: string; fields: SavedField[] };

/**
 * Save the page's form (every field's current value) so it's filled back in next time the page
 * opens, and record the save in the activity log. Used by Save / Save Draft / Submit buttons.
 */
export async function savePageState(action: string, opts: { kind?: ActivityEntry["kind"]; message?: string } = {}) {
  const main = document.querySelector("main");
  if (!main) return;
  const fields = captureFields(main);
  const path = pageKey().slice("page:".length);
  try {
    await saveModuleDatasetFieldFn({
      data: { key: pageKey(), title: pageTitle(), field: "form", json: JSON.stringify({ at: new Date().toISOString(), fields } satisfies SavedForm) },
    });
    await appendModuleDatasetItemFn({
      data: { key: PAGE_INDEX_KEY, title: "Pages with saved forms", field: "saved", json: JSON.stringify(path), limit: 5000, unique: true },
    });
    queryClient?.setQueryData<string[]>(pageIndexQueryKey, (old) => (old?.includes(path) ? old : [...(old ?? []), path]));
  } catch {
    toast.error(`Couldn't save "${action}". Please try again.`);
    return;
  }
  const details = Object.fromEntries(
    Object.entries(readLabeledFields(main))
      .filter(([, v]) => v && v !== "No")
      .slice(0, 40),
  );
  await logPageAction(action, { kind: opts.kind ?? "action", details, message: opts.message ?? `${action} — your changes are saved.` });
}

/** Download the page as a PDF report and open the user's email app with the subject filled in. */
export async function emailPageReport(title: string, to = "") {
  await exportPageReport(title, "pdf", "page");
  const subject = encodeURIComponent(`${title} — ${pageTitle()}`);
  const body = encodeURIComponent(
    `Hello,\n\nPlease find the ${title} attached (downloaded from Magnertia ERP).\n\nPage: ${window.location.href}\n`,
  );
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  toast.info("Your email app is opening. Attach the PDF that was just downloaded.");
}

/** Ready-made fields for common request forms. */
export const PAGE_FORMS = {
  spareParts: [
    { name: "part", label: "Part number / name", required: true },
    { name: "qty", label: "Quantity", type: "number", required: true },
    { name: "workOrder", label: "Work order" },
    { name: "needBy", label: "Required by", type: "date" },
    { name: "notes", label: "Notes", type: "textarea" },
  ],
  compOff: [
    { name: "workedOn", label: "Date worked", type: "date", required: true },
    { name: "compOffOn", label: "Comp off date", type: "date", required: true },
    { name: "reason", label: "Reason", type: "textarea" },
  ],
  leave: [
    { name: "type", label: "Leave type", type: "select", options: ["Casual Leave", "Sick Leave", "Earned Leave", "Comp Off", "Loss of Pay"] },
    { name: "from", label: "From", type: "date", required: true },
    { name: "to", label: "To", type: "date", required: true },
    { name: "reason", label: "Reason", type: "textarea" },
  ],
  probation: [
    { name: "employee", label: "Employee", required: true },
    { name: "reviewDate", label: "Review date", type: "date" },
    { name: "rating", label: "Rating", type: "select", options: ["Meets expectations", "Exceeds expectations", "Below expectations"] },
    { name: "recommendation", label: "Recommendation", type: "select", options: ["Confirm", "Extend probation", "Do not confirm"] },
    { name: "comments", label: "Comments", type: "textarea" },
  ],
  nomination: [
    { name: "nominee", label: "Nominee", required: true },
    { name: "category", label: "Award category", type: "select", options: ["Spot Award", "Star Performer", "Team Excellence", "Innovation", "Customer Hero"] },
    { name: "reason", label: "Reason for nomination", type: "textarea", required: true },
  ],
  interview: [
    { name: "candidate", label: "Candidate", required: true },
    { name: "interviewer", label: "Interviewer", required: true },
    { name: "date", label: "Date", type: "date", required: true },
    { name: "time", label: "Time", placeholder: "e.g. 11:30 AM" },
    { name: "mode", label: "Mode", type: "select", options: ["Video call", "In person", "Phone"] },
  ],
  cab: [
    { name: "pickup", label: "Pickup", required: true },
    { name: "drop", label: "Drop", required: true },
    { name: "date", label: "Date", type: "date", required: true },
    { name: "time", label: "Time", placeholder: "e.g. 07:45 AM" },
  ],
  flight: [
    { name: "from", label: "From", required: true },
    { name: "to", label: "To", required: true },
    { name: "date", label: "Travel date", type: "date", required: true },
    { name: "flight", label: "Airline / flight no." },
    { name: "class", label: "Class", type: "select", options: ["Economy", "Premium Economy", "Business"] },
  ],
  hotel: [
    { name: "city", label: "City", required: true },
    { name: "hotel", label: "Hotel" },
    { name: "checkIn", label: "Check-in", type: "date", required: true },
    { name: "checkOut", label: "Check-out", type: "date", required: true },
  ],
  template: [
    { name: "name", label: "Template name", required: true },
    { name: "subject", label: "Email subject", required: true },
    { name: "body", label: "Body", type: "textarea" },
  ],
  milestone: [
    { name: "milestone", label: "Milestone", required: true },
    { name: "due", label: "Due date", type: "date" },
    { name: "amount", label: "Amount (₹)", type: "number" },
    { name: "owner", label: "Owner" },
  ],
  amendment: [
    { name: "title", label: "Amendment title", required: true },
    { name: "effective", label: "Effective date", type: "date" },
    { name: "description", label: "Description", type: "textarea" },
  ],
  subtask: [
    { name: "subtask", label: "Subtask", required: true },
    { name: "assignee", label: "Assignee" },
    { name: "due", label: "Due date", type: "date" },
    { name: "priority", label: "Priority", type: "select", options: ["Medium", "High", "Low"] },
  ],
  scopeItem: [
    { name: "item", label: "Scope item", required: true },
    { name: "area", label: "Area / process" },
    { name: "owner", label: "Owner" },
    { name: "details", label: "Details", type: "textarea" },
  ],
  serial: [{ name: "serial", label: "Serial / barcode number", required: true }],
  post: [
    { name: "platforms", label: "Platforms", type: "select", options: ["LinkedIn, X, Instagram, YouTube", "LinkedIn", "X", "Instagram", "YouTube"] },
    { name: "text", label: "Post text", type: "textarea", required: true },
    { name: "link", label: "Link (optional)" },
  ],
  schedule: [
    { name: "date", label: "Publish date", type: "date", required: true },
    { name: "time", label: "Time", placeholder: "e.g. 11:30 AM IST", defaultValue: "11:30 AM IST" },
  ],
  documents: [
    { name: "from", label: "Request from", required: true },
    { name: "documents", label: "Documents needed", type: "textarea", required: true },
    { name: "due", label: "Needed by", type: "date" },
  ],
} satisfies Record<string, QuickField[]>;
