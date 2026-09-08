import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, CheckCircle2, ShieldCheck, GitCommit, FileText } from "lucide-react";
import { RcaRecord } from "@/services/rcaTypes";

interface RcaOverviewCardProps {
  record: RcaRecord;
}

export function RcaOverviewCard({ record }: RcaOverviewCardProps) {
  return (
    <Card className="shadow-xs border-border/80">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-primary" />
          RCA Methodology & Team
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3.5 text-xs">
        {/* Method Banner */}
        <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold tracking-wider">
            Primary Methodology
          </span>
          <span className="font-bold text-foreground text-sm flex items-center gap-1.5 mt-0.5">
            <GitCommit className="w-4 h-4 text-emerald-600" />
            {record.methodology}
          </span>
        </div>

        {/* Investigator */}
        <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-1">
          <span className="text-muted-foreground block text-[11px]">Lead Problem Solver:</span>
          <span className="font-semibold text-foreground">{record.leadInvestigator}</span>
          <span className="text-[10px] text-muted-foreground block">
            Quality Engineering & Reliability
          </span>
        </div>

        {/* Cross-functional team */}
        <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-1.5">
          <span className="text-muted-foreground block text-[11px] font-semibold">
            Investigation Team Members:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {record.teamMembers.map((member, idx) => (
              <span
                key={idx}
                className="bg-card text-foreground px-2 py-0.5 rounded border border-border text-[11px] font-medium"
              >
                {member}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
