import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { QualityManagementTabBar } from "@/components/erp/QualityManagementTabBar";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetPage } from "@/widgets/components/WidgetPage";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

export const Route = createFileRoute(
  "/management/quality-management/overview",
)({
  head: () => ({
    meta: [
      { title: "Quality Management Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "Executive quality intelligence, inspection gates, non-conformance containment, and continuous improvement.",
      },
    ],
  }),
  component: QualityDashboardOverviewPage,
});

/**
 * Quality Management Overview is a dynamic widget surface.
 * Its KPI cards, charts, lifecycle pipelines, incidents ledger, and AI quality intelligence
 * are driven by the ERP widget management system with drag-and-drop customization.
 */
export function QualityDashboardOverviewPage() {
  const [showNewIncidentModal, setShowNewIncidentModal] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: "",
    gate: "IPQC In-Process",
    severity: "High",
    partNumber: "",
    qty: "",
    disposition: "Quarantined",
    inspector: "Current Quality Lead",
  });

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncident.title || !newIncident.partNumber) {
      toast.error("Please fill in incident title and part number");
      return;
    }

    toast.success(
      `Quality Incident logged successfully! Routed to MRB for quarantine review.`,
    );
    setShowNewIncidentModal(false);
    setNewIncident({
      title: "",
      gate: "IPQC In-Process",
      severity: "High",
      partNumber: "",
      qty: "",
      disposition: "Quarantined",
      inspector: "Current Quality Lead",
    });
  };

  return (
    <AppShell
      title="Quality Management Overview"
      breadcrumb="Management › Quality Management › Overview"
      description="Executive quality intelligence, inspection gates, non-conformance containment, and continuous improvement."
      tabs={<QualityManagementTabBar />}
    >
      <div className="space-y-6 max-w-full overflow-x-hidden">
        {/* Dynamic Quality Overview Widget Surface */}
        <WidgetPage pageId="quality-overview" skeleton={<OverviewSkeleton />} />

        {/* MODAL: RAPID QUALITY INCIDENT / NCR REGISTRATION WIZARD */}
        {showNewIncidentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Log Quality Incident / NCR</h3>
                    <p className="text-xs text-muted-foreground">Rapid defect intake and quarantine containment</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewIncidentModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateIncident} className="space-y-3 text-xs">
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Defect / Incident Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Housing Dimension Tolerance Out-of-Spec (+0.042mm)"
                    value={newIncident.title}
                    onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Inspection Gate</label>
                    <select
                      value={newIncident.gate}
                      onChange={(e) => setNewIncident({ ...newIncident, gate: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>IQC Receipt</option>
                      <option>IPQC In-Process</option>
                      <option>FQC Final Gate</option>
                      <option>Calibration</option>
                      <option>CAPA Governance</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Severity / Priority</label>
                    <select
                      value={newIncident.severity}
                      onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>Critical</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Minor</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Part / Lot Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. LOT-2026-894"
                      value={newIncident.partNumber}
                      onChange={(e) => setNewIncident({ ...newIncident, partNumber: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Affected Quantity</label>
                    <input
                      type="number"
                      placeholder="e.g. 120"
                      value={newIncident.qty}
                      onChange={(e) => setNewIncident({ ...newIncident, qty: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Immediate Disposition</label>
                  <select
                    value={newIncident.disposition}
                    onChange={(e) => setNewIncident({ ...newIncident, disposition: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                  >
                    <option>Quarantined</option>
                    <option>MRB Review</option>
                    <option>Scrap</option>
                    <option>Rework / Re-machining</option>
                    <option>Conditional Pass</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowNewIncidentModal(false)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                  >
                    Log Incident & Quarantine
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[90px] rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[120px] rounded-xl" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[320px] rounded-xl" />
        <Skeleton className="h-[320px] rounded-xl" />
      </div>
      <Skeleton className="h-[280px] rounded-xl" />
      <Skeleton className="h-[180px] rounded-xl" />
    </div>
  );
}

export default QualityDashboardOverviewPage;
