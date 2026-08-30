import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import type { WorkInstructionFormInput, WorkInstructionRecord } from "@/services/types";

export function WorkInstructionOverviewSection({
  form,
  record,
  onNavigateTab,
}: {
  form: UseFormReturn<WorkInstructionFormInput>;
  record: WorkInstructionRecord;
  onNavigateTab?: (tabId: string) => void;
}) {
  return (
    <div className="space-y-5">
      {/* Card: Work Instruction Overview */}
      <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold">Work Instruction Overview & Operation Parameters</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1 hover:text-primary cursor-pointer"
            onClick={() => onNavigateTab?.("operation_details")}
          >
            <Edit className="h-3.5 w-3.5" /> Edit
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-muted-foreground block font-medium">Workstation</span>
              <span className="font-bold text-primary font-mono">{record.workstation}</span>
            </div>
            <div>
              <span className="text-muted-foreground block font-medium">Production Line</span>
              <span className="font-bold text-foreground font-mono">{record.productionLine}</span>
            </div>
            <div>
              <span className="text-muted-foreground block font-medium">Product Family</span>
              <span className="font-semibold text-foreground">{record.productFamily}</span>
            </div>
            <div>
              <span className="text-muted-foreground block font-medium">Product Model</span>
              <span className="font-semibold text-foreground font-mono">{record.productModel}</span>
            </div>
            <div>
              <span className="text-muted-foreground block font-medium">Process Name</span>
              <span className="font-semibold text-foreground">{record.processName}</span>
            </div>
            <div>
              <span className="text-muted-foreground block font-medium">Operation Number</span>
              <span className="font-bold text-foreground font-mono">{record.operationNumber}</span>
            </div>
            <div>
              <span className="text-muted-foreground block font-medium">Instruction Category</span>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                {record.instructionCategory}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground block font-medium">Priority</span>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-[10px]">
                {record.priority}
              </Badge>
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-foreground block">Operation Description</span>
            <p className="text-muted-foreground leading-relaxed">
              {record.operationDescription}
            </p>
          </div>

          {/* Visual Instruction Control Steps */}
          <div className="space-y-2 pt-1">
            <span className="font-bold text-foreground block">Visual Instruction Control Steps</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-border bg-slate-50 dark:bg-slate-800/40 text-xs">
                <span className="font-bold text-primary block text-xs">Alignment Control</span>
                <span className="text-muted-foreground text-[11px]">Verify locator pins and latch initial seating.</span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-slate-50 dark:bg-slate-800/40 text-xs">
                <span className="font-bold text-primary block text-xs">Torquing Specification</span>
                <span className="text-muted-foreground text-[11px]">Torque M6 bolts in star pattern to 12.5 Nm.</span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-slate-50 dark:bg-slate-800/40 text-xs">
                <span className="font-bold text-primary block text-xs">Integrity Verification</span>
                <span className="text-muted-foreground text-[11px]">Check continuity and seal integrity.</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
