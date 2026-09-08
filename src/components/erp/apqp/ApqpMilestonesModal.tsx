import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, Clock, AlertCircle, Download } from "lucide-react";
import { toast } from "sonner";
import type { ApqpMilestone } from "@/services/types";

interface ApqpMilestonesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestones: ApqpMilestone[];
  projectName: string;
}

export const ApqpMilestonesModal: React.FC<ApqpMilestonesModalProps> = ({
  open,
  onOpenChange,
  milestones,
  projectName,
}) => {
  const handleExportCsv = () => {
    const lines = [
      `APQP PROGRAM MILESTONES SCHEDULE - ${projectName.toUpperCase()}`,
      `Export Date,${new Date().toLocaleDateString()}`,
      "",
      "Milestone ID,Milestone Title,Target Date,Status,Phase",
      ...milestones.map(
        (m, idx) =>
          `"${m.id || `MS-0${idx + 1}`}","${m.title}","${m.targetDate}","${m.status}","${m.phase || "-"}"`
      ),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `APQP_Milestones_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded APQP Milestones Schedule CSV");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full p-5 bg-card border border-border shadow-2xl rounded-xl">
        <DialogHeader className="pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                APQP Program Milestones Schedule
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {projectName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-2 pt-2 text-xs max-h-[60vh] overflow-y-auto pr-1">
          {milestones.map((ms, idx) => (
            <div
              key={ms.id || idx}
              className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start gap-2.5 min-w-0 pr-2">
                {ms.status === "Completed" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : ms.status === "In Progress" ? (
                  <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold text-foreground leading-snug">{ms.title}</div>
                  {ms.phase && (
                    <span className="text-[10px] text-muted-foreground">{ms.phase}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="font-mono text-[11px] font-semibold text-foreground">
                  {ms.targetDate}
                </span>
                <span
                  className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded mt-0.5 ${
                    ms.status === "Completed"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                  }`}
                >
                  {ms.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="pt-3 border-t border-border flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="h-8 text-xs gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs bg-[#0B3B7B] text-white"
          >
            Close Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
