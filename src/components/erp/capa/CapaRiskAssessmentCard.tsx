import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldAlert, ArrowDownRight, Activity, Edit2, Check, Sparkles } from "lucide-react";
import { CapaRecord } from "@/services/capaTypes";
import { toast } from "sonner";

interface CapaRiskAssessmentCardProps {
  record: CapaRecord;
  onChange?: (field: keyof CapaRecord, value: any) => void;
}

export function CapaRiskAssessmentCard({ record, onChange }: CapaRiskAssessmentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [severity, setSeverity] = useState(record.severityScore || 6);
  const [occurrence, setOccurrence] = useState(record.occurrenceScore || 6);
  const [detection, setDetection] = useState(record.detectionScore || 5);

  const handleSave = () => {
    if (onChange) {
      const s = Math.min(10, Math.max(1, Number(severity) || 1));
      const o = Math.min(10, Math.max(1, Number(occurrence) || 1));
      const d = Math.min(10, Math.max(1, Number(detection) || 1));
      const newInitialRpn = s * o * d;
      const newResidual = Math.round(newInitialRpn * 0.2); // ~80% reduction
      const reduction = Math.round(((newInitialRpn - newResidual) / newInitialRpn) * 100);

      onChange("severityScore", s);
      onChange("occurrenceScore", o);
      onChange("detectionScore", d);
      onChange("initialRpn", newInitialRpn);
      onChange("residualRpn", newResidual);
      onChange("rpnReductionPercent", reduction);
    }
    setIsEditing(false);
    toast.success("Recalculated FMEA Risk Priority Numbers (RPN)");
  };

  return (
    <Card className="shadow-xs border-border/80 min-w-0">
      <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between gap-2 flex-wrap">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          FMEA Risk Assessment & RPN Reduction
        </CardTitle>

        {onChange && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setSeverity(record.severityScore);
                setOccurrence(record.occurrenceScore);
                setDetection(record.detectionScore);
                setIsEditing(true);
              }
            }}
            className="h-7 text-xs px-2.5 font-medium border-border hover:bg-muted"
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Save RPN
              </>
            ) : (
              <>
                <Edit2 className="w-3 h-3 mr-1" />
                Adjust Scores
              </>
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-4 space-y-4 min-w-0">
        {/* RPN Comparison Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 min-w-0">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Initial RPN */}
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                Initial Pre-CAPA RPN
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black font-mono text-rose-600 dark:text-rose-400">
                  {record.initialRpn}
                </span>
                <span className="text-[11px] text-rose-600 font-semibold">
                  (S:{record.severityScore} × O:{record.occurrenceScore} × D:{record.detectionScore})
                </span>
              </div>
            </div>

            <ArrowDownRight className="w-6 h-6 text-emerald-600 shrink-0" />

            {/* Residual RPN */}
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                Target Residual RPN
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {record.residualRpn}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">(S:6 × O:2 × D:3)</span>
              </div>
            </div>
          </div>

          {/* Reduction Badge */}
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 shadow-xs shrink-0">
            <ArrowDownRight className="w-3.5 h-3.5 mr-1" />
            -{record.rpnReductionPercent}% Risk Reduction
          </Badge>
        </div>

        {/* 3 Parameter Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs min-w-0">
          <div className="p-3 rounded-lg bg-muted/40 border border-border/60 min-w-0">
            <span className="text-muted-foreground block text-[11px]">Severity Impact (S)</span>
            <div className="flex items-center justify-between mt-1">
              {isEditing ? (
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="h-7 w-16 text-xs font-mono font-bold bg-white dark:bg-slate-900"
                />
              ) : (
                <span className="text-base font-bold text-foreground font-mono">{record.severityScore} / 10</span>
              )}
              <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded">Major</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Board rework & potential intermittent contact.</p>
          </div>

          <div className="p-3 rounded-lg bg-muted/40 border border-border/60 min-w-0">
            <span className="text-muted-foreground block text-[11px]">Occurrence Frequency (O)</span>
            <div className="flex items-center justify-between mt-1">
              {isEditing ? (
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={occurrence}
                  onChange={(e) => setOccurrence(Number(e.target.value))}
                  className="h-7 w-16 text-xs font-mono font-bold bg-white dark:bg-slate-900"
                />
              ) : (
                <span className="text-base font-bold text-foreground font-mono">{record.occurrenceScore} → 2</span>
              )}
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">Controlled</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Reduced from repeated (6) to isolated (2) via sensor.</p>
          </div>

          <div className="p-3 rounded-lg bg-muted/40 border border-border/60 min-w-0">
            <span className="text-muted-foreground block text-[11px]">Detection Capability (D)</span>
            <div className="flex items-center justify-between mt-1">
              {isEditing ? (
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={detection}
                  onChange={(e) => setDetection(Number(e.target.value))}
                  className="h-7 w-16 text-xs font-mono font-bold bg-white dark:bg-slate-900"
                />
              ) : (
                <span className="text-base font-bold text-foreground font-mono">{record.detectionScore} → 3</span>
              )}
              <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded">High Detection</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Automated Optical Inspection catching 99.8% in-line.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
