import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertOctagon, AlertTriangle, Lightbulb, ExternalLink, Plus } from "lucide-react";
import { AuditFindingItem } from "@/services/auditTypes";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

interface AuditFindingsCardProps {
  findings: AuditFindingItem[];
  onRaiseNcr?: (finding: AuditFindingItem) => void;
  onAddFinding?: (newFinding: AuditFindingItem) => void;
}

export function AuditFindingsCard({
  findings,
  onRaiseNcr,
  onAddFinding,
}: AuditFindingsCardProps) {
  const handleAddDefaultFinding = () => {
    const nextNum = findings.length + 1;
    const newFinding: AuditFindingItem = {
      id: `fnd-${Date.now()}`,
      findingNumber: `AUD-FND-00${nextNum}`,
      clauseRef: "Clause 8.5.1",
      classification: "Minor NC",
      description: "Discrepancy identified in workstation ESD log compliance check.",
      department: "Production Assembly",
      responsiblePerson: "Line Supervisor",
      dueDate: "25-Sep-2026",
    };

    if (onAddFinding) {
      onAddFinding(newFinding);
    }
    toast.success(`Added Finding ${newFinding.findingNumber}`);
  };

  return (
    <Card className="shadow-xs border-border/80 min-w-0">
      <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <AlertOctagon className="h-4 w-4 text-rose-600 shrink-0" />
          <CardTitle className="text-base font-semibold text-foreground">
            Audit Findings & Non-Conformance Log
          </CardTitle>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            ({findings.length} Findings)
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAddDefaultFinding}
          className="h-7 text-xs px-2.5 font-medium border-rose-300 text-rose-700 dark:text-rose-400 hover:bg-rose-50"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Log Finding
        </Button>
      </CardHeader>
      <CardContent className="pt-2 p-0 min-w-0">
        <div className="divide-y divide-border/60 text-xs min-w-0">
          {findings.map((f) => (
            <div
              key={f.id}
              className="p-3 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-foreground">{f.findingNumber}</span>
                  <span className="font-mono text-muted-foreground text-[11px]">({f.clauseRef})</span>
                  <Badge
                    className={
                      f.classification === "Major NC"
                        ? "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-[10px] py-0 px-1.5"
                        : f.classification === "Minor NC"
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[10px] py-0 px-1.5"
                        : "bg-blue-50 text-primary dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-[10px] py-0 px-1.5"
                    }
                  >
                    {f.classification}
                  </Badge>
                </div>
                <p className="text-foreground font-medium">{f.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>Dept: <strong className="text-foreground/80">{f.department}</strong></span>
                  <span>•</span>
                  <span>Owner: {f.responsiblePerson}</span>
                  <span>•</span>
                  <span>Due: <strong className="text-rose-600 dark:text-rose-400">{f.dueDate}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {f.ncrReference ? (
                  <Link
                    to="/management/quality-management/ncr-management"
                    className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-md border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors"
                  >
                    View {f.ncrReference}
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </Link>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onRaiseNcr?.(f);
                      toast.success(`NCR draft initiated for finding ${f.findingNumber}`);
                    }}
                    className="h-8 text-xs font-medium text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Raise NCR
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
