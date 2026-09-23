import React, { useState } from "react";
import {
  PieChart,
  DollarSign,
  ShieldCheck,
  Activity,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import type { BomEngineeringRecord } from "@/services/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BomOverviewGridProps {
  record: BomEngineeringRecord;
  onNavigateTab?: (tab: string) => void;
}

export const BomOverviewGrid: React.FC<BomOverviewGridProps> = ({
  record,
  onNavigateTab,
}) => {
  const [activeModal, setActiveModal] = useState<"material" | "cost" | "quality" | "manufacturing" | null>(null);

  const categoryBreakdown = [
    { label: "Purchased Part", count: 52, percentage: 60, color: "#3b82f6" },
    { label: "Sub-Assembly", count: 12, percentage: 14, color: "#10b981" },
    { label: "Raw Material", count: 10, percentage: 12, color: "#f59e0b" },
    { label: "Electronic Component", count: 8, percentage: 9, color: "#0A3C75" },
    { label: "Others", count: 4, percentage: 5, color: "#64748b" },
  ];

  const topCostlyComponents = [
    { code: "AW-POWER-ELEC", name: "Power Electronics Assembly", cost: 68900 },
    { code: "AW-ROBOT-ARM", name: "Robotic Arm Assembly", cost: 45600 },
    { code: "AW-COIL-TX", name: "Transmitter Coil Assembly", cost: 35800 },
    { code: "AW-EVSE-HSG", name: "EVSE Housing Assembly", cost: 32450 },
    { code: "AW-DOCK-UNIT", name: "Docking Unit Assembly", cost: 28750 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Material & Component Summary */}
      <div className="bg-card border border-border rounded-xl shadow-xs p-4 flex flex-col justify-between hover:border-border/80 transition-all">
        <div>
          <div className="flex items-center gap-2 pb-2.5 border-b border-border mb-3">
            <PieChart className="w-4 h-4 text-blue-500" />
            <h3 className="text-xs font-bold text-foreground">Material & Component Distribution</h3>
          </div>

          <div className="space-y-2 text-xs">
            {categoryBreakdown.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-foreground">{item.count}</span>
                  <span className="text-[10px] text-muted-foreground">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveModal("material")}
          className="pt-3 border-t border-border mt-3 text-[11px] font-bold text-primary hover:underline flex items-center justify-between w-full cursor-pointer"
        >
          <span>Total Items: <strong className="text-foreground">{record.totalItemsCount || 86}</strong></span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Top Costly Components */}
      <div className="bg-card border border-border rounded-xl shadow-xs p-4 flex flex-col justify-between hover:border-border/80 transition-all">
        <div>
          <div className="flex items-center gap-2 pb-2.5 border-b border-border mb-3">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-bold text-foreground">Top Cost Drivers</h3>
          </div>

          <div className="space-y-2 text-xs">
            {topCostlyComponents.map((comp, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="min-w-0 pr-2">
                  <div className="font-bold text-foreground truncate">{comp.code}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{comp.name}</div>
                </div>
                <div className="font-mono font-bold text-foreground shrink-0">
                  ₹{comp.cost.toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveModal("cost")}
          className="pt-3 border-t border-border mt-3 text-[11px] font-bold text-primary hover:underline flex items-center justify-between w-full cursor-pointer"
        >
          View All Cost Analysis <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Compliance Status */}
      <div className="bg-card border border-border rounded-xl shadow-xs p-4 flex flex-col justify-between hover:border-border/80 transition-all">
        <div>
          <div className="flex items-center gap-2 pb-2.5 border-b border-border mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-foreground">Compliance Status</h3>
          </div>

          <div className="space-y-2 text-xs">
            {record.complianceChecklist.map((chk, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">{chk.standard}</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" /> {chk.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveModal("quality")}
          className="pt-3 border-t border-border mt-3 text-[11px] font-bold text-primary hover:underline flex items-center justify-between w-full cursor-pointer"
        >
          View Compliance Checklist <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sourcing & Lead Time Insights */}
      <div className="bg-card border border-border rounded-xl shadow-xs p-4 flex flex-col justify-between hover:border-border/80 transition-all">
        <div>
          <div className="flex items-center gap-2 pb-2.5 border-b border-border mb-3">
            <Activity className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-foreground">Sourcing & Operational Profile</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Make / Buy Strategy</span>
              <span className="font-bold text-foreground">74% Make / 26% Buy</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Primary Material</span>
              <span className="font-semibold text-foreground">{record.materialGrade || "Aluminium"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Approved Vendor</span>
              <span className="font-semibold text-foreground">{record.approvedVendor || "Vendor-PrecisionMould-01"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Max Component Lead Time</span>
              <span className="font-bold font-mono text-amber-600 dark:text-amber-400">{record.leadTimeDays || 14} Days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Supply Risk Profile</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Low Risk</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveModal("manufacturing")}
          className="pt-3 border-t border-border mt-3 text-[11px] font-bold text-primary hover:underline flex items-center justify-between w-full cursor-pointer"
        >
          View Manufacturing Details <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Details Modals */}
      <Dialog open={!!activeModal} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              {activeModal === "material" && <PieChart className="h-5 w-5 text-blue-600" />}
              {activeModal === "cost" && <DollarSign className="h-5 w-5 text-emerald-600" />}
              {activeModal === "quality" && <ShieldCheck className="h-5 w-5 text-emerald-600" />}
              {activeModal === "manufacturing" && <Activity className="h-5 w-5 text-primary" />}
              {activeModal === "material" && "Material & Component Distribution"}
              {activeModal === "cost" && "BOM Cost Breakdown & Pareto Analysis"}
              {activeModal === "quality" && "Standards & Regulatory Compliance"}
              {activeModal === "manufacturing" && "Sourcing & Supplier Operational Profile"}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs max-h-72 overflow-y-auto space-y-2">
            <p className="text-emerald-400 font-bold">=== BOM ENGINEERING SPECIFICATION ===</p>
            <p>BOM Ref: {record.bomId} ({record.bomNumber})</p>
            <p>Product: {record.product} (Rev {record.version.toFixed(1)})</p>
            <div className="mt-3 p-3 rounded bg-slate-800/80 text-slate-300 font-sans text-xs space-y-1.5">
              {activeModal === "material" && (
                <>
                  <p>• Total Components: <strong>{record.totalItemsCount || 86} Items</strong></p>
                  <p>• Purchased Parts: <strong>52 (60%)</strong></p>
                  <p>• Sub-Assemblies: <strong>12 (14%)</strong></p>
                  <p>• Raw Materials: <strong>10 (12%)</strong></p>
                  <p>• Electronic Components: <strong>8 (9%)</strong></p>
                </>
              )}
              {activeModal === "cost" && (
                <>
                  <p>• Total BOM Cost: <strong>₹{record.totalCost?.toLocaleString("en-IN") || "4,88,490"}.00</strong></p>
                  <p>• Power Electronics: <strong>₹68,900</strong></p>
                  <p>• Robotic Arm Assembly: <strong>₹45,600</strong></p>
                  <p>• Transmitter Coil: <strong>₹35,800</strong></p>
                </>
              )}
              {activeModal === "quality" && (
                <>
                  <p>• RoHS Compliance: <strong>Compliant</strong></p>
                  <p>• REACH Compliance: <strong>Compliant</strong></p>
                  <p>• ISO 9001:2015 & ISO 14001: <strong>Compliant</strong></p>
                  <p>• IEC 61851-1 & IEC 61980-1: <strong>Compliant</strong></p>
                </>
              )}
              {activeModal === "manufacturing" && (
                <>
                  <p>• Make/Buy Split: <strong>74% Make / 26% Buy</strong></p>
                  <p>• Primary Material Grade: <strong>{record.materialGrade || "Aluminium 6061-T6"}</strong></p>
                  <p>• Primary Vendor: <strong>{record.approvedVendor || "Vendor-PrecisionMould-01"}</strong></p>
                  <p>• Max Lead Time: <strong>{record.leadTimeDays || 14} Days</strong></p>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => setActiveModal(null)} className="h-8 text-xs bg-primary text-primary-foreground cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
