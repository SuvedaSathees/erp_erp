import React, { useState } from "react";
import {
  FileCheck,
  Factory,
  Users,
  ShieldAlert,
  Calculator,
  ArrowRight,
} from "lucide-react";
import type { ApqpRecord } from "@/services/types";
import { Badge } from "@/components/ui/badge";
import { ReadinessDetailsModal } from "./ReadinessDetailsModal";

interface ApqpScoreCardsGridProps {
  record: ApqpRecord;
}

export const ApqpScoreCardsGrid: React.FC<ApqpScoreCardsGridProps> = ({
  record,
}) => {
  const [activeModalDomain, setActiveModalDomain] = useState<
    "design" | "validation" | "supplier" | "risk" | "cost" | null
  >(null);

  const cards = [
    {
      title: "Design Readiness",
      score: record.designScore ?? 85,
      status: "Capable",
      badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
      metrics: [
        { label: "CAD Maturity", value: "94%" },
        { label: "BOM Structure", value: "Released" },
      ],
      icon: FileCheck,
      color: "#10b981", // Emerald
      domain: "design" as const,
    },
    {
      title: "Validation Readiness",
      score: record.validationScore ?? 82,
      status: "On Track",
      badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25",
      metrics: [
        { label: "PPAP Level", value: "Level 3" },
        { label: "Trial Production", value: "Passed" },
      ],
      icon: Factory,
      color: "#3b82f6", // Blue
      domain: "validation" as const,
    },
    {
      title: "Supplier Quality",
      score: record.supplierQualityScore ?? 80,
      status: "Qualified",
      badgeClass: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/25",
      metrics: [
        { label: "Tier-1 Audited", value: "12 / 12" },
        { label: "Quality PPM", value: "< 25 PPM" },
      ],
      icon: Users,
      color: "#f97316", // Orange
      domain: "supplier" as const,
    },
    {
      title: "Risk Readiness",
      score: record.riskScore ?? 78,
      status: "Controlled",
      badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25",
      metrics: [
        { label: "Max PFMEA RPN", value: "84 (Med)" },
        { label: "Critical Risks", value: "0 Open" },
      ],
      icon: ShieldAlert,
      color: "#ef4444", // Red
      domain: "risk" as const,
    },
    {
      title: "Cost Readiness",
      score: record.costReadinessScore ?? 83,
      status: "Favorable",
      badgeClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25",
      metrics: [
        { label: "Cost Variance", value: "-2.4% Fav" },
        { label: "Capex Target", value: "On Budget" },
      ],
      icon: Calculator,
      color: "#14b8a6", // Teal
      domain: "cost" as const,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs w-full max-w-full min-w-0">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className="bg-card border border-border rounded-xl shadow-xs p-3.5 flex flex-col justify-between hover:shadow-md transition-all min-w-0"
            >
              {/* Top Row: Title & Icon */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className="font-bold text-foreground text-xs leading-snug whitespace-nowrap truncate"
                    title={c.title}
                  >
                    {c.title}
                  </span>
                  <div
                    className="p-1.5 rounded-lg shrink-0"
                    style={{ backgroundColor: `${c.color}15`, color: c.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Big Score Block */}
                <div className="p-2.5 rounded-lg bg-muted/20 border border-border/40 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-1 shrink-0">
                      <span className="text-xl font-black text-foreground font-mono whitespace-nowrap">
                        {c.score}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-semibold whitespace-nowrap">
                        / 100
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold px-2 py-0.5 whitespace-nowrap shrink-0 ${c.badgeClass}`}
                    >
                      {c.status}
                    </Badge>
                  </div>

                  {/* Progress Meter */}
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${c.score}%`,
                        backgroundColor: c.color,
                      }}
                    />
                  </div>
                </div>

                {/* Micro-Metrics Parameter List */}
                <div className="mt-2.5 space-y-1.5 px-0.5">
                  {c.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="flex justify-between items-center text-xs gap-2">
                      <span className="text-muted-foreground whitespace-nowrap text-[11px]">
                        {m.label}:
                      </span>
                      <span className="font-semibold text-foreground font-mono text-[11px] whitespace-nowrap">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom: Action link opening interactive modal */}
              <button
                type="button"
                onClick={() => setActiveModalDomain(c.domain)}
                className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-end gap-1 cursor-pointer pt-2 border-t border-border/40"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Interactive Detail Modal */}
      <ReadinessDetailsModal
        open={activeModalDomain !== null}
        onOpenChange={(open) => !open && setActiveModalDomain(null)}
        domain={activeModalDomain}
        record={record}
      />
    </>
  );
};
