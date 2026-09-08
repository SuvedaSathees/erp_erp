import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle, Lightbulb, ListChecks, Link2, Plus, CheckCheck, RotateCcw } from "lucide-react";
import { AuditChecklistItem, FindingClassification } from "@/services/auditTypes";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

interface AuditChecklistCardProps {
  checklist: AuditChecklistItem[];
  onToggleResult?: (id: string) => void;
  onAddCheck?: (newCheck: AuditChecklistItem) => void;
  onMarkAllConforming?: () => void;
  onResetAll?: () => void;
}

export function AuditChecklistCard({
  checklist,
  onToggleResult,
  onAddCheck,
  onMarkAllConforming,
  onResetAll,
}: AuditChecklistCardProps) {
  const handleAddDefaultCheck = () => {
    const nextClauseNum = checklist.length + 1;
    const newCheck: AuditChecklistItem = {
      id: `chk-${Date.now()}`,
      clauseRef: `Clause 8.${nextClauseNum}`,
      requirement: "Operational control & process parameter monitoring compliance verification",
      areaDepartment: "SMT Assembly Line",
      result: "Conforming",
      findingNote: "Standard operating parameters logged and verified against work instruction.",
      auditor: "Lead Auditor",
    };

    if (onAddCheck) {
      onAddCheck(newCheck);
    }
    toast.success(`Added checklist verification for ${newCheck.clauseRef}`);
  };

  const getBadge = (result: FindingClassification) => {
    switch (result) {
      case "Conforming":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] py-0.5 px-2 font-medium">
            <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
            Conforming
          </Badge>
        );
      case "Minor NC":
        return (
          <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[10px] py-0.5 px-2 font-medium">
            <AlertTriangle className="w-2.5 h-2.5 mr-1" />
            Minor NC
          </Badge>
        );
      case "Major NC":
        return (
          <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-[10px] py-0.5 px-2 font-medium">
            <XCircle className="w-2.5 h-2.5 mr-1" />
            Major NC
          </Badge>
        );
      default:
        return (
          <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/50 dark:text-purple-400 border border-purple-200 dark:border-purple-800 text-[10px] py-0.5 px-2 font-medium">
            <Lightbulb className="w-2.5 h-2.5 mr-1" />
            OFI
          </Badge>
        );
    }
  };

  return (
    <Card className="shadow-xs border-border/80 min-w-0">
      <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-primary shrink-0" />
          <CardTitle className="text-base font-semibold text-foreground">
            Audit Checklists & Verification Log
          </CardTitle>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            ({checklist.length} Clauses)
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {onMarkAllConforming && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllConforming}
              className="h-7 text-[11px] px-2 font-medium text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 border-emerald-300"
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Mark All Conforming
            </Button>
          )}
          {onResetAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetAll}
              className="h-7 text-[11px] px-2 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddDefaultCheck}
            className="h-7 text-[11px] px-2.5 font-medium border-primary/40 text-primary hover:bg-primary/10"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Clause Check
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 min-w-0">
        <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="py-2.5 px-3 w-28">Clause</th>
                <th className="py-2.5 px-3">Audit Question / Criteria</th>
                <th className="py-2.5 px-3">Area / Dept</th>
                <th className="py-2.5 px-3 text-center">Finding</th>
                <th className="py-2.5 px-3">Objective Evidence & Notes</th>
                <th className="py-2.5 px-3">Auditor</th>
                <th className="py-2.5 px-3 text-center">NCR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {checklist.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-foreground">
                    {item.clauseRef}
                  </td>
                  <td className="py-2.5 px-3 text-foreground max-w-xs font-medium">
                    {item.requirement}
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">
                    {item.areaDepartment}
                  </td>
                  <td
                    className="py-2.5 px-3 text-center cursor-pointer"
                    onClick={() => onToggleResult?.(item.id)}
                    title="Click to toggle finding classification"
                  >
                    {getBadge(item.result)}
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground text-[11px] max-w-xs">
                    {item.findingNote}
                  </td>
                  <td className="py-2.5 px-3 text-foreground text-[11px]">
                    {item.auditor}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {item.linkedNcr ? (
                      <Link
                        to="/management/quality-management/ncr-management"
                        className="inline-flex items-center gap-1 font-mono text-[10px] text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-400 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800"
                      >
                        <Link2 className="w-2.5 h-2.5" />
                        {item.linkedNcr}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground text-[11px]">-</span>
                    )}
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
