import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { Download, FileSpreadsheet, FileText, History, Link2, Printer, RefreshCw, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { QuickCreateDialog, type QuickField } from "@/components/erp/QuickCreateDialog";
import { exportPageReport } from "@/lib/recordExport";
import { getModuleDatasetFn, removeModuleDatasetItemFn } from "@/lib/moduleDatasetFns.server";
import { applyFields } from "@/lib/formCapture";
import {
  type ActivityEntry,
  type PageActionEvent,
  type PageFile,
  type SavedForm,
  PAGE_INDEX_KEY,
  logPageAction,
  onPageAction,
  openPageFiles,
  openPageHistory,
  pageDatasetQueryKey,
  pageIndexQueryKey,
  pageKey,
  refreshPageData,
  registerPageNavigate,
  registerPageQueryClient,
  showPageFiles,
} from "@/lib/pageActions";

const DEFAULT_FIELDS: QuickField[] = [
  { name: "subject", label: "Subject", required: true },
  { name: "owner", label: "Owner / Requested by" },
  { name: "dueDate", label: "Due date", type: "date" },
  { name: "priority", label: "Priority", type: "select", options: ["Medium", "High", "Low", "Critical"] },
  { name: "details", label: "Details", type: "textarea" },
];

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};
const fmtSize = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${(n / 1024).toFixed(1)} KB`);

function usePageDataset(enabled: boolean) {
  return useQuery({
    queryKey: pageDatasetQueryKey(),
    queryFn: async () => {
      const raw = await getModuleDatasetFn({ data: pageKey() });
      const data = (raw ? JSON.parse(raw) : {}) as { activity?: ActivityEntry[]; files?: PageFile[] };
      return { activity: data.activity ?? [], files: data.files ?? [] };
    },
    enabled,
    staleTime: 0,
  });
}

/**
 * Fill a page's saved form values back in when it opens (only for pages that have a saved form,
 * listed in the small "page-index" dataset, so other pages make no extra request).
 */
function useRestoreSavedForm() {
  const pathname = useRouterState({ select: (st) => st.location.pathname });
  const index = useQuery({
    queryKey: pageIndexQueryKey,
    queryFn: async () => {
      const raw = await getModuleDatasetFn({ data: PAGE_INDEX_KEY });
      return ((raw ? JSON.parse(raw) : {}) as { saved?: string[] }).saved ?? [];
    },
    staleTime: Infinity,
  });
  useEffect(() => {
    const path = pathname.replace(/\/+$/, "") || "/";
    if (!index.data?.includes(path)) return;
    let cancelled = false;
    let observer: MutationObserver | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let stop: ReturnType<typeof setTimeout> | undefined;
    const done = new Set<string>();
    let announced = false;
    void getModuleDatasetFn({ data: `page:${path}` }).then((raw) => {
      const form = ((raw ? JSON.parse(raw) : {}) as { form?: SavedForm }).form;
      const main = document.querySelector("main");
      if (cancelled || !main || !form?.fields?.length) return;
      const run = () => {
        if (applyFields(main, form.fields, done) && !announced) {
          announced = true;
          toast.info(`Showing your saved changes from ${fmtDate(form.at)}.`);
        }
      };
      timer = setTimeout(run, 400);
      observer = new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(run, 250);
      });
      observer.observe(main, { childList: true, subtree: true });
      stop = setTimeout(() => observer?.disconnect(), 20000);
    });
    return () => {
      cancelled = true;
      observer?.disconnect();
      clearTimeout(timer);
      clearTimeout(stop);
    };
  }, [pathname, index.data]);
}

/** Renders the shared page dialogs (viewer, forms, files, activity log, more-actions menu). */
export function PageActionsHost() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [event, setEvent] = useState<PageActionEvent | null>(null);
  const close = () => setEvent(null);

  useEffect(() => {
    registerPageQueryClient(queryClient);
    registerPageNavigate((to) => void router.navigate({ to }));
    return onPageAction(setEvent);
  }, [queryClient, router]);

  useRestoreSavedForm();

  const listOpen = event?.kind === "files" || event?.kind === "history";
  const dataset = usePageDataset(listOpen);

  const removeFile = async (file: PageFile) => {
    await removeModuleDatasetItemFn({ data: { key: pageKey(), field: "files", id: file.id } });
    await queryClient.invalidateQueries({ queryKey: pageDatasetQueryKey() });
    toast.success(`Removed ${file.name}`);
  };

  return (
    <>
      {/* Full-size view of a section */}
      <Dialog open={event?.kind === "viewer"} onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{event?.kind === "viewer" ? event.title : ""}</DialogTitle>
            <DialogDescription>Full view of this section. Download it as a PDF or Excel file below.</DialogDescription>
          </DialogHeader>
          {event?.kind === "viewer" && (
            <div className="rounded-lg border border-border bg-background p-3" dangerouslySetInnerHTML={{ __html: event.html }} />
          )}
          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => event?.kind === "viewer" && void exportPageReport(event.title, "xlsx")}>
              <FileSpreadsheet className="mr-1.5 h-4 w-4" /> Excel
            </Button>
            <Button size="sm" onClick={() => event?.kind === "viewer" && void exportPageReport(event.title, "pdf")}>
              <Download className="mr-1.5 h-4 w-4" /> Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request / form saved to the page's activity log */}
      <QuickCreateDialog
        open={event?.kind === "form"}
        onOpenChange={(o) => !o && close()}
        title={event?.kind === "form" ? event.title : ""}
        description="This is saved to the page's activity log, where everyone working on this page can see it."
        fields={event?.kind === "form" && event.fields?.length ? event.fields : DEFAULT_FIELDS}
        submitLabel={event?.kind === "form" ? (event.submitLabel ?? "Save") : "Save"}
        onSubmit={(values) => {
          if (event?.kind !== "form") return;
          const fields = event.fields?.length ? event.fields : DEFAULT_FIELDS;
          const details = Object.fromEntries(
            fields.filter((f) => String(values[f.name] ?? "").trim()).map((f) => [f.label, String(values[f.name])]),
          );
          void logPageAction(event.title, { kind: "request", details, message: `${event.title} saved.` });
          close();
        }}
      />

      {/* Page files */}
      <Dialog open={event?.kind === "files"} onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Page Files</DialogTitle>
            <DialogDescription>Files uploaded on this page (up to 2 MB each). Everyone working on this page can download them.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[55vh] space-y-2 overflow-y-auto">
            {dataset.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
            {!dataset.isLoading && !dataset.data?.files.length && (
              <p className="text-sm text-muted-foreground">No files uploaded on this page yet.</p>
            )}
            {dataset.data?.files.map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-2.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{f.name}</p>
                  <p className="text-xs text-muted-foreground tabular">
                    {fmtSize(f.size)}
                    {f.rows != null ? ` · ${f.rows} rows` : ""} · {fmtDate(f.uploadedAt)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button asChild variant="outline" size="sm">
                    <a href={f.dataUrl} download={f.name}>
                      <Download className="mr-1 h-3.5 w-3.5" /> Download
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" aria-label={`Remove ${f.name}`} onClick={() => void removeFile(f)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <Button size="sm" onClick={() => openPageFiles("Page Files")}>
              <Upload className="mr-1.5 h-4 w-4" /> Upload file
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Activity log / audit trail / history */}
      <Dialog open={event?.kind === "history"} onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{event?.kind === "history" ? event.title : "Activity Log"}</DialogTitle>
            <DialogDescription>Requests, actions and uploads recorded on this page, newest first.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-2 overflow-y-auto">
            {dataset.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
            {!dataset.isLoading && !dataset.data?.activity.length && (
              <p className="text-sm text-muted-foreground">
                Nothing has been recorded on this page yet. Requests, actions and file uploads made here will appear in this log.
              </p>
            )}
            {dataset.data?.activity.map((a) => (
              <div key={a.id} className="rounded-lg border border-border p-2.5 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium">{a.action}</p>
                  <span className="shrink-0 text-xs text-muted-foreground tabular">{fmtDate(a.at)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {a.code} · {a.kind === "request" ? "Request" : a.kind === "upload" ? "Upload" : "Action"}
                </p>
                {a.details && Object.keys(a.details).length > 0 && (
                  <dl className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs">
                    {Object.entries(a.details).map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt className="text-muted-foreground">{k}</dt>
                        <dd className="break-words">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* "More" actions menu, anchored where the button was */}
      <DropdownMenu open={event?.kind === "menu"} onOpenChange={(o) => !o && close()}>
        <DropdownMenuTrigger asChild>
          <span
            aria-hidden
            className="pointer-events-none fixed h-0 w-0"
            style={event?.kind === "menu" ? { left: event.x, top: event.y } : { left: 0, top: 0 }}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onSelect={() => void exportPageReport(undefined, "pdf", "page")}>
            <FileText className="mr-2 h-4 w-4" /> Download page as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => void exportPageReport(undefined, "xlsx", "page")}>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Download page as Excel
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => void exportPageReport(undefined, "csv", "page")}>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Download page as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Print page
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => openPageFiles("Page Files")}>
            <Upload className="mr-2 h-4 w-4" /> Upload a file
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => showPageFiles()}>
            <Download className="mr-2 h-4 w-4" /> Page files
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => openPageHistory("Activity Log")}>
            <History className="mr-2 h-4 w-4" /> Activity log
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() =>
              void navigator.clipboard
                ?.writeText(window.location.href)
                .then(() => toast.success("Page link copied."))
                .catch(() => toast.error("Couldn't copy the link."))
            }
          >
            <Link2 className="mr-2 h-4 w-4" /> Copy page link
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => void refreshPageData()}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh data
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
