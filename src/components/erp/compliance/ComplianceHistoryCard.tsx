import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, CheckCircle2 } from "lucide-react";
import { ComplianceAssessmentHistory } from "@/services/complianceTypes";

interface ComplianceHistoryCardProps {
  history: ComplianceAssessmentHistory[];
}

export function ComplianceHistoryCard({ history }: ComplianceHistoryCardProps) {
  return (
    <Card className="shadow-xs border-border/80">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          Assessment Audit History
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3 p-0">
        <div className="divide-y divide-border/60 text-xs">
          {history.map((item) => (
            <div key={item.id} className="p-3 hover:bg-muted/30 transition-colors space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">{item.date}</span>
                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[9px] py-0 px-1.5">
                  <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                  {item.result} ({item.score}%)
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Assessor: {item.assessor}
              </p>
              <p className="text-[11px] text-muted-foreground/80 italic">
                "{item.notes}"
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
