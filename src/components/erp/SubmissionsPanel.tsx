import { Fragment, useState } from "react";
import { Download } from "lucide-react";
import { exportRecords } from "@/lib/recordExport";

export type Submission = {
  id: number;
  code: string;
  title: string;
  submittedAt: string;
  status: string;
  details: Record<string, string>;
};

/** Saved entries created from a page's "New …" form, newest first. Renders nothing until there is one. */
export function SubmissionsPanel({ title, items }: { title: string; items: Submission[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  if (!items.length) return null;
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-foreground">
          {title} <span className="ml-1 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-primary tabular">{items.length}</span>
        </h3>
        <button
          type="button"
          onClick={() => exportRecords(title, items.map((s) => ({ code: s.code, title: s.title, status: s.status, submitted: s.submittedAt, ...s.details })), "xlsx")}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-muted/50 text-muted-foreground text-[10px] uppercase font-semibold border-b">
            <tr>
              <th className="py-2 px-2.5">Reference</th>
              <th className="py-2 px-2.5">Title</th>
              <th className="py-2 px-2.5">Submitted</th>
              <th className="py-2 px-2.5">Status</th>
              <th className="py-2 px-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {items.map((s) => (
              <Fragment key={s.id}>
                <tr>
                  <td className="py-2 px-2.5 font-mono font-semibold text-foreground">{s.code}</td>
                  <td className="py-2 px-2.5 text-foreground">{s.title}</td>
                  <td className="py-2 px-2.5 text-muted-foreground tabular">{s.submittedAt}</td>
                  <td className="py-2 px-2.5">
                    <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold bg-warning/10 text-warning">{s.status}</span>
                  </td>
                  <td className="py-2 px-2.5 text-right">
                    <button type="button" onClick={() => setExpanded(expanded === s.id ? null : s.id)} className="text-[11px] font-semibold text-primary hover:underline">
                      {expanded === s.id ? "Hide" : "Details"}
                    </button>
                  </td>
                </tr>
                {expanded === s.id ? (
                  <tr>
                    <td colSpan={5} className="bg-muted/30 px-2.5 py-2">
                      <dl className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
                        {Object.entries(s.details).map(([k, v]) => (
                          <div key={k} className="flex gap-2 text-[11px]">
                            <dt className="text-muted-foreground">{k}:</dt>
                            <dd className="font-medium text-foreground">{v || "—"}</dd>
                          </div>
                        ))}
                      </dl>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Build a new submission from captured form values. */
export function makeSubmission(prev: Submission[], prefix: string, details: Record<string, string>, titleField?: string): Submission {
  const id = Math.max(0, ...prev.map((p) => p.id)) + 1;
  const year = new Date().getFullYear();
  const title =
    (titleField && details[titleField]) ||
    Object.values(details).find((v) => v && v.length > 2) ||
    `${prefix} #${id}`;
  return {
    id,
    code: `${prefix}-${year}-${String(id).padStart(3, "0")}`,
    title,
    submittedAt: new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    status: "Submitted",
    details,
  };
}
