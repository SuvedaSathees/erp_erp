import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Clock, Plus, Download, ArrowUpRight, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

export interface GapRemediationItem {
  id: string;
  clauseRef: string;
  gapSummary: string;
  actionPlan: string;
  owner: string;
  dueDate: string;
  severity: "Minor Gap" | "Major Gap";
  status: "Open" | "In Progress" | "Resolved" | "Verified";
  linkedNcr?: string;
  linkedCapa?: string;
}

const INITIAL_REMEDIATIONS: GapRemediationItem[] = [
  {
    id: "REM-001",
    clauseRef: "8.5.1 (c)",
    gapSummary: "Work instruction revision WI-042 pending engineering release.",
    actionPlan: "Update SMT reflow profile tolerances and release ECN-2026-042.",
    owner: "Priya S (Quality Lead)",
    dueDate: "18-Sep-2026",
    severity: "Minor Gap",
    status: "In Progress",
    linkedNcr: "NCR-2026-0047",
    linkedCapa: "CAPA-2026-0012",
  },
  {
    id: "REM-002",
    clauseRef: "8.5.2",
    gapSummary: "Barcode tag scanner missing at station 3 for serialized tracking.",
    actionPlan: "Procure and commission industrial 2D optical scanner ASM-003.",
    owner: "Rajesh K (Manufacturing)",
    dueDate: "15-Sep-2026",
    severity: "Minor Gap",
    status: "Open",
    linkedCapa: "CAPA-2026-0012",
  },
  {
    id: "REM-003",
    clauseRef: "8.5.1 (f)",
    gapSummary: "Thermal profile periodic re-validation report sign-off pending.",
    actionPlan: "Execute annual 12-point thermal profiling run on wave-solder line 2.",
    owner: "Dr. Anita Desai (Lead Auditor)",
    dueDate: "25-Sep-2026",
    severity: "Minor Gap",
    status: "Resolved",
  },
];

export function ComplianceGapRemediationCard() {
  const [remediations, setRemediations] = useState<GapRemediationItem[]>(INITIAL_REMEDIATIONS);

  const cycleStatus = (id: string) => {
    setRemediations((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextStatus: Record<string, GapRemediationItem["status"]> = {
          Open: "In Progress",
          "In Progress": "Resolved",
          Resolved: "Verified",
          Verified: "Open",
        };
        const updated = nextStatus[item.status];
        toast.success(`${item.id} (${item.clauseRef}) status updated to ${updated}`);
        return { ...item, status: updated };
      })
    );
  };

  const handleExport = () => {
    const csvHeader = "Remediation ID,Clause Ref,Severity,Gap Summary,Action Plan,Owner,Due Date,Status,Linked NCR,Linked CAPA\n";
    const csvRows = remediations
      .map(
        (r) =>
          `"${r.id}","${r.clauseRef}","${r.severity}","${r.gapSummary}","${r.actionPlan}","${r.owner}","${r.dueDate}","${r.status}","${r.linkedNcr || ""}","${r.linkedCapa || ""}"`
      )
      .join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Compliance_Gap_Remediation_Plan_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded Gap Remediation Action Plan CSV");
  };

  const handleAdd = () => {
    const newId = `REM-00${remediations.length + 1}`;
    const newItem: GapRemediationItem = {
      id: newId,
      clauseRef: "8.5.4",
      gapSummary: "Finished goods ESD packaging traveler sticker verification pending.",
      actionPlan: "Implement automated ESD tag scan before release to logistics FG-04.",
      owner: "Arun K (Quality Engineer)",
      dueDate: "28-Sep-2026",
      severity: "Minor Gap",
      status: "Open",
    };
    setRemediations((prev) => [newItem, ...prev]);
    toast.success(`Created gap remediation item: ${newId}`);
  };

  return (
    <Card className="shadow-xs border-border/80 overflow-hidden min-w-0">
      <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <div>
            <CardTitle className="text-sm font-bold text-foreground">
              Gap Remediation & Corrective Action Register
            </CardTitle>
            <span className="text-[11px] text-muted-foreground block">
              Remediation tasks for all clause non-conformances and audit gaps
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="h-8 text-xs px-2.5 font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Export Plan</span>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleAdd}
            className="h-8 text-xs px-3 font-semibold bg-[#0B3B7B] hover:bg-[#092e60] text-white flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Action</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/60 text-xs">
          {remediations.map((item) => (
            <div
              key={item.id}
              className="p-3.5 hover:bg-muted/30 transition-colors flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-foreground text-xs">{item.id}</span>
                  <Badge variant="outline" className="text-[10px] font-semibold bg-primary/5 text-primary border-primary/20">
                    Clause {item.clauseRef}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-semibold ${
                      item.severity === "Major Gap"
                        ? "bg-rose-500/10 text-rose-600 border-rose-500/30"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                    }`}
                  >
                    {item.severity}
                  </Badge>
                </div>

                <button
                  type="button"
                  onClick={() => cycleStatus(item.id)}
                  title="Click to cycle status"
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all border shrink-0 ${
                    item.status === "Verified"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25"
                      : item.status === "Resolved"
                      ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 hover:bg-blue-500/25"
                      : item.status === "In Progress"
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/25"
                      : "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30 hover:bg-slate-500/25"
                  }`}
                >
                  {item.status === "Verified" ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  <span>{item.status}</span>
                </button>
              </div>

              <p className="text-foreground font-medium text-xs leading-relaxed">
                {item.gapSummary}
              </p>

              <div className="p-2 rounded bg-muted/40 border border-border/50 text-[11px] text-muted-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div>
                  <span className="font-semibold text-foreground">Action Plan: </span>
                  <span>{item.actionPlan}</span>
                </div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] text-muted-foreground pt-0.5">
                <div className="flex items-center gap-3">
                  <span>Owner: <strong className="text-foreground">{item.owner}</strong></span>
                  <span>•</span>
                  <span>Due: <strong className="text-foreground font-mono">{item.dueDate}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  {item.linkedNcr && (
                    <Link
                      to="/management/quality-management/ncr-management"
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900/50 hover:underline"
                    >
                      <span>{item.linkedNcr}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </Link>
                  )}
                  {item.linkedCapa && (
                    <Link
                      to="/management/quality-management/capa"
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-900/50 hover:underline"
                    >
                      <span>{item.linkedCapa}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ComplianceGapRemediationCard;
