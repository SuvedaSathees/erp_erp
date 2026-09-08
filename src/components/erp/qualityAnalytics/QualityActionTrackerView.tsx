import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Clock, Plus, ExternalLink } from "lucide-react";
import { QualityActionItem } from "@/services/qualityAnalyticsTypes";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface QualityActionTrackerViewProps {
  actions: QualityActionItem[];
}

export function QualityActionTrackerView({ actions }: QualityActionTrackerViewProps) {
  return (
    <Card className="shadow-xs border-border/80">
      <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-primary" />
          Quality Action Tracker & Continuous Improvement Matrix
        </CardTitle>
        <Button
          size="sm"
          onClick={() => toast.info("New Quality Action creation dialog opened")}
          className="h-8 text-xs font-semibold bg-primary text-primary-foreground flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Action
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="py-2.5 px-4">Action Item</th>
                <th className="py-2.5 px-3">Trigger Source</th>
                <th className="py-2.5 px-3">Owner / Dept</th>
                <th className="py-2.5 px-3 font-mono">Due Date</th>
                <th className="py-2.5 px-3 text-center">Priority</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-xs">
              {actions.map((act) => (
                <tr key={act.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-foreground max-w-sm">
                    {act.action}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-[11px] text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {act.source}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-foreground block">{act.owner}</span>
                    <span className="text-[10px] text-muted-foreground">{act.department}</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-foreground">
                    {act.dueDate}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge
                      className={
                        act.priority === "High"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 border-rose-200 text-[10px]"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 border-amber-200 text-[10px]"
                      }
                    >
                      {act.priority}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge
                      className={
                        act.status === "In Progress"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 border-blue-200 text-[10px]"
                          : act.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 border-emerald-200 text-[10px]"
                          : "bg-muted text-muted-foreground border-border text-[10px]"
                      }
                    >
                      {act.status}
                    </Badge>
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
