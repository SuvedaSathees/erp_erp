import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, CheckCircle2 } from "lucide-react";
import type { JigFormInput } from "@/services/types";
import { toast } from "sonner";

export function JigCommissioningSection({
  form,
}: {
  form: UseFormReturn<JigFormInput>;
}) {
  const { watch, setValue } = form;

  const commissioningScore = watch("commissioningScore") ?? 86;

  const handleDownloadDoc = (title: string, filename: string) => {
    const content = `JIG PROTOCOL DOCUMENTATION\n\nTitle: ${title}\nFile: ${filename}\nTarget Jig: EV Charger Top Cover Drilling Jig (JD-2024-0067)\nStatus: Commissioned and Verified on Shopfloor WS-12`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename.replace(/\.[^/.]+$/, "") + ".txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  return (
    <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900 flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">Installation & Commissioning</CardTitle>
            <CardDescription className="text-xs">
              Shopfloor integration, training & maintenance schedule.
            </CardDescription>
          </div>

          {/* Score Card Badge */}
          <div className="flex items-center gap-3 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-xl px-3.5 py-1.5 shrink-0">
            <div>
              <span className="text-[10px] font-semibold uppercase text-teal-600 dark:text-teal-400 block tracking-wider">
                Commissioning Score
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-teal-700 dark:text-teal-300 font-mono">
                  {commissioningScore}
                </span>
                <span className="text-xs text-teal-500 font-semibold">/100</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* Checkboxes List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 border border-border rounded-lg bg-slate-50/50 dark:bg-slate-800/40 text-xs">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="installationCompleted"
                    checked={watch("installationCompleted") ?? true}
                    onCheckedChange={(v) => setValue("installationCompleted", Boolean(v))}
                  />
                  <label htmlFor="installationCompleted" className="font-semibold cursor-pointer whitespace-nowrap">
                    Shopfloor Installation
                  </label>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Done
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 border border-border rounded-lg bg-slate-50/50 dark:bg-slate-800/40 text-xs">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="processIntegration"
                    checked={watch("processIntegration") ?? true}
                    onCheckedChange={(v) => setValue("processIntegration", Boolean(v))}
                  />
                  <label htmlFor="processIntegration" className="font-semibold cursor-pointer whitespace-nowrap">
                    Process Integration
                  </label>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Integrated
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 border border-border rounded-lg bg-slate-50/50 dark:bg-slate-800/40 text-xs">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="operatorTraining"
                    checked={watch("operatorTraining") ?? true}
                    onCheckedChange={(v) => setValue("operatorTraining", Boolean(v))}
                  />
                  <label htmlFor="operatorTraining" className="font-semibold cursor-pointer whitespace-nowrap">
                    Technician Training
                  </label>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 border border-border rounded-lg bg-slate-50/50 dark:bg-slate-800/40 text-xs">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="signOffApproval"
                    checked={watch("signOffApproval") ?? true}
                    onCheckedChange={(v) => setValue("signOffApproval", Boolean(v))}
                  />
                  <label htmlFor="signOffApproval" className="font-semibold cursor-pointer whitespace-nowrap">
                    Production Sign-Off
                  </label>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Signed Off
                </span>
              </div>
            </div>

            {/* Schedule & Maintenance Documents */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <span className="font-bold text-foreground block text-xs">Schedules & Maintenance Protocols</span>

              <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded border border-border">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                  <div className="truncate">
                    <span className="font-semibold block truncate">Maintenance Plan</span>
                    <span className="text-[10px] text-muted-foreground font-mono">maintenance_plan.pdf</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-[11px] gap-1 hover:text-blue-600 cursor-pointer"
                  onClick={() => handleDownloadDoc("Maintenance Plan", "maintenance_plan.pdf")}
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded border border-border">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 text-purple-600 shrink-0" />
                  <div className="truncate">
                    <span className="font-semibold block truncate">Calibration Schedule</span>
                    <span className="text-[10px] text-muted-foreground font-mono">calibration_schedule.pdf</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-[11px] gap-1 hover:text-purple-600 cursor-pointer"
                  onClick={() => handleDownloadDoc("Calibration Schedule", "calibration_schedule.pdf")}
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
