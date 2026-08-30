import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import type { SopFormInput, SopRecord } from "@/services/types";
import { ProcessFlowViewer } from "./ProcessFlowViewer";

export function SopOverviewSection({
  form,
  record,
  onNavigateTab,
}: {
  form: UseFormReturn<SopFormInput>;
  record: SopRecord;
  onNavigateTab?: (tabId: string) => void;
}) {
  return (
    <div className="space-y-5">
      {/* Card: SOP Overview */}
      <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold">SOP Overview & Operational Parameters</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1 hover:text-primary cursor-pointer"
            onClick={() => onNavigateTab?.("procedure_definition")}
          >
            <Edit className="h-3.5 w-3.5" /> Edit
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-muted-foreground block font-medium">Business Function</span>
              <span className="font-bold text-primary">{record.businessFunction}</span>
            </div>
            <div>
              <span className="text-muted-foreground block font-medium">Process Name</span>
              <span className="font-bold text-foreground">{record.processName}</span>
            </div>
            <div>
              <span className="text-muted-foreground block font-medium">SOP Category</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">
                {record.sopCategory}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground block font-medium">Priority</span>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-[10px]">
                {record.priority}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <span className="font-bold text-foreground block">Process Objective</span>
              <p className="text-muted-foreground leading-relaxed">
                {record.processObjective}
              </p>
            </div>
            <div>
              <span className="font-bold text-foreground block">Scope & Applicability</span>
              <p className="text-muted-foreground leading-relaxed">
                {record.scope} {record.applicability}
              </p>
            </div>
            <div>
              <span className="font-bold text-foreground block">Trigger Event & Expected Output</span>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Trigger:</strong> {record.triggerEvent} — <strong className="text-foreground">Expected Output:</strong> {record.expectedOutput}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Process Flow Diagram Card */}
      <ProcessFlowViewer />
    </div>
  );
}
