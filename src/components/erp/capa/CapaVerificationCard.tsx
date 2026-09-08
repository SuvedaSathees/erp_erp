import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ShieldCheck, CheckCheck, TrendingUp, Edit2, Check } from "lucide-react";
import { CapaRecord } from "@/services/capaTypes";
import { toast } from "sonner";

interface CapaVerificationCardProps {
  record: CapaRecord;
  onChange?: (field: keyof CapaRecord, value: any) => void;
}

export function CapaVerificationCard({ record, onChange }: CapaVerificationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [criteria, setCriteria] = useState(record.effectivenessCriteria);
  const [method, setMethod] = useState(record.verificationMethod);
  const [results, setResults] = useState(record.verificationResults);

  const handleSave = () => {
    if (onChange) {
      onChange("effectivenessCriteria", criteria);
      onChange("verificationMethod", method);
      onChange("verificationResults", results);
    }
    setIsEditing(false);
    toast.success("Updated CAPA Verification and Closure Criteria");
  };

  const toggleEffective = () => {
    if (onChange) {
      const nextEffective = !record.isEffective;
      onChange("isEffective", nextEffective);
      toast.success(`Effectiveness status set to: ${nextEffective ? "Validated Effective" : "Pending Verification"}`);
    }
  };

  return (
    <Card className="shadow-xs border-border/80 min-w-0">
      <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between gap-2 flex-wrap">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <CheckCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Effectiveness Verification & Closure Criteria
        </CardTitle>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleEffective}
            className="cursor-pointer select-none"
            title="Click to toggle status"
          >
            <Badge
              className={
                record.isEffective
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px]"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[10px]"
              }
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {record.isEffective ? "Validated Effective" : "Pending Verification"}
            </Badge>
          </button>

          {onChange && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setCriteria(record.effectivenessCriteria);
                  setMethod(record.verificationMethod);
                  setResults(record.verificationResults);
                  setIsEditing(true);
                }
              }}
              className="h-7 text-xs px-2.5 font-medium border-border hover:bg-muted"
            >
              {isEditing ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Done
                </>
              ) : (
                <>
                  <Edit2 className="w-3 h-3 mr-1" />
                  Edit Criteria
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3 text-xs min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
          <div className="p-3 rounded-lg bg-muted/40 border border-border/60 min-w-0">
            <span className="text-muted-foreground block text-[11px] font-medium">
              Acceptance Criteria
            </span>
            {isEditing ? (
              <Textarea
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                rows={2}
                className="mt-1 text-xs resize-none bg-white dark:bg-slate-900"
              />
            ) : (
              <p className="mt-1 text-foreground font-medium leading-relaxed break-words">
                {record.effectivenessCriteria}
              </p>
            )}
          </div>

          <div className="p-3 rounded-lg bg-muted/40 border border-border/60 min-w-0">
            <span className="text-muted-foreground block text-[11px] font-medium">
              Verification Methodology
            </span>
            {isEditing ? (
              <Textarea
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                rows={2}
                className="mt-1 text-xs resize-none bg-white dark:bg-slate-900"
              />
            ) : (
              <p className="mt-1 text-foreground font-medium leading-relaxed break-words">
                {record.verificationMethod}
              </p>
            )}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 flex items-start gap-3 min-w-0">
          <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="font-semibold text-emerald-900 dark:text-emerald-200 block">
              Observed Verification Results:
            </span>
            {isEditing ? (
              <Textarea
                value={results}
                onChange={(e) => setResults(e.target.value)}
                rows={2}
                className="mt-1 text-xs resize-none bg-white dark:bg-slate-900"
              />
            ) : (
              <p className="text-emerald-800 dark:text-emerald-300 mt-0.5 leading-relaxed break-words">
                {record.verificationResults}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
