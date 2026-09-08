import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle, ListChecks, Plus } from "lucide-react";
import { ComplianceObligationItem } from "@/services/complianceTypes";
import { toast } from "sonner";

interface ComplianceObligationsCardProps {
  obligations: ComplianceObligationItem[];
  onToggleEvaluation?: (id: string) => void;
  onAddObligation?: () => void;
}

export function ComplianceObligationsCard({
  obligations,
  onToggleEvaluation,
  onAddObligation,
}: ComplianceObligationsCardProps) {
  const compliantCount = obligations.filter((o) => o.evaluation === "Compliant").length;

  const getEvaluationBadge = (evaluation: ComplianceObligationItem["evaluation"]) => {
    switch (evaluation) {
      case "Compliant":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] py-0 px-2 font-medium cursor-pointer transition-transform hover:scale-105">
            <CheckCircle2 className="w-2.5 h-2.5 mr-1 shrink-0" />
            Compliant
          </Badge>
        );
      case "Minor Gap":
        return (
          <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[10px] py-0 px-2 font-medium cursor-pointer transition-transform hover:scale-105">
            <AlertTriangle className="w-2.5 h-2.5 mr-1 shrink-0" />
            Minor Gap
          </Badge>
        );
      case "Major Gap":
        return (
          <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-[10px] py-0 px-2 font-medium cursor-pointer transition-transform hover:scale-105">
            <XCircle className="w-2.5 h-2.5 mr-1 shrink-0" />
            Major Gap
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px] py-0 px-2 font-medium text-muted-foreground cursor-pointer">
            {evaluation}
          </Badge>
        );
    }
  };

  return (
    <Card className="shadow-xs border-border/80 overflow-hidden min-w-0">
      <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-primary shrink-0" />
          <CardTitle className="text-sm font-bold text-foreground">
            Compliance Obligations & Clause Verification
          </CardTitle>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-medium">
            <strong className="text-emerald-600 dark:text-emerald-400">{compliantCount}</strong> of {obligations.length} Compliant
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={
              onAddObligation ||
              (() => toast.info("New clause obligation row added to draft register"))
            }
            className="h-7 text-xs px-2.5 font-medium border-border/70 hover:bg-muted text-foreground flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Add Clause</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-xs text-left min-w-[680px]">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold text-[11px]">
              <tr>
                <th className="py-2.5 px-3 w-24">Clause</th>
                <th className="py-2.5 px-3">Obligation Requirement</th>
                <th className="py-2.5 px-3">Function</th>
                <th className="py-2.5 px-3 text-center">Evaluation (Click to Toggle)</th>
                <th className="py-2.5 px-3">Compliance Evidence / Findings</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {obligations.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-foreground whitespace-nowrap">
                    {item.clauseRef}
                  </td>
                  <td className="py-2.5 px-3 text-foreground font-medium max-w-[220px]">
                    {item.requirement}
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">
                    {item.applicableFunction}
                  </td>
                  <td
                    className="py-2.5 px-3 text-center"
                    onClick={() => onToggleEvaluation?.(item.id)}
                    title="Click to toggle compliance evaluation state"
                  >
                    {getEvaluationBadge(item.evaluation)}
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground text-[11px] max-w-[240px]">
                    {item.evidenceNote}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.status === "Verified"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default ComplianceObligationsCard;
