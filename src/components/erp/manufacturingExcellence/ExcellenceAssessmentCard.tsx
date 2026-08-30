import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Gauge } from "lucide-react";
import type { ManufacturingExcellenceRecord } from "@/services/types";

interface ExcellenceAssessmentCardProps {
  record: ManufacturingExcellenceRecord;
  onChange: (field: keyof ManufacturingExcellenceRecord, value: any) => void;
  isEditing?: boolean;
}

export const ExcellenceAssessmentCard: React.FC<ExcellenceAssessmentCardProps> = ({
  record,
  onChange,
  isEditing = true,
}) => {
  const scoreFields = [
    { key: "productivityIndex", label: "Productivity Index", val: record.productivityIndex, unit: "/ 100" },
    { key: "qualityPerformance", label: "Quality Performance", val: record.qualityPerformance, unit: "/ 100" },
    { key: "deliveryPerformance", label: "Delivery Performance", val: record.deliveryPerformance, unit: "/ 100" },
    { key: "costEfficiency", label: "Cost Efficiency", val: record.costEfficiency, unit: "/ 100" },
    { key: "safetyPerformance", label: "Safety Performance", val: record.safetyPerformance, unit: "/ 100" },
    { key: "sustainabilityAssessmentScore", label: "Sustainability Score", val: record.sustainabilityAssessmentScore, unit: "/ 100" },
  ] as const;

  return (
    <Card className="border-border rounded-xl shadow-xs flex flex-col justify-between">
      <div>
        <CardHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-base font-bold text-foreground">
                Operational Excellence Assessment
              </CardTitle>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase">Score</span>
              <span className="font-mono font-bold text-blue-700 dark:text-blue-300 text-xs">
                {record.operationalExcellenceScore} / 100
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
          {/* OEE (%) */}
          <div className="flex flex-col gap-1.5 rounded-lg border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-900/50 dark:bg-blue-950/20">
            <label className="text-xs font-bold text-foreground">OEE (%)</label>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">{record.oeePercentage}%</span>
              <span className="text-[11px] font-semibold text-muted-foreground">Target: 85.00%</span>
            </div>
          </div>

          {/* Operational Score Summary Badge */}
          <div className="flex flex-col gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <label className="text-xs font-bold text-foreground">Operational Excellence</label>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{record.operationalExcellenceScore}</span>
              <span className="text-[11px] font-semibold text-muted-foreground">/ 100 (Very Good)</span>
            </div>
          </div>

          {/* Score Inputs */}
          {scoreFields.map((sc) => (
            <div key={sc.key} className="flex flex-col gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-2.5">
              <label className="text-xs font-semibold text-foreground">{sc.label}</label>
              {isEditing ? (
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    value={sc.val}
                    onChange={(e) => onChange(sc.key as keyof ManufacturingExcellenceRecord, parseFloat(e.target.value) || 0)}
                    className="h-8 text-xs font-bold font-mono"
                  />
                  <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">{sc.unit}</span>
                </div>
              ) : (
                <span className="text-xs font-bold text-foreground font-mono">{sc.val} {sc.unit}</span>
              )}
            </div>
          ))}
        </CardContent>
      </div>
    </Card>
  );
};
