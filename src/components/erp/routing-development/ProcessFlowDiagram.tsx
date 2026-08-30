import React from "react";
import {
  GitCommit,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
} from "lucide-react";

interface FlowStep {
  opNo: string;
  name: string;
  workCentre: string;
  critical?: boolean;
  type?: "standard" | "critical" | "parallel";
}

const FLOW_STEPS: FlowStep[] = [
  { opNo: "OP-10", name: "Incoming Inspection", workCentre: "QC-01" },
  { opNo: "OP-20", name: "Laser Cutting", workCentre: "MC-01" },
  { opNo: "OP-30", name: "Bending", workCentre: "MC-02" },
  { opNo: "OP-40", name: "Welding", workCentre: "MC-03", critical: true },
  { opNo: "OP-50", name: "Surface Grinding", workCentre: "MC-04" },
  { opNo: "OP-60", name: "Powder Coating", workCentre: "MC-05" },
  { opNo: "OP-70", name: "PCB Assembly", workCentre: "MC-06", critical: true },
  { opNo: "OP-80", name: "Module Assembly", workCentre: "AS-01" },
  { opNo: "OP-90", name: "Sub Assembly", workCentre: "AS-02" },
  { opNo: "OP-100", name: "Final Assembly", workCentre: "AS-03" },
  { opNo: "OP-110", name: "Functional Testing", workCentre: "QC-02", critical: true },
  { opNo: "OP-120", name: "Inspection & Packing", workCentre: "PK-01" },
];

export const ProcessFlowDiagram: React.FC = () => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-4 text-xs space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center pb-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-primary" />
          <h2 className="font-bold text-foreground text-xs">Process Flow Pipeline Diagram</h2>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Standard Op
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Critical Gate
          </span>
          <span className="font-bold text-foreground">12 Total Stages</span>
        </div>
      </div>

      {/* Full-Size Connected Pipeline Grid (No internal scrollbars) */}
      <div className="p-3 rounded-lg bg-muted/15 border border-border/60">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-start">
          {/* Start Badge */}
          <div className="px-3.5 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" /> Start
          </div>

          <ArrowRight className="w-4 h-4 text-muted-foreground/60 shrink-0 hidden sm:block" />

          {/* Pipeline Nodes */}
          {FLOW_STEPS.map((step, idx) => (
            <React.Fragment key={step.opNo}>
              <div
                className={`p-2.5 rounded-lg border transition-all shrink-0 min-w-[135px] max-w-[170px] shadow-sm ${
                  step.critical
                    ? "bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700"
                    : "bg-card border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className={`font-mono text-[10px] font-extrabold ${
                      step.critical
                        ? "text-amber-700 dark:text-amber-400"
                        : "text-primary"
                    }`}
                  >
                    {step.opNo}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-mono bg-muted/60 px-1 py-0.2 rounded">
                    {step.workCentre}
                  </span>
                </div>
                <div className="font-bold text-foreground text-xs truncate" title={step.name}>
                  {step.name}
                </div>
                {step.critical && (
                  <span className="inline-block mt-1 text-[9px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    Critical Gate
                  </span>
                )}
              </div>

              {idx < FLOW_STEPS.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
              )}
            </React.Fragment>
          ))}

          <ArrowRight className="w-4 h-4 text-muted-foreground/60 shrink-0 hidden sm:block" />

          {/* End Badge */}
          <div className="px-3.5 py-2 rounded-lg bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Complete Release
          </div>
        </div>
      </div>
    </div>
  );
};
